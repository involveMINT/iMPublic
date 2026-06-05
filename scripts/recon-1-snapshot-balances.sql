-- recon-1-snapshot-balances.sql
-- RUN THIS ON THE PRE-DEPLOY SNAPSHOT DATABASE (restored to a scratch instance, ~2026-05-29).
-- READ-ONLY. Outputs each wallet's pre-deploy available AND escrow balance (cents).
-- Reconciliation is done on TOTAL holdings (available + escrow), then split, so we need both.
-- Pre-deploy there were no debt coins.
--
-- EXPORT the result to CSV and load it into PROD as table `recon_snapshot` before running
-- recon-2 / recon-3. In DBeaver: right-click result -> "Export resultset" -> CSV; then in prod:
--   CREATE TABLE recon_snapshot (
--     pid text PRIMARY KEY, type text, available_cents bigint, escrow_cents bigint);
--   (import the CSV into recon_snapshot)
WITH owned AS (
  SELECT "changeMakerId"     AS pid, 'cm'::text AS type, amount, escrow FROM "Credit" WHERE "changeMakerId"     IS NOT NULL
  UNION ALL
  SELECT "exchangePartnerId" AS pid, 'ep'::text AS type, amount, escrow FROM "Credit" WHERE "exchangePartnerId" IS NOT NULL
  UNION ALL
  SELECT "servePartnerId"    AS pid, 'sp'::text AS type, amount, escrow FROM "Credit" WHERE "servePartnerId"    IS NOT NULL
)
SELECT pid, type,
  COALESCE(SUM(amount) FILTER (WHERE NOT escrow), 0) AS available_cents,
  COALESCE(SUM(amount) FILTER (WHERE escrow), 0)     AS escrow_cents
FROM owned
GROUP BY pid, type;
