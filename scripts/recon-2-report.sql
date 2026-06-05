-- recon-2-report.sql
-- RUN ON PROD. READ-ONLY (no writes). Requires table `recon_snapshot` loaded from recon-1
--   (columns: pid, type, available_cents, escrow_cents).
--
-- Reconciles on TOTAL holdings, then splits into available + escrow.
--   correct_total     = snapshot_total - post_sent + GREATEST(post_received, post_cutoff_positive_coins)
--   correct_escrow    = SUM(still-active vouchers)
--   correct_available = correct_total - correct_escrow
--   target_debt       = max(0, -correct_available)
--
-- Why GREATEST(post_received, post_cutoff_positive_coins):
--   post-cutoff inflows are either transfers (ledger: post_received) or fresh MINTS (admin/POI).
--   Mints aren't in the ledger, but they show up as positive coins dated >= cutoff that the wallet
--   holds. Taking the larger preserves legit post-cutoff mints (admin mints are correct) while not
--   double-counting transaction "shortfall" coins (which already equal post_received).
--
-- A wallet that BOTH received transfers AND minted post-cutoff (review_mint_and_receive = true) can
-- be mis-sized by this heuristic — eyeball those before repairing.
-- Missing snapshot row = genuinely $0 pre-deploy (recon-1 covers the whole clone), not an error.
WITH params AS (
  SELECT '2026-05-30 00:00:00'::timestamp AS cutoff
),
owned AS (
  SELECT "changeMakerId"     AS pid, 'cm'::text AS type, amount, escrow, "poiId", "dateMinted" FROM "Credit" WHERE "changeMakerId"     IS NOT NULL
  UNION ALL
  SELECT "exchangePartnerId" AS pid, 'ep'::text AS type, amount, escrow, "poiId", "dateMinted" FROM "Credit" WHERE "exchangePartnerId" IS NOT NULL
  UNION ALL
  SELECT "servePartnerId"    AS pid, 'sp'::text AS type, amount, escrow, "poiId", "dateMinted" FROM "Credit" WHERE "servePartnerId"    IS NOT NULL
),
cur AS (
  SELECT pid, type,
    COALESCE(SUM(amount) FILTER (WHERE NOT escrow), 0) AS current_available,
    COALESCE(SUM(amount) FILTER (WHERE escrow), 0)     AS current_escrow,
    COUNT(*) FILTER (WHERE amount < 0)                 AS negative_rows,
    COUNT(*) FILTER (WHERE escrow)                     AS escrow_rows,
    COALESCE(SUM(amount) FILTER (WHERE NOT escrow AND amount > 0 AND "dateMinted" >= (SELECT cutoff FROM params)), 0) AS post_cutoff_pos
  FROM owned GROUP BY pid, type
),
post_tx AS (
  SELECT pid, SUM(received) AS post_received, SUM(sent) AS post_sent
  FROM (
    SELECT "receiverChangeMakerId" AS pid, amount AS received, 0 AS sent FROM "Transaction", params WHERE "dateTransacted" >= cutoff AND "receiverChangeMakerId" IS NOT NULL
    UNION ALL SELECT "receiverExchangePartnerId", amount, 0 FROM "Transaction", params WHERE "dateTransacted" >= cutoff AND "receiverExchangePartnerId" IS NOT NULL
    UNION ALL SELECT "receiverServePartnerId", amount, 0 FROM "Transaction", params WHERE "dateTransacted" >= cutoff AND "receiverServePartnerId" IS NOT NULL
    UNION ALL SELECT "senderChangeMakerId", 0, amount FROM "Transaction", params WHERE "dateTransacted" >= cutoff AND "senderChangeMakerId" IS NOT NULL
    UNION ALL SELECT "senderExchangePartnerId", 0, amount FROM "Transaction", params WHERE "dateTransacted" >= cutoff AND "senderExchangePartnerId" IS NOT NULL
    UNION ALL SELECT "senderServePartnerId", 0, amount FROM "Transaction", params WHERE "dateTransacted" >= cutoff AND "senderServePartnerId" IS NOT NULL
  ) t GROUP BY pid
),
vouch AS (
  SELECT pid, SUM(amount) AS active_escrow FROM (
    SELECT "changeMakerReceiverId"     AS pid, amount FROM "Voucher" WHERE "dateRedeemed" IS NULL AND "dateRefunded" IS NULL AND "dateArchived" IS NULL AND ("dateExpires" IS NULL OR "dateExpires" > now()) AND "changeMakerReceiverId"     IS NOT NULL
    UNION ALL SELECT "exchangePartnerReceiverId", amount FROM "Voucher" WHERE "dateRedeemed" IS NULL AND "dateRefunded" IS NULL AND "dateArchived" IS NULL AND ("dateExpires" IS NULL OR "dateExpires" > now()) AND "exchangePartnerReceiverId" IS NOT NULL
    UNION ALL SELECT "servePartnerReceiverId",    amount FROM "Voucher" WHERE "dateRedeemed" IS NULL AND "dateRefunded" IS NULL AND "dateArchived" IS NULL AND ("dateExpires" IS NULL OR "dateExpires" > now()) AND "servePartnerReceiverId"    IS NOT NULL
  ) v GROUP BY pid
),
affected AS (
  SELECT DISTINCT pid FROM post_tx
  UNION SELECT pid FROM cur WHERE negative_rows > 0
),
calc AS (
  SELECT c.type, c.pid,
    COALESCE(s.available_cents,0) + COALESCE(s.escrow_cents,0)                                       AS snapshot_total,
    COALESCE(p.post_received,0)                                                                      AS post_received,
    COALESCE(p.post_sent,0)                                                                          AS post_sent,
    c.post_cutoff_pos,
    GREATEST(0, c.post_cutoff_pos - COALESCE(p.post_received,0))                                     AS inferred_mints,
    COALESCE(v.active_escrow,0)                                                                      AS correct_escrow,
    COALESCE(s.available_cents,0) + COALESCE(s.escrow_cents,0)
      - COALESCE(p.post_sent,0)
      + GREATEST(COALESCE(p.post_received,0), c.post_cutoff_pos)                                     AS correct_total,
    c.current_available, c.current_escrow, c.negative_rows,
    (s.pid IS NULL)                                                                                  AS missing_snapshot,
    (COALESCE(p.post_received,0) > 0 AND c.post_cutoff_pos > 0)                                       AS review_mint_and_receive
  FROM cur c
  JOIN affected a ON a.pid = c.pid
  LEFT JOIN recon_snapshot s ON s.pid = c.pid
  LEFT JOIN post_tx p ON p.pid = c.pid
  LEFT JOIN vouch v ON v.pid = c.pid
)
SELECT
  calc.type,
  calc.pid,
  COALESCE(cm."handleId", ep."handleId", sp."handleId") AS handle,
  calc.snapshot_total, calc.post_received, calc.post_sent, calc.post_cutoff_pos, calc.inferred_mints,
  calc.correct_total, calc.correct_escrow,
  (calc.correct_total - calc.correct_escrow)                       AS correct_available,
  calc.current_available, calc.current_escrow,
  (calc.correct_total - calc.correct_escrow) - calc.current_available AS available_delta,
  calc.negative_rows, calc.missing_snapshot, calc.review_mint_and_receive
FROM calc
LEFT JOIN "ChangeMaker"     cm ON calc.type = 'cm' AND cm.id = calc.pid
LEFT JOIN "ExchangePartner" ep ON calc.type = 'ep' AND ep.id = calc.pid
LEFT JOIN "ServePartner"    sp ON calc.type = 'sp' AND sp.id = calc.pid
ORDER BY available_delta;
