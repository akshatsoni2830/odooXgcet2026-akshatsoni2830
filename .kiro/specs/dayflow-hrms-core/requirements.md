# Requirements Document

## Introduction

Dayflow HRMS is a full-stack web application for managing core HR operations in a small to medium organization. The system supports two user roles (ADMIN and EMPLOYEE) and provides essential HR workflows including authentication, employee management, attendance tracking, leave management, and payroll viewing.

## Glossary

- **System**: The Dayflow HRMS web application
- **Admin**: User with ADMIN role who can manage employee profiles, approve leaves, and manage payroll
- **Employee**: User with EMPLOYEE role who can manage their own profile, track attendance, and apply for leaves
- **User**: Authentication entity with email, password, and role
- **Employee_Profile**: Extended profile data linked to a user via user_id
- **Session**: An authenticated user session maintained via JWT tokens
- **Attendance_Record**: A single check-in/check-out entry for a user on a specific date
- **Leave_Request**: An application for time off submitted by a user
- **Payroll_Entry**: A monthly salary record for a user

## Requirements

### Requirement 1: User Authentication

**User Story:** As a user, I want to log in with my credentials, so that I can access the system securely.

#### Acceptance Criteria

1. WHEN a user submits valid email and password THEN THE System SHALL authenticate the user and create a session
2. WHEN a user submits invalid credentials THEN THE System SHALL reject the login and return an error message
3. WHEN a user logs out THEN THE System SHALL terminate the session and clear authentication tokens
4. WHEN an authenticated user accesses protected routes THEN THE System SHALL verify the session token before granting access
5. WHEN a session token expires THEN THE System SHALL require re-authentication

### Requirement 2: Role-Based Authorization

**User Story:** As an admin, I want role-based access control, so that employees can only access their own data while admins can manage all data.

#### Acceptance Criteria

1. WHEN an Admin accesses any employee data THEN THE System SHALL grant access
2. WHEN an Employee accesses their own data THEN THE System SHALL grant access
3. WHEN an Employee attempts to access another employee's data THEN THE System SHALL deny access
4. WHEN an Employee attempts to perform admin-only actions THEN THE System SHALL deny access and return an authorization error
5. WHEN a user's role is determined THEN THE System SHALL use the role stored in the database

### Requirement 3: Employee Profile Management

**User Story:** As an admin, I want to create, view, update, and delete employee profiles, so that I can maintain accurate employee records.

#### Acceptance Criteria

1. WHEN an Admin creates a new user with employee profile THEN THE System SHALL store the user and profile data with unique identifiers
2. WHEN an Admin updates employee profile information THEN THE System SHALL persist the changes to the database
3. WHEN an Admin deletes a user THEN THE System SHALL remove the user and associated profile from the system
4. WHEN an Admin views the employee list THEN THE System SHALL display all users with EMPLOYEE role and their profile information
5. WHEN a user views their own profile THEN THE System SHALL display their complete profile information
6. WHEN a user updates their own profile THEN THE System SHALL allow updates to permitted fields only

### Requirement 4: Attendance Tracking

**User Story:** As a user, I want to check in and check out daily, so that my work hours are recorded.

#### Acceptance Criteria

1. WHEN a user checks in THEN THE System SHALL create an Attendance_Record with check-in timestamp
2. WHEN a user checks out THEN THE System SHALL update the Attendance_Record with check-out timestamp
3. WHEN a user checks in twice on the same day THEN THE System SHALL prevent duplicate check-ins
4. WHEN a user views daily attendance THEN THE System SHALL display attendance records for the selected date
5. WHEN a user views weekly attendance THEN THE System SHALL display attendance records for the selected week
6. WHEN an Admin views attendance THEN THE System SHALL display attendance records for all users with filtering options

### Requirement 5: Leave Management

**User Story:** As a user, I want to apply for leave, so that I can request time off from work.

#### Acceptance Criteria

1. WHEN a user submits a leave request THEN THE System SHALL create a Leave_Request with pending status
2. WHEN a user views their leave history THEN THE System SHALL display all their leave requests with status
3. WHEN an Admin views pending leave requests THEN THE System SHALL display all pending Leave_Request entries
4. WHEN an Admin approves a leave request THEN THE System SHALL update the Leave_Request status to approved
5. WHEN an Admin rejects a leave request THEN THE System SHALL update the Leave_Request status to rejected
6. WHEN a leave request is submitted with invalid dates THEN THE System SHALL reject the request and return an error

### Requirement 6: Payroll Viewing

**User Story:** As a user, I want to view my payroll information, so that I can see my salary details.

#### Acceptance Criteria

1. WHEN a user views their payroll THEN THE System SHALL display their Payroll_Entry records
2. WHEN a user attempts to view another user's payroll THEN THE System SHALL deny access
3. WHEN an Admin views payroll data THEN THE System SHALL display all users' Payroll_Entry records
4. WHEN an Admin creates a payroll entry THEN THE System SHALL store the Payroll_Entry with user association
5. WHEN an Admin updates a payroll entry THEN THE System SHALL persist the changes to the database
6. WHEN payroll data is displayed THEN THE System SHALL show month, year, base salary, deductions, and net salary

### Requirement 7: Data Validation

**User Story:** As a system administrator, I want all user inputs validated, so that data integrity is maintained.

#### Acceptance Criteria

1. WHEN a user submits a form with empty required fields THEN THE System SHALL reject the submission and display validation errors
2. WHEN a user submits an email address THEN THE System SHALL validate the email format
3. WHEN a user submits date ranges THEN THE System SHALL validate that start date is before end date
4. WHEN a user submits numeric values THEN THE System SHALL validate that values are within acceptable ranges
5. WHEN invalid data is submitted THEN THE System SHALL return clear error messages indicating the validation failures

### Requirement 8: Session Management

**User Story:** As a user, I want my session to persist across page refreshes, so that I don't have to log in repeatedly.

#### Acceptance Criteria

1. WHEN a user logs in successfully THEN THE System SHALL store the session token in browser storage
2. WHEN a user refreshes the page THEN THE System SHALL restore the session from stored token
3. WHEN a session token is invalid or expired THEN THE System SHALL redirect the user to the login page
4. WHEN a user closes the browser THEN THE System SHALL maintain the session based on token expiry settings
