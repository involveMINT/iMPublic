-- recon-2-report.sql
-- RUN ON PROD. READ-ONLY (no writes). Requires table `recon_snapshot` loaded from recon-1
--   (columns: pid, type, available_cents, escrow_cents).
--
-- Reports the reconciliation targets using the SAME timestamp-based mint detection as
-- recon-3-repair.sql, so the report and the repair agree exactly.
--   admin_mints       = post-cutoff positive coins with NO received transaction within 2s
--                       (mints/POI are legit; transaction "shortfall" coins sit next to their tx)
--   correct_total     = snapshot_total - post_sent + post_received + admin_mints
--   correct_escrow    = SUM(still-active vouchers)
--   correct_available = correct_total - correct_escrow
--   target_debt       = max(0, -correct_available)
--
-- missing_snapshot = genuinely $0 pre-deploy (recon-1 covers the whole clone), not an error.
WITH params AS (
  SELECT '2026-05-30 00:00:00'::timestamp AS cutoff
),
owned AS (
  SELECT id, "changeMakerId"     AS pid, 'cm'::text AS type, amount, escrow, "dateMinted" FROM "Credit" WHERE "changeMakerId"     IS NOT NULL
  UNION ALL
  SELECT id, "exchangePartnerId" AS pid, 'ep'::text AS type, amount, escrow, "dateMinted" FROM "Credit" WHERE "exchangePartnerId" IS NOT NULL
  UNION ALL
  SELECT id, "servePartnerId"    AS pid, 'sp'::text AS type, amount, escrow, "dateMinted" FROM "Credit" WHERE "servePartnerId"    IS NOT NULL
),
cur AS (
  SELECT pid, type,
    COALESCE(SUM(amount) FILTER (WHERE NOT escrow), 0) AS current_available,
    COALESCE(SUM(amount) FILTER (WHERE escrow), 0)     AS current_escrow,
    COUNT(*) FILTER (WHERE amount < 0)                 AS negative_rows
  FROM owned GROUP BY pid, type
),
post_tx AS (
  SELECT pid, SUM(rcv) AS post_received, SUM(snt) AS post_sent FROM (
    SELECT "receiverChangeMakerId" AS pid, amount AS rcv, 0 AS snt FROM "Transaction", params WHERE "dateTransacted" >= cutoff AND "receiverChangeMakerId" IS NOT NULL
    UNION ALL SELECT "receiverExchangePartnerId", amount, 0 FROM "Transaction", params WHERE "dateTransacted" >= cutoff AND "receiverExchangePartnerId" IS NOT NULL
    UNION ALL SELECT "receiverServePartnerId", amount, 0 FROM "Transaction", params WHERE "dateTransacted" >= cutoff AND "receiverServePartnerId" IS NOT NULL
    UNION ALL SELECT "senderChangeMakerId", 0, amount FROM "Transaction", params WHERE "dateTransacted" >= cutoff AND "senderChangeMakerId" IS NOT NULL
    UNION ALL SELECT "senderExchangePartnerId", 0, amount FROM "Transaction", params WHERE "dateTransacted" >= cutoff AND "senderExchangePartnerId" IS NOT NULL
    UNION ALL SELECT "senderServePartnerId", 0, amount FROM "Transaction", params WHERE "dateTransacted" >= cutoff AND "senderServePartnerId" IS NOT NULL
  ) z GROUP BY pid
),
vouch AS (
  SELECT pid, SUM(amount) AS active_escrow FROM (
    SELECT "changeMakerReceiverId"     AS pid, amount FROM "Voucher" WHERE "dateRedeemed" IS NULL AND "dateRefunded" IS NULL AND "dateArchived" IS NULL AND ("dateExpires" IS NULL OR "dateExpires" > now()) AND "changeMakerReceiverId"     IS NOT NULL
    UNION ALL SELECT "exchangePartnerReceiverId", amount FROM "Voucher" WHERE "dateRedeemed" IS NULL AND "dateRefunded" IS NULL AND "dateArchived" IS NULL AND ("dateExpires" IS NULL OR "dateExpires" > now()) AND "exchangePartnerReceiverId" IS NOT NULL
    UNION ALL SELECT "servePartnerReceiverId",    amount FROM "Voucher" WHERE "dateRedeemed" IS NULL AND "dateRefunded" IS NULL AND "dateArchived" IS NULL AND ("dateExpires" IS NULL OR "dateExpires" > now()) AND "servePartnerReceiverId"    IS NOT NULL
  ) z GROUP BY pid
),
mints AS (
  SELECT o.pid, o.type, SUM(o.amount) AS admin_mints
  FROM owned o, params
  WHERE NOT o.escrow AND o.amount > 0 AND o."dateMinted" >= params.cutoff
    AND NOT EXISTS (
      SELECT 1 FROM "Transaction" t
      WHERE t."dateTransacted" BETWEEN o."dateMinted" - interval '2 seconds' AND o."dateMinted" + interval '2 seconds'
        AND ((o.type='cm' AND t."receiverChangeMakerId"=o.pid) OR (o.type='ep' AND t."receiverExchangePartnerId"=o.pid) OR (o.type='sp' AND t."receiverServePartnerId"=o.pid))
    )
  GROUP BY o.pid, o.type
),
affected AS (
  SELECT DISTINCT pid FROM post_tx
  UNION SELECT pid FROM cur WHERE negative_rows > 0
),
calc AS (
  SELECT c.type, c.pid,
    COALESCE(s.available_cents,0) + COALESCE(s.escrow_cents,0)            AS snapshot_total,
    COALESCE(p.post_received,0)                                           AS post_received,
    COALESCE(p.post_sent,0)                                               AS post_sent,
    COALESCE(m.admin_mints,0)                                             AS admin_mints,
    COALESCE(v.active_escrow,0)                                           AS correct_escrow,
    ( COALESCE(s.available_cents,0) + COALESCE(s.escrow_cents,0)
      - COALESCE(p.post_sent,0) + COALESCE(p.post_received,0) + COALESCE(m.admin_mints,0)
      - COALESCE(v.active_escrow,0) )                                     AS correct_available,
    c.current_available, c.current_escrow, c.negative_rows,
    (s.pid IS NULL)                                                       AS missing_snapshot,
    (COALESCE(p.post_received,0) > 0 AND COALESCE(m.admin_mints,0) > 0)   AS review_mint_and_receive
  FROM cur c
  JOIN affected a ON a.pid = c.pid
  LEFT JOIN recon_snapshot s ON s.pid = c.pid
  LEFT JOIN post_tx p ON p.pid = c.pid
  LEFT JOIN vouch v ON v.pid = c.pid
  LEFT JOIN mints m ON m.pid = c.pid AND m.type = c.type
)
SELECT
  calc.type,
  COALESCE(cm."handleId", ep."handleId", sp."handleId") AS handle,
  calc.snapshot_total, calc.post_received, calc.post_sent, calc.admin_mints,
  calc.correct_available, calc.correct_escrow,
  GREATEST(0, -calc.correct_available)                  AS target_debt,
  calc.current_available, calc.current_escrow,
  (calc.correct_available - calc.current_available)     AS available_delta,
  calc.negative_rows, calc.missing_snapshot, calc.review_mint_and_receive
FROM calc
LEFT JOIN "ChangeMaker"     cm ON calc.type = 'cm' AND cm.id = calc.pid
LEFT JOIN "ExchangePartner" ep ON calc.type = 'ep' AND ep.id = calc.pid
LEFT JOIN "ServePartner"    sp ON calc.type = 'sp' AND sp.id = calc.pid
ORDER BY available_delta;
