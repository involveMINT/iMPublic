-- =====================================================================
-- diag-global.sql  —  System-wide health check for the credit ledger
--
-- USAGE: psql "$DATABASE_URL" -f scripts/diag-global.sql
-- READ-ONLY. No writes. Safe to run on production.
-- Amounts are in CENTS. Negative-balance limit = 200000 (= $2000).
-- =====================================================================

-- 1) Per-wallet net available balance (non-escrow), worst (most negative) first.
--    Anything below -200000 is IMPOSSIBLE under the limit -> corruption.
WITH owned AS (
  SELECT "changeMakerId"     AS pid, 'cm' AS type, amount, escrow FROM "Credit" WHERE "changeMakerId"     IS NOT NULL
  UNION ALL
  SELECT "exchangePartnerId", 'ep', amount, escrow              FROM "Credit" WHERE "exchangePartnerId"  IS NOT NULL
  UNION ALL
  SELECT "servePartnerId",    'sp', amount, escrow              FROM "Credit" WHERE "servePartnerId"     IS NOT NULL
)
SELECT
  type,
  pid,
  COUNT(*)                                            AS credit_rows,
  COUNT(*) FILTER (WHERE amount < 0)                  AS negative_rows,
  SUM(amount) FILTER (WHERE NOT escrow)               AS available_cents,
  SUM(amount) FILTER (WHERE NOT escrow) / 100.0       AS available_display,
  SUM(amount) FILTER (WHERE escrow)                   AS escrow_cents
FROM owned
GROUP BY type, pid
HAVING SUM(amount) FILTER (WHERE NOT escrow) < 0          -- only negative wallets
ORDER BY available_cents ASC;

-- 2) Wallets whose negative balance EXCEEDS the allowed limit (-200000 cents).
--    These should be impossible if the guard worked -> hard evidence of the bug.
WITH owned AS (
  SELECT "changeMakerId"     AS pid, 'cm' AS type, amount, escrow FROM "Credit" WHERE "changeMakerId"     IS NOT NULL
  UNION ALL
  SELECT "exchangePartnerId", 'ep', amount, escrow              FROM "Credit" WHERE "exchangePartnerId"  IS NOT NULL
  UNION ALL
  SELECT "servePartnerId",    'sp', amount, escrow              FROM "Credit" WHERE "servePartnerId"     IS NOT NULL
)
SELECT type, pid, SUM(amount) FILTER (WHERE NOT escrow) AS available_cents
FROM owned
GROUP BY type, pid
HAVING SUM(amount) FILTER (WHERE NOT escrow) < -200000
ORDER BY available_cents ASC;

-- 3) Orphaned credits: a Credit row with NO owner, or MORE THAN ONE owner.
--    Either indicates corruption from the transfer/merge code.
SELECT
  COUNT(*) FILTER (WHERE "changeMakerId" IS NULL AND "exchangePartnerId" IS NULL AND "servePartnerId" IS NULL) AS no_owner,
  COUNT(*) FILTER (WHERE (("changeMakerId" IS NOT NULL)::int
                       + ("exchangePartnerId" IS NOT NULL)::int
                       + ("servePartnerId" IS NOT NULL)::int) > 1)                                             AS multi_owner
FROM "Credit";

-- 4) Global credit conservation.
--    Credits only legitimately ENTER the system via minting and POI-earned credits.
--    P2P transactions and escrow moves must NET TO ZERO across all wallets.
--    total_credits should equal (sum of all POI-earned credits + admin mints).
--    A drift here = the mutual-credit code is minting/destroying value on transfer.
SELECT
  SUM(amount)                                  AS total_all_credits_cents,
  SUM(amount) FILTER (WHERE NOT escrow)        AS total_available_cents,
  SUM(amount) FILTER (WHERE escrow)            AS total_escrow_cents,
  SUM(amount) FILTER (WHERE "poiId" IS NOT NULL) AS total_poi_backed_cents,
  SUM(amount) FILTER (WHERE "poiId" IS NULL)     AS total_non_poi_cents,
  COUNT(*)                                      AS total_rows,
  COUNT(*) FILTER (WHERE amount < 0)            AS total_negative_rows
FROM "Credit";

-- 5) Recent mutual-credit activity: negative credit rows created recently,
--    with their owning wallet's handle, newest first.
SELECT
  c.id,
  c.amount,
  c."dateMinted",
  c.escrow,
  COALESCE(cm."handleId", ep."handleId", sp."handleId") AS handle
FROM "Credit" c
LEFT JOIN "ChangeMaker"     cm ON cm.id = c."changeMakerId"
LEFT JOIN "ExchangePartner" ep ON ep.id = c."exchangePartnerId"
LEFT JOIN "ServePartner"    sp ON sp.id = c."servePartnerId"
WHERE c.amount < 0
ORDER BY c."dateMinted" DESC
LIMIT 100;
