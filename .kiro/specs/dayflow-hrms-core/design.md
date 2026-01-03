# Design Document

## Overview

Dayflow HRMS is a three-tier web application with a React frontend, Node.js/Express backend, and PostgreSQL database. The system follows a RESTful API architecture with JWT-based authentication and role-based authorization middleware. User authentication is handled via the users table, with extended profile data stored in employee_profiles linked by user_id. The design prioritizes simplicity and demo-readiness with straightforward CRUD operations and minimal abstraction layers.

## Architecture

### System Components

```
┌─────────────────┐
│  React Frontend │
│  (Vite + Tailwind)│
└────────┬────────┘
         │ HTTP/JSON
         │ JWT Token
┌────────▼────────┐
│  Express Backend│
│  - Auth Middleware
│  - Route Handlers
│  - Business Logic
└────────┬────────┘
         │ SQL Queries
┌────────▼────────┐
│   PostgreSQL    │
│   Database      │
└─────────────────┘
```

### Request Flow

1. User interacts with React UI
2. Frontend sends HTTP request with JWT token in Authorization header
3. Backend auth middleware validates token and extracts user info
4. Route handler checks role-based permissions
5. Business logic executes and queries database using raw SQL
6. Response returns to frontend as JSON
7. Frontend updates UI based on response

## Components and Interfaces

### Frontend Components

**Authentication Module**
- `LoginPage`: Email/password form, handles login submission
- `AuthContext`: React context for managing auth state and token storage
- `ProtectedRoute`: Wrapper component that checks authentication before rendering

**Employee Module**
- `EmployeeList`: Table view of all employees (admin only)
- `EmployeeForm`: Create/edit employee form (admin only)
- `EmployeeProfile`: View/edit own profile (employee)

**Attendance Module**
- `AttendanceTracker`: Check-in/check-out buttons with current status
- `DailyAttendanceView`: Single day attendance records
- `WeeklyAttendanceView`: 7-day attendance grid
- `AdminAttendanceView`: All employees attendance with date filters

**Leave Module**
- `LeaveRequestForm`: Apply for leave with date range and reason
- `LeaveHistory`: User's leave requests with status
- `LeaveApprovalList`: Pending leaves for admin approval (admin only)

**Payroll Module**
- `PayrollView`: Employee's own payroll records
- `AdminPayrollView`: All employees payroll with CRUD operations (admin only)

### Backend API Endpoints

**Authentication**
- `POST /api/auth/login` - Authenticate user, return JWT token
- `POST /api/auth/logout` - Invalidate session (client-side token removal)
- `GET /api/auth/me` - Get current user info from token

**Employees**
- `GET /api/employees` - List all employee profiles (admin) or own profile (employee)
- `GET /api/employees/:id` - Get specific employee profile by user_id
- `POST /api/employees` - Create new user with employee profile (admin only)
- `PUT /api/employees/:id` - Update employee profile (admin or self for limited fields)
- `DELETE /api/employees/:id` - Delete user and profile (admin only)

**Attendance**
- `POST /api/attendance/checkin` - Record check-in timestamp for current user
- `POST /api/attendance/checkout` - Record check-out timestamp for current user
- `GET /api/attendance/daily?date=YYYY-MM-DD` - Get daily attendance for current user
- `GET /api/attendance/weekly?startDate=YYYY-MM-DD` - Get weekly attendance for current user
- `GET /api/attendance/user/:id` - Get user attendance (admin only)

**Leave**
- `POST /api/leave/request` - Submit leave request
- `GET /api/leave/my-requests` - Get own leave requests
- `GET /api/leave/pending` - Get pending requests (admin only)
- `PUT /api/leave/:id/approve` - Approve leave (admin only)
- `PUT /api/leave/:id/reject` - Reject leave (admin only)

**Payroll**
- `GET /api/payroll/my-payroll` - Get own payroll records
- `GET /api/payroll` - Get all payroll records (admin only)
- `POST /api/payroll` - Create payroll entry (admin only)
- `PUT /api/payroll/:id` - Update payroll entry (admin only)

### Middleware

**authMiddleware**
- Extracts JWT token from Authorization header
- Verifies token signature and expiration
- Attaches decoded user info (id, email, role) to request object
- Returns 401 if token is missing or invalid

**roleMiddleware(allowedRoles)**
- Checks if user's role is in allowedRoles array
- Returns 403 if user lacks required role
- Allows request to proceed if authorized

## Data Models

### Database Schema

