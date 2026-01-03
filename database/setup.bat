@echo off
echo Setting up Dayflow HRMS Database...
echo.

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: PostgreSQL is not installed or not in PATH
    echo Please install PostgreSQL and add it to your PATH
    pause
    exit /b 1
)

REM Run schema
echo Running schema.sql...
psql -U postgres -d dayflow_hrms -f schema.sql
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to run schema.sql
    pause
    exit /b 1
)

REM Run seed data
echo Running seed.sql...
psql -U postgres -d dayflow_hrms -f seed.sql
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to run seed.sql
    pause
    exit /b 1
)

echo.
echo Database setup complete!
pause
