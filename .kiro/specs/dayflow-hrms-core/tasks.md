# Implementation Plan: Dayflow HRMS Core

## Overview

This implementation plan breaks down the Dayflow HRMS system into discrete coding tasks across three branches: database (schema), backend (APIs), and frontend (UI). Each task builds incrementally, with testing integrated throughout to catch errors early.

## Tasks

### Database Setup

- [ ] 1. Create database schema and seed data
  - Create `database/schema.sql` with all table definitions (users, employee_profiles, attendance, leave_requests, payroll)
  - Create ENUMs for user_role and leave_status
  - Use UUID primary keys with gen_random_uuid()
  - Use user_id as foreign key across all tables
  - Create `database/seed.sql` with sample admin and employee users
  - Include foreign key constraints and check constraints as per design
  - _Branch: database_
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1_

### Backend - Authentication & Authorization

- [ ] 2. Set up Express server and middleware
  - Create `backend/server.js` with Express app setup
  - Create `backend/config/database.js` for PostgreSQL connection using pg library
  - Create `backend/middleware/authMiddleware.js` for JWT token verification
  - Create `backend/middleware/roleMiddleware.js` for role-based access control
  - _Branch: backend_
  - _Requirements: 1.4, 2.1_

- [ ] 3. Implement authentication endpoints
  - [ ] 3.1 Create `backend/routes/auth.js` with login, logout, and me endpoints
    - POST /api/auth/login - verify credentials, generate JWT token
    - POST /api/auth/logout - client-side token removal (no server action needed)
    - GET /api/auth/me - return current user info from token
    - _Branch: backend_
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ]* 3.2 Write property test for authentication
    - **Property 1: Valid credentials create session**
    - **Property 2: Invalid credentials rejected**
    - **Property 3: Logout invalidates token**
    - **Property 4: Protected routes require authentication**
    - _Branch: backend_
    - _Validates: Requirements 1.1, 1.2, 1.3, 1.4_

- [ ] 4. Implement authorization checks
  - [ ] 4.1 Add role checks to authMiddleware
    - Verify admin can access all endpoints
    - Verify employee can only access own data
    - _Branch: backend_
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 4.2 Write property tests for authorization
    - **Property 5: Admin access to all employee data**
    - **Property 6: Employee access to own data**
    - **Property 7: Employee cannot access other employee data**
    - **Property 8: Employee denied admin actions**
    - _Branch: backend_
    - _Validates: Requirements 2.1, 2.2, 2.3, 2.4_

- [ ] 5. Checkpoint - Ensure auth tests pass
  - Ensure all tests pass, ask the user if questions arise.

### Backend - Employee Management

- [ ] 6. Implement employee CRUD endpoints
  - [ ] 6.1 Create `backend/routes/employees.js` with all employee endpoints
    - GET /api/employees - list all employee profiles (admin) or own profile (employee)
    - GET /api/employees/:id - get specific employee profile by user_id
    - POST /api/employees - create user with employee profile (admin only)
    - PUT /api/employees/:id - update employee profile (admin or self with restrictions)
    - DELETE /api/employees/:id - delete user and profile (admin only)
    - Join users and employee_profiles tables for complete data
    - _Branch: backend_
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 6.2 Write property tests for employee management
    - **Property 9: Employee CRUD operations persist correctly**
    - **Property 10: Employee list returns all employees**
    - **Property 11: Employee profile retrieval**
    - **Property 12: Employee field-level update restrictions**
    - _Branch: backend_
    - _Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

### Backend - Attendance Tracking

- [ ] 7. Implement attendance endpoints
  - [ ] 7.1 Create `backend/routes/attendance.js` with attendance endpoints
    - POST /api/attendance/checkin - create attendance record with check-in time for current user
    - POST /api/attendance/checkout - update attendance record with check-out time for current user
    - GET /api/attendance/daily?date=YYYY-MM-DD - get daily attendance for current user
    - GET /api/attendance/weekly?startDate=YYYY-MM-DD - get weekly attendance for current user
    - GET /api/attendance/user/:id - get user attendance (admin only)
    - Use user_id from JWT token for current user operations
    - _Branch: backend_
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 7.2 Write property tests for attendance
    - **Property 13: Check-in creates attendance record**
    - **Property 14: Check-out updates attendance record**
    - **Property 15: Duplicate check-in prevention**
    - **Property 16: Daily attendance filtering**
    - **Property 17: Weekly attendance filtering**
    - **Property 18: Admin attendance access**
    - _Branch: backend_
    - _Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