**users table**
```sql
id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
email: VARCHAR(255) UNIQUE NOT NULL
password_hash: VARCHAR(255) NOT NULL
role: user_role NOT NULL
created_at: TIMESTAMP DEFAULT NOW()
updated_at: TIMESTAMP DEFAULT NOW()
```

**user_role ENUM**
```sql
CREATE TYPE user_role AS ENUM ('ADMIN', 'EMPLOYEE');
```

**employee_profiles table**
```sql
id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id: UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL
first_name: VARCHAR(100) NOT NULL
last_name: VARCHAR(100) NOT NULL
phone: VARCHAR(20)
department: VARCHAR(100)
position: VARCHAR(100)
hire_date: DATE
created_at: TIMESTAMP DEFAULT NOW()
updated_at: TIMESTAMP DEFAULT NOW()
```

**attendance table**
```sql
id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id: UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL
date: DATE NOT NULL
check_in: TIMESTAMP
check_out: TIMESTAMP
created_at: TIMESTAMP DEFAULT NOW()
UNIQUE(user_id, date)
```

**leave_requests table**
```sql
id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id: UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL
start_date: DATE NOT NULL
end_date: DATE NOT NULL
reason: TEXT
status: leave_status NOT NULL DEFAULT 'PENDING'
created_at: TIMESTAMP DEFAULT NOW()
updated_at: TIMESTAMP DEFAULT NOW()
```

**leave_status ENUM**
```sql
CREATE TYPE leave_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
```

**payroll table**
```sql
id: UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id: UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL
month: INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12)
year: INTEGER NOT NULL
base_salary: DECIMAL(10, 2) NOT NULL
deductions: DECIMAL(10, 2) DEFAULT 0
net_salary: DECIMAL(10, 2) NOT NULL
created_at: TIMESTAMP DEFAULT NOW()
updated_at: TIMESTAMP DEFAULT NOW()
UNIQUE(user_id, month, year)
```

### API Request/Response Formats

**Login Request**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login Response**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "EMPLOYEE"
  }
}
```

**Employee Object**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "650e8400-e29b-41d4-a716-446655440001",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "department": "Engineering",
  "position": "Developer",
  "hire_date": "2024-01-15",
  "role": "EMPLOYEE"
}
```

**Attendance Record**
```json
{
  "id": "750e8400-e29b-41d4-a716-446655440002",
  "user_id": "650e8400-e29b-41d4-a716-446655440001",
  "date": "2024-01-20",
  "check_in": "2024-01-20T09:00:00Z",
  "check_out": "2024-01-20T18:00:00Z"
}
```

**Leave Request**
```json
{
  "id": "850e8400-e29b-41d4-a716-446655440003",
  "user_id": "650e8400-e29b-41d4-a716-446655440001",
  "start_date": "2024-02-01",
  "end_date": "2024-02-03",
  "reason": "Personal",
  "status": "PENDING",
  "created_at": "2024-01-20T10:00:00Z"
}
```

