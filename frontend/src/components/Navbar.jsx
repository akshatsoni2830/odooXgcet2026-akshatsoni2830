import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold">
              Dayflow HRMS
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded">
                Dashboard
              </Link>
              
              {user?.role === 'ADMIN' && (
                <>
                  <Link to="/employees" className="hover:bg-blue-700 px-3 py-2 rounded">
                    Employees
                  </Link>
                  <Link to="/admin/attendance" className="hover:bg-blue-700 px-3 py-2 rounded">
                    Attendance
                  </Link>
                  <Link to="/admin/leave" className="hover:bg-blue-700 px-3 py-2 rounded">
                    Leave Requests
                  </Link>
                  <Link to="/admin/payroll" className="hover:bg-blue-700 px-3 py-2 rounded">
                    Payroll
                  </Link>
                </>
              )}
              
              {user?.role === 'EMPLOYEE' && (
                <>
                  <Link to="/profile" className="hover:bg-blue-700 px-3 py-2 rounded">
                    My Profile
                  </Link>
                  <Link to="/attendance" className="hover:bg-blue-700 px-3 py-2 rounded">
                    Attendance
                  </Link>
                  <Link to="/leave" className="hover:bg-blue-700 px-3 py-2 rounded">
                    Leave
                  </Link>
                  <Link to="/payroll" className="hover:bg-blue-700 px-3 py-2 rounded">
                    Payroll
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm">
              {user?.email} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
