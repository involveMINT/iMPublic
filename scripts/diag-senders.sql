-- diag-senders.sql — Per-wallet deep dive for all affected senders (single JSON cell).
-- Pure SQL, single statement, NO blank lines (DBeaver-safe). READ-ONLY. Amounts in CENTS.
-- Returns, keyed by handle: balance, all credit rows (oldest first), and full ledger.
WITH targets AS (
  SELECT unnest(ARRAY['Jrw740','Marenlc','bigpeople80099','Coliveros','Acethetheorist','denisebigelow','MonVoyage','flycorey','Samannesmith1','communitycultures','chrisg','QuinnNTonic']) AS handle
),
prof AS (
  SELECT t.handle, cm.id AS pid, 'cm'::text AS type FROM targets t JOIN "ChangeMaker"     cm ON cm."handleId" = t.handle
  UNION ALL
  SELECT t.handle, ep.id, 'ep'::text FROM targets t JOIN "ExchangePartner" ep ON ep."handleId" = t.handle
  UNION ALL
  SELECT t.handle, sp.id, 'sp'::text FROM targets t JOIN "ServePartner"    sp ON sp."handleId" = t.handle
)
SELECT jsonb_pretty(json_object_agg(p.handle, json_build_object(
  'pid', p.pid,
  'type', p.type,
  'balance', (SELECT json_build_object(
      'available_cents', COALESCE(SUM(amount) FILTER (WHERE NOT escrow), 0),
      'escrow_cents',    COALESCE(SUM(amount) FILTER (WHERE escrow), 0),
      'rows',            COUNT(*),
      'negative_rows',   COUNT(*) FILTER (WHERE amount < 0)
    ) FROM "Credit" c WHERE c."changeMakerId" = p.pid OR c."servePartnerId" = p.pid OR c."exchangePartnerId" = p.pid),
  'received_cents', (SELECT COALESCE(SUM(amount), 0) FROM "Transaction" WHERE "receiverChangeMakerId" = p.pid OR "receiverServePartnerId" = p.pid OR "receiverExchangePartnerId" = p.pid),
  'sent_cents',     (SELECT COALESCE(SUM(amount), 0) FROM "Transaction" WHERE "senderChangeMakerId" = p.pid OR "senderServePartnerId" = p.pid OR "senderExchangePartnerId" = p.pid),
  'credits', (SELECT COALESCE(json_agg(json_build_object('id', c.id, 'amount', c.amount, 'escrow', c.escrow, 'has_poi', c."poiId" IS NOT NULL, 'dateMinted', c."dateMinted") ORDER BY c."dateMinted", c.id), '[]')
    FROM "Credit" c WHERE c."changeMakerId" = p.pid OR c."servePartnerId" = p.pid OR c."exchangePartnerId" = p.pid),
  'ledger', (SELECT COALESCE(json_agg(json_build_object('date', t."dateTransacted", 'memo', t.memo, 'amount', t.amount, 'dir', CASE WHEN t."senderChangeMakerId" = p.pid OR t."senderServePartnerId" = p.pid OR t."senderExchangePartnerId" = p.pid THEN 'SENT' ELSE 'RECEIVED' END) ORDER BY t."dateTransacted"), '[]')
    FROM "Transaction" t WHERE t."senderChangeMakerId" = p.pid OR t."senderServePartnerId" = p.pid OR t."senderExchangePartnerId" = p.pid OR t."receiverChangeMakerId" = p.pid OR t."receiverServePartnerId" = p.pid OR t."receiverExchangePartnerId" = p.pid)
))::jsonb) AS result
FROM prof p;
