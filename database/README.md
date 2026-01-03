# Dayflow HRMS Database Setup

## Prerequisites

- PostgreSQL 12 or higher installed
- PostgreSQL command-line tools (psql)

## Database Setup Instructions

### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE dayflow_hrms;

# Exit psql
\q
```

### 2. Run Schema

```bash
# Run schema.sql to create tables
psql -U postgres -d dayflow_hrms -f database/schema.sql
```

### 3. Run Seed Data (Optional)

```bash
# Run seed.sql to insert sample data
psql -U postgres -d dayflow_hrms -f database/seed.sql
```

## Sample Credentials

After running seed data, you can login with:

**Admin Account:**
- Email: `admin@dayflow.com`
- Password: `password123`

**Employee Accounts:**
- Email: `john.doe@dayflow.com` / Password: `password123`
- Email: `jane.smith@dayflow.com` / Password: `password123`
- Email: `bob.johnson@dayflow.com` / Password: `password123`

## Database Schema

### Tables

1. **users** - User authentication and roles
2. **employee_profiles** - Extended employee information
3. **attendance** - Daily check-in/check-out records
4. **leave_requests** - Leave applications and approvals
5. **payroll** - Monthly salary records

### ENUM Types

- **user_role**: ADMIN, EMPLOYEE
- **leave_status**: PENDING, APPROVED, REJECTED

## Verify Installation

```bash
# Connect to database
psql -U postgres -d dayflow_hrms

# List tables
\dt

# Check users
SELECT email, role FROM users;

# Exit
\q
```

## Reset Database

To reset the database and start fresh:

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS dayflow_hrms;"
psql -U postgres -c "CREATE DATABASE dayflow_hrms;"

# Run schema and seed again
psql -U postgres -d dayflow_hrms -f database/schema.sql
psql -U postgres -d dayflow_hrms -f database/seed.sql
```

## Notes

- All IDs use UUID for better security and scalability
- Passwords are hashed using bcrypt
- Foreign keys have CASCADE delete for data integrity
- Indexes are created for frequently queried columns
- Triggers automatically update `updated_at` timestamps
