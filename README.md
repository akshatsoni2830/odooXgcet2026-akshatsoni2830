# Dayflow HRMS 

A full-stack Human Resource Management System built for hackathon demonstration.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (raw SQL, no ORM)

## Features

### Admin Features
- Employee management (CRUD operations)
- Attendance monitoring for all employees
- Leave request approval/rejection
- Payroll management

### Employee Features
- Profile management
- Daily check-in/check-out
- Attendance history (daily/weekly views)
- Leave application and tracking
- Payroll viewing

## Quick Start

See [SETUP.md](SETUP.md) for complete installation instructions.

```bash
# 1. Setup database
psql -U postgres -c "CREATE DATABASE dayflow_hrms;"
psql -U postgres -d dayflow_hrms -f database/schema.sql
psql -U postgres -d dayflow_hrms -f database/seed.sql

# 2. Start backend
cd backend
npm install
npm start

# 3. Start frontend
cd frontend
npm install
npm run dev
```

## Sample Credentials

- **Admin:** admin@dayflow.com / password123
- **Employee:** john.doe@dayflow.com / password123

## Repository Structure

- `backend/` - Express API server
- `frontend/` - React application
- `database/` - PostgreSQL schema and seed data
- `docs/` - Additional documentation

## Branch Structure

- `frontend` - UI code only
- `backend` - APIs, auth, business logic
- `database` - SQL schema, migrations, seed data

## License

MIT

## Team

Developed for Odoo x GCET 2026 Hackathon
