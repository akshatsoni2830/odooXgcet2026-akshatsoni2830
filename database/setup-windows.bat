@echo off
echo Dayflow HRMS Database Setup for Windows
echo ========================================
echo.

set PSQL_PATH="C:\Program Files\PostgreSQL\13\bin\psql.exe"

echo Step 1: Creating database (if not exists)...
%PSQL_PATH% -U postgres -c "CREATE DATABASE dayflow_hrms;" 2>nul
if %errorlevel% equ 0 (
    echo Database created successfully!
) else (
    echo Database already exists or error occurred.
)

echo.
echo Step 2: Running schema.sql...
%PSQL_PATH% -U postgres -d dayflow_hrms -f schema.sql
if %errorlevel% equ 0 (
    echo Schema created successfully!
) else (
    echo Error creating schema!
    exit /b 1
)

echo.
echo Step 3: Running seed.sql...
%PSQL_PATH% -U postgres -d dayflow_hrms -f seed.sql
if %errorlevel% equ 0 (
    echo Seed data inserted successfully!
) else (
    echo Error inserting seed data!
    exit /b 1
)

echo.
echo ========================================
echo Database setup complete!
echo.
echo You can now login with:
echo Admin: admin@dayflow.com / password123
echo Employee: john.doe@dayflow.com / password123
echo.
pause
