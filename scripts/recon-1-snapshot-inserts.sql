-- recon-1-snapshot-inserts.sql
-- RUN THIS ON THE PRE-DEPLOY SNAPSHOT/CLONE DATABASE. READ-ONLY. Returns ONE text cell.
--
-- Instead of a result grid, it emits a ready-to-run SQL script: a DROP/CREATE of recon_snapshot
-- plus one INSERT per wallet (pre-deploy available + escrow balances). Copy the single output
-- cell and run it AS-IS on PROD to load the baseline. No CSV/file export needed.
--
-- The first line of the output reports the snapshot's negative-credit count: it MUST be 0.
-- If it's not, the clone is past the corruption point -> re-clone at an earlier time.
--
-- (Optional) To shrink the output to only the affected wallets, uncomment the pid filter below
-- and paste the affected pids from recon-2-report.
WITH owned AS (
  SELECT "changeMakerId"     AS pid, 'cm'::text AS type, amount, escrow FROM "Credit" WHERE "changeMakerId"     IS NOT NULL
  UNION ALL
  SELECT "exchangePartnerId" AS pid, 'ep'::text AS type, amount, escrow FROM "Credit" WHERE "exchangePartnerId" IS NOT NULL
  UNION ALL
  SELECT "servePartnerId"    AS pid, 'sp'::text AS type, amount, escrow FROM "Credit" WHERE "servePartnerId"    IS NOT NULL
),
bal AS (
  SELECT pid, type,
    COALESCE(SUM(amount) FILTER (WHERE NOT escrow), 0) AS available_cents,
    COALESCE(SUM(amount) FILTER (WHERE escrow), 0)     AS escrow_cents
  FROM owned
  -- WHERE pid IN ('paste','affected','pids','here')   -- optional: limit to affected wallets
  GROUP BY pid, type
)
SELECT
  '-- snapshot negative_credits = ' || (SELECT COUNT(*) FROM "Credit" WHERE amount < 0)
    || '  (MUST be 0; if not, re-clone at an earlier point and do not use this output)' || E'\n'
  || 'DROP TABLE IF EXISTS recon_snapshot;' || E'\n'
  || 'CREATE TABLE recon_snapshot (pid text PRIMARY KEY, type text, available_cents bigint, escrow_cents bigint);' || E'\n'
  || COALESCE(
       string_agg(
         format('INSERT INTO recon_snapshot (pid, type, available_cents, escrow_cents) VALUES (%L, %L, %s, %s);',
                pid, type, available_cents, escrow_cents),
         E'\n' ORDER BY pid),
       '-- (no wallets found)')
  AS sql_to_run_on_prod
FROM bal;
