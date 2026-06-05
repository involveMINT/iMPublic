-- =====================================================================
-- diag-wallet.sql  —  Deep-dive a single wallet by handle
--
-- Pure SQL. Works in any client (DBeaver, psql, pgAdmin, etc.).
-- READ-ONLY. No writes. Safe to run on production.
--
-- TO CHANGE WALLET: find-and-replace 'wild-indigo-guild' below
--                   with the handle you want (keep the quotes).
--
-- Amounts are stored in CENTS (divide by 100 for display dollars).
-- Run each numbered block separately, or all at once.
-- =====================================================================

-- 1) Resolve the handle to its profile id(s)
SELECT 'cm'::text AS type, id AS profile_id FROM "ChangeMaker"     WHERE "handleId" = 'wild-indigo-guild'
UNION ALL
SELECT 'ep',          id                    FROM "ExchangePartner" WHERE "handleId" = 'wild-indigo-guild'
UNION ALL
SELECT 'sp',          id                    FROM "ServePartner"    WHERE "handleId" = 'wild-indigo-guild';


-- 2) Every Credit row this wallet owns, oldest first, with a running net.
--    This is the SOURCE OF TRUTH for the wallet balance the app shows.
WITH profile AS (
  SELECT id FROM "ChangeMaker"            WHERE "handleId" = 'wild-indigo-guild'
  UNION ALL SELECT id FROM "ExchangePartner" WHERE "handleId" = 'wild-indigo-guild'
  UNION ALL SELECT id FROM "ServePartner"    WHERE "handleId" = 'wild-indigo-guild'
),
credits AS (
  SELECT c.id, c.amount, c.escrow, c."dateMinted", c."poiId",
         c."changeMakerId", c."servePartnerId", c."exchangePartnerId"
  FROM "Credit" c
  WHERE c."changeMakerId"     IN (SELECT id FROM profile)
     OR c."servePartnerId"    IN (SELECT id FROM profile)
     OR c."exchangePartnerId" IN (SELECT id FROM profile)
)
SELECT
  id,
  amount,
  amount / 100.0                                          AS amount_display,
  escrow,
  "dateMinted",
  "poiId" IS NOT NULL                                     AS has_poi,
  SUM(CASE WHEN escrow THEN 0 ELSE amount END)
      OVER (ORDER BY "dateMinted", id)                    AS running_available_cents
FROM credits
ORDER BY "dateMinted", id;


-- 3) Balance summary: what the wallet SHOULD show.
WITH profile AS (
  SELECT id FROM "ChangeMaker"            WHERE "handleId" = 'wild-indigo-guild'
  UNION ALL SELECT id FROM "ExchangePartner" WHERE "handleId" = 'wild-indigo-guild'
  UNION ALL SELECT id FROM "ServePartner"    WHERE "handleId" = 'wild-indigo-guild'
),
credits AS (
  SELECT c.* FROM "Credit" c
  WHERE c."changeMakerId"     IN (SELECT id FROM profile)
     OR c."servePartnerId"    IN (SELECT id FROM profile)
     OR c."exchangePartnerId" IN (SELECT id FROM profile)
)
SELECT
  COUNT(*)                                                              AS credit_rows,
  COUNT(*) FILTER (WHERE amount < 0)                                    AS negative_rows,
  COALESCE(SUM(amount) FILTER (WHERE NOT escrow), 0)                    AS available_cents,
  COALESCE(SUM(amount) FILTER (WHERE NOT escrow), 0) / 100.0            AS available_display,
  COALESCE(SUM(amount) FILTER (WHERE escrow), 0)                        AS escrow_cents,
  COALESCE(SUM(amount) FILTER (WHERE escrow), 0) / 100.0               AS escrow_display
FROM credits;


-- 4) Transaction-derived totals (received vs sent).
WITH profile AS (
  SELECT id FROM "ChangeMaker"            WHERE "handleId" = 'wild-indigo-guild'
  UNION ALL SELECT id FROM "ExchangePartner" WHERE "handleId" = 'wild-indigo-guild'
  UNION ALL SELECT id FROM "ServePartner"    WHERE "handleId" = 'wild-indigo-guild'
)
SELECT
  COALESCE(SUM(amount) FILTER (
    WHERE "receiverChangeMakerId"     IN (SELECT id FROM profile)
       OR "receiverServePartnerId"    IN (SELECT id FROM profile)
       OR "receiverExchangePartnerId" IN (SELECT id FROM profile)), 0)  AS total_received_cents,
  COALESCE(SUM(amount) FILTER (
    WHERE "senderChangeMakerId"       IN (SELECT id FROM profile)
       OR "senderServePartnerId"      IN (SELECT id FROM profile)
       OR "senderExchangePartnerId"   IN (SELECT id FROM profile)), 0)  AS total_sent_cents
FROM "Transaction";


-- 5) Full transaction ledger for this wallet (newest first), with direction.
WITH profile AS (
  SELECT id FROM "ChangeMaker"            WHERE "handleId" = 'wild-indigo-guild'
  UNION ALL SELECT id FROM "ExchangePartner" WHERE "handleId" = 'wild-indigo-guild'
  UNION ALL SELECT id FROM "ServePartner"    WHERE "handleId" = 'wild-indigo-guild'
)
SELECT
  t.id,
  t."dateTransacted",
  t.memo,
  t.amount,
  t.amount / 100.0 AS amount_display,
  CASE
    WHEN t."senderChangeMakerId"     IN (SELECT id FROM profile)
      OR t."senderServePartnerId"    IN (SELECT id FROM profile)
      OR t."senderExchangePartnerId" IN (SELECT id FROM profile)
    THEN 'SENT' ELSE 'RECEIVED'
  END AS direction
FROM "Transaction" t
WHERE t."senderChangeMakerId"       IN (SELECT id FROM profile)
   OR t."senderServePartnerId"      IN (SELECT id FROM profile)
   OR t."senderExchangePartnerId"   IN (SELECT id FROM profile)
   OR t."receiverChangeMakerId"     IN (SELECT id FROM profile)
   OR t."receiverServePartnerId"    IN (SELECT id FROM profile)
   OR t."receiverExchangePartnerId" IN (SELECT id FROM profile)
ORDER BY t."dateTransacted" DESC;
