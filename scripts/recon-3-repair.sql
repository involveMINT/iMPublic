-- recon-3-repair.sql
-- RUN ON PROD, INSIDE A TRANSACTION. Requires `recon_snapshot` (from recon-1) loaded.
-- Defaults to DRY RUN (ROLLBACK at the end). Switch to COMMIT only after verification passes
-- and the per-wallet output matches the proof doc (negative-balance-reconciliation-proof.md §5).
--
-- TARGETS (reconciled from first principles):
--   admin_mints       = post-cutoff positive coins with NO received transaction within 2s
--                       (mints/POI are legit; transaction "shortfall" coins sit next to their tx)
--   correct_total     = snapshot_total - post_sent + post_received + admin_mints
--   correct_escrow    = SUM(still-active vouchers)
--   correct_available = correct_total - correct_escrow
--   creditDebt        = max(0, -correct_available)
--   (post_received/post_sent from the LEDGER, so bug-inflated receipt coins don't matter.)
--
-- For each CORRUPTED wallet: delete ALL its credit rows, mint one clean poi-null non-escrow coin
-- = max(0, correct_available), one poi-null escrow coin = correct_escrow, set creditDebt. No negatives.
-- Requires gen_random_uuid() (Postgres 13+ core).
BEGIN;

ALTER TABLE "ChangeMaker"     ADD COLUMN IF NOT EXISTS "creditDebt" integer NOT NULL DEFAULT 0;
ALTER TABLE "ExchangePartner" ADD COLUMN IF NOT EXISTS "creditDebt" integer NOT NULL DEFAULT 0;
ALTER TABLE "ServePartner"    ADD COLUMN IF NOT EXISTS "creditDebt" integer NOT NULL DEFAULT 0;

CREATE TEMP TABLE recon_targets ON COMMIT DROP AS
WITH params AS (
  SELECT '2026-05-30 00:00:00'::timestamp AS cutoff   -- <-- snapshot/deploy time
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
)
SELECT
  c.type, c.pid,
  COALESCE(v.active_escrow,0) AS correct_escrow,
  ( COALESCE(s.available_cents,0) + COALESCE(s.escrow_cents,0)
    - COALESCE(p.post_sent,0) + COALESCE(p.post_received,0) + COALESCE(m.admin_mints,0)
    - COALESCE(v.active_escrow,0) ) AS correct_available,
  c.current_available, c.current_escrow, c.negative_rows,
  (s.pid IS NULL) AS missing_snapshot
FROM cur c
JOIN affected a ON a.pid = c.pid
LEFT JOIN recon_snapshot s ON s.pid = c.pid
LEFT JOIN post_tx p ON p.pid = c.pid
LEFT JOIN vouch v ON v.pid = c.pid
LEFT JOIN mints m ON m.pid = c.pid AND m.type = c.type
-- only wallets whose available, escrow, or coin-sign is actually wrong
WHERE ( COALESCE(s.available_cents,0) + COALESCE(s.escrow_cents,0)
        - COALESCE(p.post_sent,0) + COALESCE(p.post_received,0) + COALESCE(m.admin_mints,0)
        - COALESCE(v.active_escrow,0) ) <> c.current_available
   OR COALESCE(v.active_escrow,0) <> c.current_escrow
   OR c.negative_rows > 0;

-- Show the planned targets (visible in dry run).
SELECT t.type, COALESCE(cm."handleId", ep."handleId", sp."handleId") AS handle,
  t.current_available, t.correct_available, t.correct_escrow,
  GREATEST(0, -t.correct_available) AS new_debt, t.missing_snapshot
FROM recon_targets t
LEFT JOIN "ChangeMaker" cm ON t.type='cm' AND cm.id=t.pid
LEFT JOIN "ExchangePartner" ep ON t.type='ep' AND ep.id=t.pid
LEFT JOIN "ServePartner" sp ON t.type='sp' AND sp.id=t.pid
ORDER BY handle;

-- 1) Remove ALL credit rows (escrow + non-escrow) for repairable wallets.
DELETE FROM "Credit" c USING recon_targets t
WHERE (t.type='cm' AND c."changeMakerId"=t.pid) OR (t.type='ep' AND c."exchangePartnerId"=t.pid) OR (t.type='sp' AND c."servePartnerId"=t.pid);

-- 2) Mint one clean poi-null NON-escrow coin = max(0, correct_available).
INSERT INTO "Credit" (id, amount, "dateMinted", escrow, "poiId", "changeMakerId", "exchangePartnerId", "servePartnerId")
SELECT gen_random_uuid()::text, t.correct_available, now(), false, NULL,
  CASE WHEN t.type='cm' THEN t.pid END, CASE WHEN t.type='ep' THEN t.pid END, CASE WHEN t.type='sp' THEN t.pid END
FROM recon_targets t WHERE t.correct_available > 0;

-- 3) Mint one clean poi-null ESCROW coin = correct_escrow (backs still-active vouchers).
INSERT INTO "Credit" (id, amount, "dateMinted", escrow, "poiId", "changeMakerId", "exchangePartnerId", "servePartnerId")
SELECT gen_random_uuid()::text, t.correct_escrow, now(), true, NULL,
  CASE WHEN t.type='cm' THEN t.pid END, CASE WHEN t.type='ep' THEN t.pid END, CASE WHEN t.type='sp' THEN t.pid END
FROM recon_targets t WHERE t.correct_escrow > 0;

-- 4) Set debt = max(0, -correct_available).
UPDATE "ChangeMaker"     p SET "creditDebt" = GREATEST(0, -t.correct_available) FROM recon_targets t WHERE t.type='cm' AND p.id=t.pid;
UPDATE "ExchangePartner" p SET "creditDebt" = GREATEST(0, -t.correct_available) FROM recon_targets t WHERE t.type='ep' AND p.id=t.pid;
UPDATE "ServePartner"    p SET "creditDebt" = GREATEST(0, -t.correct_available) FROM recon_targets t WHERE t.type='sp' AND p.id=t.pid;

-- 5) Verify: every repaired wallet's (coins - debt) = correct_available AND escrow = correct_escrow.
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
  RAISE NOTICE 'Verification passed for % wallet(s). No negative coins remain.', (SELECT count(*) FROM recon_targets);
END $$;

-- Confirm zero negative coins exist anywhere after repair.
DO $$
DECLARE negs int;
BEGIN
  SELECT count(*) INTO negs FROM "Credit" WHERE amount < 0;
  RAISE NOTICE 'System negative credit rows after repair: %', negs;
END $$;

-- DRY RUN. Review the planned-targets output + NOTICEs, then switch ROLLBACK -> COMMIT.
ROLLBACK;
-- COMMIT;