### Backend - Leave Management

- [ ] 8. Implement leave management endpoints
  - [ ] 8.1 Create `backend/routes/leave.js` with leave endpoints
    - POST /api/leave/request - submit leave request with PENDING status for current user
    - GET /api/leave/my-requests - get own leave requests using user_id from token
    - GET /api/leave/pending - get pending requests (admin only)
    - PUT /api/leave/:id/approve - approve leave (admin only)
    - PUT /api/leave/:id/reject - reject leave (admin only)
    - Use leave_status ENUM values
    - _Branch: backend_
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ]* 8.2 Write property tests for leave management
    - **Property 19: Leave request creation with pending status**
    - **Property 20: Leave history retrieval**
    - **Property 21: Pending leave filtering**
    - **Property 22: Leave status transitions**
    - **Property 23: Invalid date range rejection**
    - _Branch: backend_
    - _Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

### Backend - Payroll

- [ ] 9. Implement payroll endpoints
  - [ ] 9.1 Create `backend/routes/payroll.js` with payroll endpoints
    - GET /api/payroll/my-payroll - get own payroll records using user_id from token
    - GET /api/payroll - get all payroll records (admin only)
    - POST /api/payroll - create payroll entry with user_id (admin only)
    - PUT /api/payroll/:id - update payroll entry (admin only)
    - Ensure unique constraint on (user_id, month, year)
    - _Branch: backend_
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ]* 9.2 Write property tests for payroll
    - **Property 24: Employee payroll access**
    - **Property 25: Admin payroll access**
    - **Property 26: Payroll data completeness**
    - _Branch: backend_
    - _Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

### Backend - Validation

- [ ] 10. Implement input validation
  - [ ] 10.1 Create `backend/middleware/validation.js` with validation functions
    - Validate required fields for all endpoints
    - Validate email format
    - Validate date ranges (start before end)
    - Validate numeric ranges (month 1-12, positive salaries)
    - Return clear error messages with field details
    - _Branch: backend_
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ]* 10.2 Write property tests for validation
    - **Property 27: Required field validation**
    - **Property 28: Email format validation**
    - **Property 29: Date range validation**
    - **Property 30: Numeric range validation**
    - **Property 31: Error message clarity**
    - _Branch: backend_
    - _Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 11. Checkpoint - Ensure all backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

### Frontend - Authentication

- [ ] 12. Set up React app and routing
  - Create `frontend/src/App.jsx` with React Router setup
  - Create `frontend/src/context/AuthContext.jsx` for auth state management
  - Create `frontend/src/components/ProtectedRoute.jsx` for route protection
  - Configure Tailwind CSS
  - _Branch: frontend_
  - _Requirements: 1.1, 8.1, 8.2, 8.3_

- [ ] 13. Implement login page
  - [ ] 13.1 Create `frontend/src/pages/LoginPage.jsx`
    - Email and password input fields
    - Login button that calls POST /api/auth/login
    - Store JWT token in localStorage on success
    - Display error messages for failed login
    - Redirect to dashboard on success
    - _Branch: frontend_
    - _Requirements: 1.1, 1.2, 8.1_

  - [ ]* 13.2 Write unit tests for login page
    - Test form submission with valid credentials
    - Test error display for invalid credentials
    - Test token storage on success
    - _Branch: frontend_
    - _Requirements: 1.1, 1.2_

### Frontend - Employee Management

- [ ] 14. Implement employee list and management
  - [ ] 14.1 Create `frontend/src/pages/EmployeeList.jsx` (admin only)
    - Table displaying all users with EMPLOYEE role and their profiles
    - Edit and delete buttons for each employee
    - Add new employee button
    - _Branch: frontend_
    - _Requirements: 3.4_

  - [ ] 14.2 Create `frontend/src/pages/EmployeeForm.jsx` (admin only)
    - Form for creating/editing users with employee profiles
    - All fields (email, password, first_name, last_name, phone, department, position, hire_date)
    - Submit button that calls POST or PUT /api/employees
    - _Branch: frontend_
    - _Requirements: 3.1, 3.2_

  - [ ] 14.3 Create `frontend/src/pages/EmployeeProfile.jsx` (employee)
    - Display own profile information from employee_profiles
    - Edit button for permitted fields only (phone, department)
    - Update form that calls PUT /api/employees/:id
    - _Branch: frontend_
    - _Requirements: 3.5, 3.6_