**Payroll Entry**
```json
{
  "id": "950e8400-e29b-41d4-a716-446655440004",
  "user_id": "650e8400-e29b-41d4-a716-446655440001",
  "month": 1,
  "year": 2024,
  "base_salary": 5000.00,
  "deductions": 500.00,
  "net_salary": 4500.00
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Authentication Properties

Property 1: Valid credentials create session
*For any* valid user credentials (email and password), submitting them to the login endpoint should return a valid JWT token and user information.
**Validates: Requirements 1.1**

Property 2: Invalid credentials rejected
*For any* invalid credentials (wrong password or non-existent email), the login attempt should be rejected with an appropriate error message.
**Validates: Requirements 1.2**

Property 3: Logout invalidates token
*For any* authenticated session, after logout, subsequent requests using that token should be rejected as unauthorized.
**Validates: Requirements 1.3**

Property 4: Protected routes require authentication
*For any* protected API endpoint, requests without a valid JWT token should be rejected with 401 status.
**Validates: Requirements 1.4**

### Authorization Properties

Property 5: Admin access to all employee data
*For any* employee profile record, an admin user should be able to retrieve, update, and delete that record.
**Validates: Requirements 2.1**

Property 6: Employee access to own data
*For any* user with EMPLOYEE role, they should be able to retrieve and update their own profile data.
**Validates: Requirements 2.2**

Property 7: Employee cannot access other employee data
*For any* pair of distinct users with EMPLOYEE role, one user should not be able to retrieve or modify the other user's profile data.
**Validates: Requirements 2.3**

Property 8: Employee denied admin actions
*For any* admin-only endpoint, requests from employee-role users should be rejected with 403 status.
**Validates: Requirements 2.4**

### Employee Management Properties

Property 9: Employee CRUD operations persist correctly
*For any* user and employee profile data, creating it should store both user and profile with unique UUIDs, updating it should persist changes, and deleting it should remove both from the system.
**Validates: Requirements 3.1, 3.2, 3.3**

Property 10: Employee list returns all employees
*For any* set of created users with EMPLOYEE role, the admin employee list endpoint should return all of them with their profile data.
**Validates: Requirements 3.4**

Property 11: Employee profile retrieval
*For any* user with EMPLOYEE role, retrieving their own profile should return their complete profile information.
**Validates: Requirements 3.5**

Property 12: Employee field-level update restrictions
*For any* user attempting to update their own profile, they should be able to update permitted fields (phone, department) but not restricted fields (role, email).
**Validates: Requirements 3.6**

### Attendance Properties

Property 13: Check-in creates attendance record
*For any* user on any date, checking in should create an attendance record with the check-in timestamp linked to their user_id.
**Validates: Requirements 4.1**

Property 14: Check-out updates attendance record
*For any* user who has checked in, checking out should update the same attendance record with the check-out timestamp.
**Validates: Requirements 4.2**

Property 15: Duplicate check-in prevention
*For any* user who has already checked in on a given date, attempting to check in again should be rejected.
**Validates: Requirements 4.3**

Property 16: Daily attendance filtering
*For any* date, retrieving daily attendance should return only attendance records for that specific date for the requesting user.
**Validates: Requirements 4.4**

Property 17: Weekly attendance filtering
*For any* week start date, retrieving weekly attendance should return attendance records for the 7-day period starting from that date for the requesting user.
**Validates: Requirements 4.5**

Property 18: Admin attendance access
*For any* user's attendance records, an admin should be able to retrieve them with date filtering options.
**Validates: Requirements 4.6**

### Leave Management Properties

Property 19: Leave request creation with pending status
*For any* valid leave request (start date, end date, reason), submitting it should create a leave request with PENDING status linked to the user's user_id.
**Validates: Requirements 5.1**

Property 20: Leave history retrieval
*For any* user's leave requests, they should be able to retrieve all of them with their current status.
**Validates: Requirements 5.2**

Property 21: Pending leave filtering
*For any* set of leave requests with various statuses, the admin pending leave endpoint should return only those with PENDING status.
**Validates: Requirements 5.3**

Property 22: Leave status transitions
*For any* pending leave request, an admin should be able to update its status to either APPROVED or REJECTED.
**Validates: Requirements 5.4, 5.5**

Property 23: Invalid date range rejection
*For any* leave request where end date is before start date, the submission should be rejected with a validation error.
**Validates: Requirements 5.6**

### Payroll Properties

Property 24: Employee payroll access
*For any* user, they should be able to retrieve their own payroll records but not other users' payroll records.
**Validates: Requirements 6.1, 6.2**

Property 25: Admin payroll access
*For any* payroll entry, an admin should be able to retrieve, create, and update it.
**Validates: Requirements 6.3, 6.4, 6.5**

Property 26: Payroll data completeness
*For any* payroll entry retrieved, the response should include user_id, month, year, base_salary, deductions, and net_salary fields.
**Validates: Requirements 6.6**

### Validation Properties

Property 27: Required field validation
*For any* API endpoint with required fields, submitting a request with missing required fields should be rejected with validation errors.
**Validates: Requirements 7.1**

Property 28: Email format validation
*For any* email input field, submitting an invalid email format should be rejected with a validation error.
**Validates: Requirements 7.2**

Property 29: Date range validation
*For any* date range input (start and end dates), submitting a range where start is after end should be rejected with a validation error.
**Validates: Requirements 7.3**

Property 30: Numeric range validation
*For any* numeric input field with defined ranges (e.g., month 1-12), submitting values outside the range should be rejected with a validation error.
**Validates: Requirements 7.4**

Property 31: Error message clarity
*For any* validation failure, the error response should include a clear message indicating which field failed validation and why.
**Validates: Requirements 7.5**

## Error Handling

### HTTP Status Codes

- **200 OK**: Successful GET, PUT requests
- **201 Created**: Successful POST requests that create resources
- **400 Bad Request**: Validation errors, malformed requests
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Valid authentication but insufficient permissions
- **404 Not Found**: Resource does not exist
- **409 Conflict**: Duplicate resource (e.g., duplicate check-in)
- **500 Internal Server Error**: Unexpected server errors

### Error Response Format

All error responses follow a consistent structure:

```json
{
  "error": {
    "message": "Human-readable error message",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Error Scenarios

**Authentication Errors**
- Invalid credentials: 401 with message "Invalid email or password"
- Missing token: 401 with message "Authentication required"
- Expired token: 401 with message "Session expired, please login again"

**Authorization Errors**
- Insufficient permissions: 403 with message "Access denied"
- Employee accessing other's data: 403 with message "You can only access your own data"
- Non-admin attempting admin action: 403 with message "Admin access required"

**Validation Errors**
- Missing required fields: 400 with details listing missing fields
- Invalid email format: 400 with message "Invalid email format"
- Invalid date range: 400 with message "End date must be after start date"
- Duplicate check-in: 409 with message "Already checked in today"

**Resource Errors**
- User not found: 404 with message "User not found"
- Employee profile not found: 404 with message "Employee profile not found"
- Leave request not found: 404 with message "Leave request not found"

**Database Errors**
- Connection failures: 500 with message "Database connection error"
- Query errors: 500 with message "An error occurred processing your request"

### Frontend Error Handling

- Display error messages in toast notifications or inline form errors
- Redirect to login page on 401 errors
- Show generic error message for 500 errors
- Highlight specific form fields for validation errors

## Testing Strategy

### Dual Testing Approach

The system will use both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests**: Verify specific examples, edge cases, and error conditions
- Test specific user scenarios (e.g., admin creates employee with specific data)
- Test edge cases (e.g., empty strings, boundary dates)
- Test error conditions (e.g., duplicate email, invalid token format)
- Test integration points between components

**Property-Based Tests**: Verify universal properties across all inputs
- Generate random valid inputs and verify properties hold
- Test that CRUD operations work correctly for any valid data
- Test that authorization rules apply to any user/resource combination
- Test that validation rules catch any invalid input

Both testing approaches are complementary and necessary for comprehensive coverage. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across the input space.

### Property-Based Testing Configuration

**Testing Library**: Use `fast-check` for JavaScript/TypeScript property-based testing

**Test Configuration**:
- Minimum 100 iterations per property test
- Each property test must reference its design document property
- Tag format: `// Feature: dayflow-hrms-core, Property {number}: {property_text}`

**Example Property Test Structure**:
```javascript
// Feature: dayflow-hrms-core, Property 1: Valid credentials create session
test('valid credentials should create session', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.emailAddress(),
      fc.string({ minLength: 8 }),
      async (email, password) => {
        // Create user with credentials
        // Attempt login
        // Verify token is returned
      }
    ),
    { numRuns: 100 }
  );
});
```

### Test Organization

**Backend Tests**
- `tests/auth.test.js` - Authentication and authorization tests
- `tests/employees.test.js` - Employee CRUD tests
- `tests/attendance.test.js` - Attendance tracking tests
- `tests/leave.test.js` - Leave management tests
- `tests/payroll.test.js` - Payroll tests
- `tests/validation.test.js` - Input validation tests

**Frontend Tests**
- `src/components/__tests__/` - Component unit tests
- `src/integration/__tests__/` - Integration tests for user flows
- Focus on critical user interactions and state management

### Testing Priorities

1. **Authentication and Authorization** (highest priority)
   - Property tests for all auth/authz properties
   - Unit tests for token generation, validation, and expiration

2. **CRUD Operations**
   - Property tests for create, read, update, delete operations
   - Unit tests for specific edge cases (empty data, special characters)

3. **Business Logic**
   - Property tests for attendance check-in/check-out logic
   - Property tests for leave approval workflow
   - Unit tests for date calculations and status transitions

4. **Validation**
   - Property tests for all validation rules
   - Unit tests for specific invalid input examples

5. **Error Handling**
   - Unit tests for each error scenario
   - Verify correct status codes and error messages

### Manual Testing Checklist

Before demo, manually verify:
- [ ] Login as admin and employee
- [ ] Admin can create, edit, delete users with employee profiles
- [ ] Employee can view and edit own profile (limited fields)
- [ ] Check-in and check-out flow works
- [ ] Daily and weekly attendance views display correctly
- [ ] Leave request submission and approval workflow
- [ ] Payroll viewing for employee and admin
- [ ] Authorization prevents unauthorized access
- [ ] Error messages display correctly
- [ ] UUID primary keys are used throughout
- [ ] user_id foreign keys link correctly across tables
