SELECT 'CREATE DATABASE involvemint'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'involvemint')\gexec