### Frontend - Attendance Tracking

- [ ] 15. Implement attendance tracking UI
  - [ ] 15.1 Create `frontend/src/pages/AttendanceTracker.jsx`
    - Check-in button that calls POST /api/attendance/checkin
    - Check-out button that calls POST /api/attendance/checkout
    - Display current check-in status
    - Disable check-in if already checked in today
    - _Branch: frontend_
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 15.2 Create `frontend/src/pages/AttendanceView.jsx`
    - Date picker for selecting date or week
    - Toggle between daily and weekly view
    - Display attendance records in table format
    - Show check-in and check-out times
    - _Branch: frontend_
    - _Requirements: 4.4, 4.5_

  - [ ] 15.3 Create `frontend/src/pages/AdminAttendanceView.jsx` (admin only)
    - User filter dropdown (select by user_id)
    - Date range filter
    - Display all users' attendance records
    - _Branch: frontend_
    - _Requirements: 4.6_

### Frontend - Leave Management

- [ ] 16. Implement leave management UI
  - [ ] 16.1 Create `frontend/src/pages/LeaveRequestForm.jsx`
    - Start date and end date pickers
    - Reason text area
    - Submit button that calls POST /api/leave/request
    - Validate that end date is after start date
    - _Branch: frontend_
    - _Requirements: 5.1, 5.6_

  - [ ] 16.2 Create `frontend/src/pages/LeaveHistory.jsx`
    - Display user's leave requests in table
    - Show status (PENDING, APPROVED, REJECTED) with color coding
    - _Branch: frontend_
    - _Requirements: 5.2_

  - [ ] 16.3 Create `frontend/src/pages/LeaveApproval.jsx` (admin only)
    - Display pending leave requests
    - Approve and reject buttons for each request
    - Call PUT /api/leave/:id/approve or reject
    - _Branch: frontend_
    - _Requirements: 5.3, 5.4, 5.5_

### Frontend - Payroll

- [ ] 17. Implement payroll viewing UI
  - [ ] 17.1 Create `frontend/src/pages/PayrollView.jsx` (employee)
    - Display own payroll records in table
    - Show month, year, base salary, deductions, net salary
    - _Branch: frontend_
    - _Requirements: 6.1, 6.6_

  - [ ] 17.2 Create `frontend/src/pages/AdminPayrollView.jsx` (admin only)
    - Display all users' payroll records
    - Add new payroll entry button
    - Edit button for each payroll entry
    - _Branch: frontend_
    - _Requirements: 6.3, 6.6_

  - [ ] 17.3 Create `frontend/src/pages/PayrollForm.jsx` (admin only)
    - Form for creating/editing payroll entries
    - User dropdown (select by user_id), month/year selectors
    - Base salary, deductions, net salary fields
    - Submit button that calls POST or PUT /api/payroll
    - _Branch: frontend_
    - _Requirements: 6.4, 6.5_

### Frontend - Navigation and Layout

- [ ] 18. Implement navigation and layout
  - Create `frontend/src/components/Navbar.jsx` with role-based menu items
  - Create `frontend/src/components/Layout.jsx` with navbar and content area
  - Add logout button that clears token and redirects to login
  - _Branch: frontend_
  - _Requirements: 1.3_

### Integration and Final Testing

- [ ] 19. Wire all components together
  - Connect all frontend pages to backend APIs
  - Ensure proper error handling and loading states
  - Test role-based navigation and access control
  - Verify UUID handling in API calls
  - _Branch: frontend_
  - _Requirements: All_

- [ ]* 20. Integration testing
  - Test complete user flows (login → check-in → apply leave → view payroll)
  - Test admin flows (create user with profile → approve leave → manage payroll)
  - Test authorization boundaries
  - Verify UUID primary keys work correctly
  - _Requirements: All_

- [ ] 21. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- All backend tasks belong to the `backend` branch
- All frontend tasks belong to the `frontend` branch
- Database tasks belong to the `database` branch
