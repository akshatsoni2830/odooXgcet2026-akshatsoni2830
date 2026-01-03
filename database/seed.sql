-- Dayflow HRMS Seed Data
-- Sample data for testing and development

-- Note: Password for all users is 'password123'
-- Hash generated using bcrypt with 10 rounds

-- Insert Admin User
INSERT INTO users (email, password_hash, role) VALUES
('admin@dayflow.com', '$2b$10$U4sh/vv2xOiC9iAbLtiAUOcFsvWlWpKN0pi1FLb3LjYLXFMPf8R2S', 'ADMIN');

-- Get admin user_id for reference
DO $$
DECLARE
    admin_id UUID;
BEGIN
    SELECT id INTO admin_id FROM users WHERE email = 'admin@dayflow.com';
    
    -- Insert Admin Profile
    INSERT INTO employee_profiles (user_id, first_name, last_name, phone, department, position, hire_date) VALUES
    (admin_id, 'Admin', 'User', '1234567890', 'Management', 'System Administrator', '2024-01-01');
END $$;

-- Insert Sample Employees
INSERT INTO users (email, password_hash, role) VALUES
('john.doe@dayflow.com', '$2b$10$U4sh/vv2xOiC9iAbLtiAUOcFsvWlWpKN0pi1FLb3LjYLXFMPf8R2S', 'EMPLOYEE'),
('jane.smith@dayflow.com', '$2b$10$U4sh/vv2xOiC9iAbLtiAUOcFsvWlWpKN0pi1FLb3LjYLXFMPf8R2S', 'EMPLOYEE'),
('bob.johnson@dayflow.com', '$2b$10$U4sh/vv2xOiC9iAbLtiAUOcFsvWlWpKN0pi1FLb3LjYLXFMPf8R2S', 'EMPLOYEE');

-- Insert Employee Profiles
DO $$
DECLARE
    john_id UUID;
    jane_id UUID;
    bob_id UUID;
BEGIN
    SELECT id INTO john_id FROM users WHERE email = 'john.doe@dayflow.com';
    SELECT id INTO jane_id FROM users WHERE email = 'jane.smith@dayflow.com';
    SELECT id INTO bob_id FROM users WHERE email = 'bob.johnson@dayflow.com';
    
    INSERT INTO employee_profiles (user_id, first_name, last_name, phone, department, position, hire_date) VALUES
    (john_id, 'John', 'Doe', '5551234567', 'Engineering', 'Software Developer', '2024-01-15'),
    (jane_id, 'Jane', 'Smith', '5559876543', 'Marketing', 'Marketing Manager', '2024-02-01'),
    (bob_id, 'Bob', 'Johnson', '5555555555', 'Sales', 'Sales Representative', '2024-03-01');
    
    -- Insert Sample Attendance Records
    INSERT INTO attendance (user_id, date, check_in, check_out) VALUES
    (john_id, CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day') + TIME '09:00:00', (CURRENT_DATE - INTERVAL '1 day') + TIME '18:00:00'),
    (john_id, CURRENT_DATE - INTERVAL '2 days', (CURRENT_DATE - INTERVAL '2 days') + TIME '09:15:00', (CURRENT_DATE - INTERVAL '2 days') + TIME '17:45:00'),
    (jane_id, CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day') + TIME '08:45:00', (CURRENT_DATE - INTERVAL '1 day') + TIME '17:30:00'),
    (bob_id, CURRENT_DATE - INTERVAL '1 day', (CURRENT_DATE - INTERVAL '1 day') + TIME '09:30:00', (CURRENT_DATE - INTERVAL '1 day') + TIME '18:15:00');
    
    -- Insert Sample Leave Requests
    INSERT INTO leave_requests (user_id, start_date, end_date, reason, status) VALUES
    (john_id, CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '9 days', 'Vacation', 'PENDING'),
    (jane_id, CURRENT_DATE + INTERVAL '14 days', CURRENT_DATE + INTERVAL '16 days', 'Personal', 'APPROVED'),
    (bob_id, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '3 days', 'Sick Leave', 'APPROVED');
    
    -- Insert Sample Payroll Records
    INSERT INTO payroll (user_id, month, year, base_salary, deductions, net_salary) VALUES
    (john_id, EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER, EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER, 5000.00, 500.00, 4500.00),
    (jane_id, EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER, EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER, 6000.00, 600.00, 5400.00),
    (bob_id, EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER, EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER, 4500.00, 450.00, 4050.00);
    
    -- Previous month payroll
    INSERT INTO payroll (user_id, month, year, base_salary, deductions, net_salary) VALUES
    (john_id, EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')::INTEGER, EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month')::INTEGER, 5000.00, 500.00, 4500.00),
    (jane_id, EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')::INTEGER, EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month')::INTEGER, 6000.00, 600.00, 5400.00),
    (bob_id, EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '1 month')::INTEGER, EXTRACT(YEAR FROM CURRENT_DATE - INTERVAL '1 month')::INTEGER, 4500.00, 450.00, 4050.00);
END $$;

-- Display summary
SELECT 'Database seeded successfully!' AS message;
SELECT 'Admin credentials: admin@dayflow.com / password123' AS admin_login;
SELECT 'Employee credentials: john.doe@dayflow.com / password123' AS employee_login;
