-- test-cleanup-negative-coins.sql
-- ⚠️ TEST DB ONLY. Converts every negative Credit coin into account creditDebt, preserving each
-- wallet's net (total holdings − debt). After it runs, zero negative coins remain.
-- NOT the prod repair (prod uses snapshot-based recon-3, which also corrects skewed nets).
--
-- Single atomic statement (no temp table) so it runs reliably in DBeaver regardless of
-- autocommit / how you execute it. All sub-statements see the same pre-statement snapshot, so the
-- UPDATEs read the negative coins to size the debt while DELETE removes them — consistent.

-- 1) BEFORE: how many negative coins (expect 23).
SELECT COUNT(*) AS negative_coins_before FROM "Credit" WHERE amount < 0;

-- 2) APPLY (one statement): fold negatives into creditDebt, then delete the negative coins.
WITH cm AS (
  UPDATE "ChangeMaker" p SET "creditDebt" = p."creditDebt" + x.mag
  FROM (SELECT "changeMakerId" AS pid, -SUM(amount) AS mag FROM "Credit" WHERE amount < 0 AND "changeMakerId" IS NOT NULL GROUP BY "changeMakerId") x
  WHERE p.id = x.pid RETURNING 1
),
ep AS (
  UPDATE "ExchangePartner" p SET "creditDebt" = p."creditDebt" + x.mag
  FROM (SELECT "exchangePartnerId" AS pid, -SUM(amount) AS mag FROM "Credit" WHERE amount < 0 AND "exchangePartnerId" IS NOT NULL GROUP BY "exchangePartnerId") x
  WHERE p.id = x.pid RETURNING 1
),
sp AS (
  UPDATE "ServePartner" p SET "creditDebt" = p."creditDebt" + x.mag
  FROM (SELECT "servePartnerId" AS pid, -SUM(amount) AS mag FROM "Credit" WHERE amount < 0 AND "servePartnerId" IS NOT NULL GROUP BY "servePartnerId") x
  WHERE p.id = x.pid RETURNING 1
),
del AS (
  DELETE FROM "Credit" WHERE amount < 0 RETURNING 1
)
SELECT (SELECT count(*) FROM cm) AS cm_wallets_updated,
       (SELECT count(*) FROM ep) AS ep_wallets_updated,
       (SELECT count(*) FROM sp) AS sp_wallets_updated,
       (SELECT count(*) FROM del) AS negative_coins_deleted;

-- 3) AFTER: should be 0.
SELECT COUNT(*) AS negative_coins_after FROM "Credit" WHERE amount < 0;
