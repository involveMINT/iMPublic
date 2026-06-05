-- diag.sql — One-shot credit-ledger diagnostic (returns a single JSON cell).
-- Pure SQL, single statement, NO blank lines (DBeaver-safe). READ-ONLY.
-- Amounts are in CENTS. To deep-dive a different wallet, change the handle on the params line.
WITH params AS (
  SELECT 'wild-indigo-guild'::text AS handle
),
profile AS (
  SELECT id, 'cm'::text AS type FROM "ChangeMaker"     WHERE "handleId" = (SELECT handle FROM params)
  UNION ALL
  SELECT id, 'ep'::text AS type FROM "ExchangePartner" WHERE "handleId" = (SELECT handle FROM params)
  UNION ALL
  SELECT id, 'sp'::text AS type FROM "ServePartner"    WHERE "handleId" = (SELECT handle FROM params)
),
owned AS (
  SELECT "changeMakerId"     AS pid, 'cm'::text AS type, amount, escrow FROM "Credit" WHERE "changeMakerId"     IS NOT NULL
  UNION ALL
  SELECT "exchangePartnerId" AS pid, 'ep'::text AS type, amount, escrow FROM "Credit" WHERE "exchangePartnerId" IS NOT NULL
  UNION ALL
  SELECT "servePartnerId"    AS pid, 'sp'::text AS type, amount, escrow FROM "Credit" WHERE "servePartnerId"    IS NOT NULL
),
wallet_balances AS (
  SELECT type, pid,
    COUNT(*)                               AS credit_rows,
    COUNT(*) FILTER (WHERE amount < 0)     AS negative_rows,
    SUM(amount) FILTER (WHERE NOT escrow)  AS available_cents,
    SUM(amount) FILTER (WHERE escrow)      AS escrow_cents
  FROM owned
  GROUP BY type, pid
),
wallet_balances_h AS (
  SELECT wb.*, COALESCE(cm."handleId", ep."handleId", sp."handleId") AS handle
  FROM wallet_balances wb
  LEFT JOIN "ChangeMaker"     cm ON wb.type = 'cm' AND cm.id = wb.pid
  LEFT JOIN "ExchangePartner" ep ON wb.type = 'ep' AND ep.id = wb.pid
  LEFT JOIN "ServePartner"    sp ON wb.type = 'sp' AND sp.id = wb.pid
)
SELECT jsonb_pretty(json_build_object(
  'global', json_build_object(
    'negative_wallet_count', (SELECT COUNT(*) FROM wallet_balances_h WHERE available_cents < 0),
    'negative_wallets', (SELECT COALESCE(json_agg(row_to_json(x)), '[]') FROM (
        SELECT handle, type, pid, credit_rows, negative_rows, available_cents, escrow_cents
        FROM wallet_balances_h WHERE available_cents < 0 ORDER BY available_cents ASC LIMIT 200
      ) x),
    'over_limit_wallets', (SELECT COALESCE(json_agg(row_to_json(x)), '[]') FROM (
        SELECT handle, type, pid, credit_rows, negative_rows, available_cents, escrow_cents
        FROM wallet_balances_h WHERE available_cents < -200000 ORDER BY available_cents ASC
      ) x),
    'orphans', (SELECT json_build_object(
        'no_owner', COUNT(*) FILTER (WHERE "changeMakerId" IS NULL AND "exchangePartnerId" IS NULL AND "servePartnerId" IS NULL),
        'multi_owner', COUNT(*) FILTER (WHERE (("changeMakerId" IS NOT NULL)::int + ("exchangePartnerId" IS NOT NULL)::int + ("servePartnerId" IS NOT NULL)::int) > 1)
      ) FROM "Credit"),
    'conservation', (SELECT json_build_object(
        'total_all_credits_cents', SUM(amount),
        'total_available_cents',   SUM(amount) FILTER (WHERE NOT escrow),
        'total_escrow_cents',      SUM(amount) FILTER (WHERE escrow),
        'total_poi_backed_cents',  SUM(amount) FILTER (WHERE "poiId" IS NOT NULL),
        'total_non_poi_cents',     SUM(amount) FILTER (WHERE "poiId" IS NULL),
        'total_rows',              COUNT(*),
        'total_negative_rows',     COUNT(*) FILTER (WHERE amount < 0)
      ) FROM "Credit"),
    'recent_negative_credits', (SELECT COALESCE(json_agg(row_to_json(x)), '[]') FROM (
        SELECT c.id, c.amount, c."dateMinted", c.escrow, (c."poiId" IS NOT NULL) AS has_poi,
               COALESCE(cm."handleId", ep."handleId", sp."handleId") AS handle
        FROM "Credit" c
        LEFT JOIN "ChangeMaker"     cm ON cm.id = c."changeMakerId"
        LEFT JOIN "ExchangePartner" ep ON ep.id = c."exchangePartnerId"
        LEFT JOIN "ServePartner"    sp ON sp.id = c."servePartnerId"
        WHERE c.amount < 0 ORDER BY c."dateMinted" DESC LIMIT 100
      ) x)
  ),
  'wallet', json_build_object(
    'handle', (SELECT handle FROM params),
    'profile', (SELECT COALESCE(json_agg(row_to_json(p)), '[]') FROM profile p),
    'balance', (SELECT json_build_object(
        'credit_rows',     COUNT(*),
        'negative_rows',   COUNT(*) FILTER (WHERE amount < 0),
        'available_cents', COALESCE(SUM(amount) FILTER (WHERE NOT escrow), 0),
        'escrow_cents',    COALESCE(SUM(amount) FILTER (WHERE escrow), 0)
      ) FROM "Credit" c
      WHERE c."changeMakerId" IN (SELECT id FROM profile) OR c."servePartnerId" IN (SELECT id FROM profile) OR c."exchangePartnerId" IN (SELECT id FROM profile)),
    'tx_totals', (SELECT json_build_object(
        'total_received_cents', COALESCE(SUM(amount) FILTER (WHERE "receiverChangeMakerId" IN (SELECT id FROM profile) OR "receiverServePartnerId" IN (SELECT id FROM profile) OR "receiverExchangePartnerId" IN (SELECT id FROM profile)), 0),
        'total_sent_cents',     COALESCE(SUM(amount) FILTER (WHERE "senderChangeMakerId" IN (SELECT id FROM profile) OR "senderServePartnerId" IN (SELECT id FROM profile) OR "senderExchangePartnerId" IN (SELECT id FROM profile)), 0)
      ) FROM "Transaction"),
    'credits', (SELECT COALESCE(json_agg(row_to_json(x) ORDER BY x."dateMinted", x.id), '[]') FROM (
        SELECT c.id, c.amount, c.escrow, c."dateMinted", (c."poiId" IS NOT NULL) AS has_poi,
               c."changeMakerId", c."servePartnerId", c."exchangePartnerId"
        FROM "Credit" c
        WHERE c."changeMakerId" IN (SELECT id FROM profile) OR c."servePartnerId" IN (SELECT id FROM profile) OR c."exchangePartnerId" IN (SELECT id FROM profile)
      ) x),
    'ledger', (SELECT COALESCE(json_agg(row_to_json(x) ORDER BY x."dateTransacted" DESC), '[]') FROM (
        SELECT t.id, t."dateTransacted", t.memo, t.amount,
          CASE WHEN t."senderChangeMakerId" IN (SELECT id FROM profile) OR t."senderServePartnerId" IN (SELECT id FROM profile) OR t."senderExchangePartnerId" IN (SELECT id FROM profile) THEN 'SENT' ELSE 'RECEIVED' END AS direction,
          t."senderChangeMakerId", t."senderExchangePartnerId", t."senderServePartnerId",
          t."receiverChangeMakerId", t."receiverExchangePartnerId", t."receiverServePartnerId"
        FROM "Transaction" t
        WHERE t."senderChangeMakerId" IN (SELECT id FROM profile) OR t."senderServePartnerId" IN (SELECT id FROM profile) OR t."senderExchangePartnerId" IN (SELECT id FROM profile)
           OR t."receiverChangeMakerId" IN (SELECT id FROM profile) OR t."receiverServePartnerId" IN (SELECT id FROM profile) OR t."receiverExchangePartnerId" IN (SELECT id FROM profile)
      ) x)
  )
)::jsonb) AS result;
