SELECT 'CREATE DATABASE involvemint'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'involvemint')\gexec

SELECT 'CREATE DATABASE involvemint-e2e'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'involvemint-e2e')\gexec

