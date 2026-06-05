-- recon-verify.sql
-- READ-ONLY. Compares each reconciled wallet's CURRENT prod state to its expected target,
-- and flags OK / DIFF. Run anytime after the repair to confirm it holds. Two statements:
-- (1) the per-wallet comparison, (2) a system-wide negative-coin monitor (should stay 0).
-- Amounts in CENTS. No temp tables / no transaction — Ctrl+Enter on each statement works.

-- (1) Per-wallet: expected vs current (status OK means available, escrow, debt all match and no neg coins).
WITH expected(handle, exp_available, exp_escrow, exp_debt) AS (VALUES
  ('Marenlc', 9477, 0, 0),
  ('Jrw740', 4100, 1200, 0),
  ('denisebigelow', 6500, 0, 0),
  ('flycorey', 6330, 0, 0),
  ('Samannesmith1', 43800, 0, 0),
  ('Acethetheorist', 3260, 0, 0),
  ('chrisg', 200, 0, 0),
  ('Coliveros', 200, 0, 0),
  ('bigpeople80099', 0, 0, 900),
  ('wild-indigo-guild', 11300, 0, 0),
  ('GarfieldFarm', 18700, 0, 0),
  ('communitycultures', 16300, 0, 0),
  ('MonVoyage', 171805, 0, 0),
  ('QuinnNTonic', 1, 0, 0),
  ('LArnade', 1965, 0, 0),
  ('BiddlesEscape', 158364, 0, 0)
),
prof AS (
  SELECT e.*, COALESCE(cm.id, ep.id, sp.id) AS pid,
    CASE WHEN cm.id IS NOT NULL THEN 'cm' WHEN ep.id IS NOT NULL THEN 'ep' ELSE 'sp' END AS type
  FROM expected e
  LEFT JOIN "ChangeMaker"     cm ON cm."handleId" = e.handle
  LEFT JOIN "ExchangePartner" ep ON ep."handleId" = e.handle
  LEFT JOIN "ServePartner"    sp ON sp."handleId" = e.handle
)
SELECT
  p.handle,
  p.exp_available, COALESCE(c.avail, 0)  AS cur_available,
  p.exp_escrow,    COALESCE(c.escrow, 0) AS cur_escrow,
  p.exp_debt,      COALESCE(d.debt, 0)   AS cur_debt,
  COALESCE(c.neg, 0)                     AS neg_coins,
  CASE WHEN p.exp_available = COALESCE(c.avail,0)
        AND p.exp_escrow    = COALESCE(c.escrow,0)
        AND p.exp_debt      = COALESCE(d.debt,0)
        AND COALESCE(c.neg,0) = 0
       THEN 'OK' ELSE 'DIFF' END         AS status
FROM prof p
LEFT JOIN LATERAL (
  SELECT COALESCE(SUM(amount) FILTER (WHERE NOT escrow), 0) AS avail,
         COALESCE(SUM(amount) FILTER (WHERE escrow), 0)     AS escrow,
         COUNT(*) FILTER (WHERE amount < 0)                 AS neg
  FROM "Credit" cr
  WHERE cr."changeMakerId" = p.pid OR cr."exchangePartnerId" = p.pid OR cr."servePartnerId" = p.pid
) c ON true
LEFT JOIN LATERAL (
  SELECT CASE p.type
           WHEN 'cm' THEN (SELECT "creditDebt" FROM "ChangeMaker"     WHERE id = p.pid)
           WHEN 'ep' THEN (SELECT "creditDebt" FROM "ExchangePartner" WHERE id = p.pid)
           ELSE          (SELECT "creditDebt" FROM "ServePartner"    WHERE id = p.pid)
         END AS debt
) d ON true
ORDER BY status DESC, p.handle;

-- (2) System-wide monitor — should be 0 now and stay 0 as new transactions flow through v0.20.1.
SELECT COUNT(*) AS system_negative_coins FROM "Credit" WHERE amount < 0;
