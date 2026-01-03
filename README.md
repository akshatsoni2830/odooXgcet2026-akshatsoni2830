# Dayflow HRMS 🚀

A comprehensive Human Resource Management System built with modern web technologies for efficient workforce management.

## 📋 Overview

Dayflow HRMS is a full-stack web application designed to streamline HR operations including employee management, attendance tracking, leave management, and payroll processing. Built with security and scalability in mind, it features role-based access control and JWT authentication.

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

### Database
- **PostgreSQL 14+** - Primary database
- **UUID** - Primary keys for all tables
- Raw SQL queries (no ORM)

## ✨ Features

### 👨‍💼 Admin Features
- **Employee Management**
  - Create, read, update, delete employee profiles
  - Auto-generate unique login IDs
  - Manage employee roles (Admin/Employee)
  - View complete employee directory

- **Attendance Management**
  - Monitor all employee attendance
  - View daily/weekly attendance reports
  - Track check-in/check-out times

- **Leave Management**
  - Review pending leave requests
  - Approve or reject leave applications
  - Add admin comments to leave decisions
  - View complete leave history

- **Payroll Management**
  - Create and manage payroll entries
  - Calculate net salary (base + bonuses - deductions)
  - View payroll history for all employees
  - Generate monthly payroll reports

### 👤 Employee Features
- **Profile Management**
  - View and update personal information
  - Change password securely
  - View assigned role and department

- **Attendance Tracking**
  - Daily check-in/check-out
  - View personal attendance history
  - Weekly attendance summary

- **Leave Management**
  - Submit leave requests (Paid/Sick/Unpaid)
  - Track leave request status
  - View admin comments on leave decisions

- **Payroll Access**
  - View personal payroll records
  - Access salary breakdowns
  - Download payroll history

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 14+
- Git

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd dayflow-hrms
```

#### 2. Database Setup
```bash
# Create database
psql -U postgres -c "CREATE DATABASE dayflow_hrms;"

# Run schema
psql -U postgres -d dayflow_hrms -f database/schema.sql

# Seed initial data
psql -U postgres -d dayflow_hrms -f database/seed.sql
```

#### 3. Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "PORT=5000" > .env
echo "JWT_SECRET=your-super-secret-jwt-key-change-this-in-production" >> .env
echo "DB_USER=postgres" >> .env
echo "DB_HOST=localhost" >> .env
echo "DB_NAME=dayflow_hrms" >> .env
echo "DB_PASSWORD=your-postgres-password" >> .env
echo "DB_PORT=5432" >> .env

# Start backend server
npm start
```

Backend will run on `http://localhost:5000`

#### 4. Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔐 Sample Credentials

### Admin Account
- **Email:** admin@dayflow.com
- **Password:** password123
- **Login ID:** DF-ADMIN-001

### Employee Accounts
- **Email:** john.doe@dayflow.com
- **Password:** password123
- **Login ID:** DF-EMP-001

- **Email:** jane.smith@dayflow.com
- **Password:** password123
- **Login ID:** DF-EMP-002

## 📁 Project Structure

```
dayflow-hrms/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Auth & role middleware
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React context (Auth)
│   │   ├── pages/       # Page components
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── database/
│   ├── schema.sql       # Database schema
│   ├── seed.sql         # Sample data
│   └── README.md        # Database documentation
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Employees
- `GET /api/employees` - List employees
- `GET /api/employees/:id` - Get employee details
- `POST /api/employees` - Create employee (Admin)
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee (Admin)

### Attendance
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/daily` - Daily attendance
- `GET /api/attendance/weekly` - Weekly attendance

### Leave
- `POST /api/leave/request` - Submit leave request
- `GET /api/leave/my-requests` - Get own requests
- `GET /api/leave/pending` - Get pending requests (Admin)
- `PUT /api/leave/:id/approve` - Approve leave (Admin)
- `PUT /api/leave/:id/reject` - Reject leave (Admin)

### Payroll
- `GET /api/payroll/my-payroll` - Get own payroll
- `GET /api/payroll` - Get all payroll (Admin)
- `POST /api/payroll` - Create payroll entry (Admin)
- `PUT /api/payroll/:id` - Update payroll (Admin)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Protected API routes
- SQL injection prevention
- CORS enabled
- Input validation

## 🌿 Branch Structure

- **main** - Production-ready integrated code
- **frontend** - Frontend development (Manas Bhavsar)
- **backend** - Backend development (Akshat Soni)
- **database** - Database schemas and migrations (Renuka Jawale)

## 🤝 Contributing

This project was developed as part of the Odoo x GCET 2026 Hackathon.

### Team Members
- **Akshat Soni** - Backend & Integration
- **Manas Bhavsar** - Frontend Development
- **Renuka Jawale** - Database Design

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🐛 Known Issues

- Leave approval functionality requires testing
- Attendance daily endpoint validation needed
- Frontend port configuration (3000 vs 3001)

## 📞 Support

For issues and questions, please open an issue in the repository.

---

**Built with ❤️ for Odoo x GCET 2026 Hackathon**
