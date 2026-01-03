@echo off
echo Running Dayflow HRMS Database Schema...
echo.

set PGPASSWORD=postgres123

psql -U postgres -h localhost -p 5432 -c "DROP DATABASE IF EXISTS dayflow_hrms;"
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE dayflow_hrms;"
psql -U postgres -h localhost -p 5432 -d dayflow_hrms -f schema.sql
psql -U postgres -h localhost -p 5432 -d dayflow_hrms -f seed.sql

echo.
echo Database setup complete!
echo You can now access http://localhost:3001
pause
