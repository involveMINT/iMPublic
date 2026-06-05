-- recon-3-repair.sql
-- RUN ON PROD, INSIDE A TRANSACTION. Requires `recon_snapshot` (from recon-1) loaded.
-- Defaults to DRY RUN (ROLLBACK at the end). Switch to COMMIT only after the verification passes.
--
-- Reconciles on TOTAL holdings, then rebuilds clean coins (handles available AND escrow uniformly,
-- so Jrw740 and any escrow wallet are repaired automatically):
--   correct_escrow    = SUM(still-active vouchers)
--   correct_total     = snapshot_total + post-cutoff(received - sent)
--   correct_available = correct_total - correct_escrow
-- For each CORRUPTED wallet it deletes ALL its credit rows, then mints:
--   * one poi-null NON-escrow coin = max(0, correct_available),
--   * one poi-null ESCROW coin     = correct_escrow,
--   and sets creditDebt = max(0, -correct_available).  No negative coins remain.
--
-- ABORTS (manual review) if any corrupted wallet has no snapshot row, or earned POI after the
-- cutoff (post_poi_cents > 0) — those can't be sized from snapshot+ledger alone.
-- Requires gen_random_uuid() (Postgres 13+ core).
BEGIN;

ALTER TABLE "ChangeMaker"     ADD COLUMN IF NOT EXISTS "creditDebt" integer NOT NULL DEFAULT 0;
ALTER TABLE "ExchangePartner" ADD COLUMN IF NOT EXISTS "creditDebt" integer NOT NULL DEFAULT 0;
ALTER TABLE "ServePartner"    ADD COLUMN IF NOT EXISTS "creditDebt" integer NOT NULL DEFAULT 0;

CREATE TEMP TABLE recon_targets ON COMMIT DROP AS
WITH params AS (
  SELECT '2026-05-30 00:00:00'::timestamp AS cutoff   -- <-- set to snapshot/deploy time
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
  c.type, c.pid,
  COALESCE(v.active_escrow,0) AS correct_escrow,
  ((COALESCE(s.available_cents,0) + COALESCE(s.escrow_cents,0) + COALESCE(p.post_received,0) - COALESCE(p.post_sent,0)) - COALESCE(v.active_escrow,0)) AS correct_available,
  c.current_available, c.current_escrow, c.negative_rows, c.post_poi_cents,
  (s.pid IS NULL) AS missing_snapshot
FROM cur c
JOIN affected a ON a.pid = c.pid
LEFT JOIN recon_snapshot s ON s.pid = c.pid
LEFT JOIN post_tx p ON p.pid = c.pid
LEFT JOIN vouch v ON v.pid = c.pid
-- only wallets whose available, escrow, or coin-sign is actually wrong
WHERE ((COALESCE(s.available_cents,0) + COALESCE(s.escrow_cents,0) + COALESCE(p.post_received,0) - COALESCE(p.post_sent,0)) - COALESCE(v.active_escrow,0)) <> c.current_available
   OR COALESCE(v.active_escrow,0) <> c.current_escrow
   OR c.negative_rows > 0;

-- Guard: never guess. Abort if any target lacks a snapshot baseline or earned POI post-cutoff.
DO $$
DECLARE bad int;
BEGIN
  SELECT count(*) INTO bad FROM recon_targets WHERE missing_snapshot OR post_poi_cents > 0;
  IF bad > 0 THEN
    RAISE EXCEPTION 'Aborting: % wallet(s) need manual review (missing snapshot or post-cutoff POI). See recon-2-report.', bad;
  END IF;
END $$;

-- 1) Remove ALL credit rows (escrow + non-escrow) for repairable wallets.
DELETE FROM "Credit" c USING recon_targets t
WHERE (t.type='cm' AND c."changeMakerId"=t.pid) OR (t.type='ep' AND c."exchangePartnerId"=t.pid) OR (t.type='sp' AND c."servePartnerId"=t.pid);

-- 2) Mint one clean poi-null NON-escrow coin = max(0, correct_available).
INSERT INTO "Credit" (id, amount, "dateMinted", escrow, "poiId", "changeMakerId", "exchangePartnerId", "servePartnerId")
SELECT gen_random_uuid()::text, t.correct_available, now(), false, NULL,
  CASE WHEN t.type='cm' THEN t.pid END, CASE WHEN t.type='ep' THEN t.pid END, CASE WHEN t.type='sp' THEN t.pid END
FROM recon_targets t WHERE t.correct_available > 0;

-- 3) Mint one clean poi-null ESCROW coin = correct_escrow (backs the still-active vouchers).
INSERT INTO "Credit" (id, amount, "dateMinted", escrow, "poiId", "changeMakerId", "exchangePartnerId", "servePartnerId")
SELECT gen_random_uuid()::text, t.correct_escrow, now(), true, NULL,
  CASE WHEN t.type='cm' THEN t.pid END, CASE WHEN t.type='ep' THEN t.pid END, CASE WHEN t.type='sp' THEN t.pid END
FROM recon_targets t WHERE t.correct_escrow > 0;

-- 4) Set debt = max(0, -correct_available).
UPDATE "ChangeMaker"     p SET "creditDebt" = GREATEST(0, -t.correct_available) FROM recon_targets t WHERE t.type='cm' AND p.id=t.pid;
UPDATE "ExchangePartner" p SET "creditDebt" = GREATEST(0, -t.correct_available) FROM recon_targets t WHERE t.type='ep' AND p.id=t.pid;
UPDATE "ServePartner"    p SET "creditDebt" = GREATEST(0, -t.correct_available) FROM recon_targets t WHERE t.type='sp' AND p.id=t.pid;

-- 5) Verify: repaired available (coins - debt) and escrow must match targets exactly.
DO $$
DECLARE bad int;
BEGIN
  SELECT count(*) INTO bad FROM recon_targets t
  WHERE t.correct_available <> (
      (SELECT COALESCE(SUM(amount),0) FROM "Credit" c WHERE NOT c.escrow AND ((t.type='cm' AND c."changeMakerId"=t.pid) OR (t.type='ep' AND c."exchangePartnerId"=t.pid) OR (t.type='sp' AND c."servePartnerId"=t.pid)))
      - (CASE t.type WHEN 'cm' THEN (SELECT "creditDebt" FROM "ChangeMaker" WHERE id=t.pid) WHEN 'ep' THEN (SELECT "creditDebt" FROM "ExchangePartner" WHERE id=t.pid) ELSE (SELECT "creditDebt" FROM "ServePartner" WHERE id=t.pid) END))
   OR t.correct_escrow <> (SELECT COALESCE(SUM(amount),0) FROM "Credit" c WHERE c.escrow AND ((t.type='cm' AND c."changeMakerId"=t.pid) OR (t.type='ep' AND c."exchangePartnerId"=t.pid) OR (t.type='sp' AND c."servePartnerId"=t.pid)));
  IF bad > 0 THEN
    RAISE EXCEPTION 'Verification failed for % wallet(s)', bad;
  END IF;
  RAISE NOTICE 'Verification passed for % wallet(s).', (SELECT count(*) FROM recon_targets);
END $$;

-- DRY RUN. Review the NOTICE, then switch ROLLBACK -> COMMIT to apply.
ROLLBACK;
-- COMMIT;
