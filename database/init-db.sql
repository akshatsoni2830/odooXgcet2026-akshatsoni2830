-- Create database if not exists
SELECT 'CREATE DATABASE dayflow_hrms'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dayflow_hrms')\gexec
