-- recon-2-report.sql
-- RUN ON PROD. READ-ONLY (no writes). Requires table `recon_snapshot` loaded from recon-1
--   (columns: pid, type, available_cents, escrow_cents).
--
-- Reconciles on TOTAL holdings, then splits into available + escrow, so wallets that move money
-- through vouchers/escrow (e.g. Jrw740) are handled the same as everyone else:
--   correct_total     = snapshot_total + post-cutoff(received - sent)
--   correct_escrow    = SUM(still-active vouchers)            (escrow only backs active vouchers)
--   correct_available = correct_total - correct_escrow
--   target_debt       = max(0, -correct_available)
--
-- FLAGS (need manual review, NOT auto-repaired by recon-3):
--   post_poi_cents > 0     -> wallet earned POI after cutoff; snapshot+ledger can't size it here.
--   missing_snapshot       -> no baseline; never guess.
-- SET cutoff to the snapshot/deploy moment.
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
    COALESCE(SUM(amount) FILTER (WHERE "poiId" IS NOT NULL AND "dateMinted" >= (SELECT cutoff FROM params)), 0) AS post_poi_cents
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
)
SELECT
  c.type,
  c.pid,
  COALESCE(cm."handleId", ep."handleId", sp."handleId")                  AS handle,
  (COALESCE(s.available_cents,0) + COALESCE(s.escrow_cents,0))           AS snapshot_total,
  COALESCE(p.post_received,0)                                            AS post_received,
  COALESCE(p.post_sent,0)                                                AS post_sent,
  COALESCE(v.active_escrow,0)                                            AS correct_escrow,
  (COALESCE(s.available_cents,0) + COALESCE(s.escrow_cents,0) + COALESCE(p.post_received,0) - COALESCE(p.post_sent,0)) AS correct_total,
  (COALESCE(s.available_cents,0) + COALESCE(s.escrow_cents,0) + COALESCE(p.post_received,0) - COALESCE(p.post_sent,0)) - COALESCE(v.active_escrow,0) AS correct_available,
  c.current_available,
  c.current_escrow,
  ((COALESCE(s.available_cents,0) + COALESCE(s.escrow_cents,0) + COALESCE(p.post_received,0) - COALESCE(p.post_sent,0)) - COALESCE(v.active_escrow,0)) - c.current_available AS available_delta,
  (COALESCE(v.active_escrow,0) - c.current_escrow)                       AS escrow_delta,
  c.negative_rows,
  c.post_poi_cents,
  (s.pid IS NULL)                                                        AS missing_snapshot
FROM cur c
JOIN affected a ON a.pid = c.pid
LEFT JOIN recon_snapshot s ON s.pid = c.pid
LEFT JOIN post_tx p ON p.pid = c.pid
LEFT JOIN vouch v ON v.pid = c.pid
LEFT JOIN "ChangeMaker"     cm ON c.type = 'cm' AND cm.id = c.pid
LEFT JOIN "ExchangePartner" ep ON c.type = 'ep' AND ep.id = c.pid
LEFT JOIN "ServePartner"    sp ON c.type = 'sp' AND sp.id = c.pid
ORDER BY available_delta;
