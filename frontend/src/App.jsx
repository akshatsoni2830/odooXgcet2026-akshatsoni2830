import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeProfile from './pages/EmployeeProfile';
import AttendancePage from './pages/AttendancePage';
import LeavePage from './pages/LeavePage';
import AdminLeavePage from './pages/AdminLeavePage';
import PayrollPage from './pages/PayrollPage';
import AdminPayrollPage from './pages/AdminPayrollPage';
import PayrollForm from './pages/PayrollForm';

// Placeholder components (will be implemented in next steps)
const ComingSoon = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-600">Coming Soon</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Employee routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <EmployeeProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave"
            element={
              <ProtectedRoute>
                <LeavePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll"
            element={
              <ProtectedRoute>
                <PayrollPage />
              </ProtectedRoute>
            }
          />
          
          {/* Admin routes */}
          <Route
            path="/employees"
            element={
              <ProtectedRoute adminOnly>
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/new"
            element={
              <ProtectedRoute adminOnly>
                <EmployeeForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/edit/:id"
            element={
              <ProtectedRoute adminOnly>
                <EmployeeForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute adminOnly>
                <ComingSoon title="Admin Attendance" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leave"
            element={
              <ProtectedRoute adminOnly>
                <AdminLeavePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payroll"
            element={
              <ProtectedRoute adminOnly>
                <AdminPayrollPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payroll/new"
            element={
              <ProtectedRoute adminOnly>
                <PayrollForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payroll/edit/:id"
            element={
              <ProtectedRoute adminOnly>
                <PayrollForm />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
