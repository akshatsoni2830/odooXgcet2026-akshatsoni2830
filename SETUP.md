# Dayflow HRMS - Complete Setup Guide

## Prerequisites

- Node.js 16+ and npm
- PostgreSQL 12+
- Git

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/akshatsoni2830/odooXgcet2026-akshatsoni2830.git
cd odooXgcet2026-akshatsoni2830
```

### 2. Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE dayflow_hrms;"

# Run schema
psql -U postgres -d dayflow_hrms -f database/schema.sql

# Run seed data (optional - includes sample users)
psql -U postgres -d dayflow_hrms -f database/seed.sql
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=dayflow_hrms
# DB_USER=postgres
# DB_PASSWORD=your_password
# JWT_SECRET=your_secret_key_here
# JWT_EXPIRES_IN=24h

# Start backend server
npm start
# Or for development with auto-reload:
npm run dev
```

Backend will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## Sample Login Credentials

After running seed data:

**Admin:**
- Email: `admin@dayflow.com`
- Password: `password123`

**Employee:**
- Email: `john.doe@dayflow.com`
- Password: `password123`

## Project Structure

```
dayflow-hrms/
├── backend/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT authentication
│   │   └── roleMiddleware.js    # Role-based access control
│   ├── routes/
│   │   ├── auth.js              # Login, logout, me
│   │   ├── employees.js         # Employee CRUD
│   │   ├── attendance.js        # Check-in/out, views
│   │   ├── leave.js             # Leave requests, approval
│   │   └── payroll.js           # Payroll management
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EmployeeList.jsx
│   │   │   ├── EmployeeForm.jsx
│   │   │   ├── EmployeeProfile.jsx
│   │   │   ├── AttendancePage.jsx
│   │   │   ├── LeavePage.jsx
│   │   │   ├── AdminLeavePage.jsx
│   │   │   ├── PayrollPage.jsx
│   │   │   ├── AdminPayrollPage.jsx
│   │   │   └── PayrollForm.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── database/
│   ├── schema.sql               # Database schema
│   ├── seed.sql                 # Sample data
│   └── README.md
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Employees (Admin)
- `GET /api/employees` - List all employees
- `GET /api/employees/:id` - Get employee
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/daily?date=YYYY-MM-DD` - Daily view
- `GET /api/attendance/weekly?startDate=YYYY-MM-DD` - Weekly view
- `GET /api/attendance/user/:id` - User attendance (admin)

### Leave
- `POST /api/leave/request` - Submit leave request
- `GET /api/leave/my-requests` - Own leave requests
- `GET /api/leave/pending` - Pending requests (admin)
- `GET /api/leave/all` - All requests (admin)
- `PUT /api/leave/:id/approve` - Approve (admin)
- `PUT /api/leave/:id/reject` - Reject (admin)

### Payroll
- `GET /api/payroll/my-payroll` - Own payroll
- `GET /api/payroll` - All payroll (admin)
- `GET /api/payroll/user/:id` - User payroll (admin)
- `POST /api/payroll` - Create payroll (admin)
- `PUT /api/payroll/:id` - Update payroll (admin)
- `DELETE /api/payroll/:id` - Delete payroll (admin)

## Features

### Admin Features
- Manage employees (create, edit, delete)
- View all attendance records
- Approve/reject leave requests
- Manage payroll for all employees

### Employee Features
- View and edit own profile
- Check-in and check-out daily
- View attendance history (daily/weekly)
- Apply for leave
- View leave request status
- View own payroll records

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check .env credentials match your PostgreSQL setup
- Ensure database `dayflow_hrms` exists

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Change port in vite.config.js

### CORS Errors
- Ensure backend is running on port 5000
- Frontend proxy is configured in vite.config.js

## Development Notes

- Backend uses raw SQL queries (no ORM)
- Frontend uses Vite + React + Tailwind CSS
- Authentication via JWT tokens
- Role-based access control (ADMIN/EMPLOYEE)
- UUID primary keys throughout database

## Production Deployment

1. Build frontend: `cd frontend && npm run build`
2. Set production environment variables
3. Use process manager (PM2) for backend
4. Configure reverse proxy (nginx)
5. Enable HTTPS
6. Set secure JWT_SECRET
7. Configure database backups

## Support

For issues or questions, refer to the project documentation or contact the development team.
