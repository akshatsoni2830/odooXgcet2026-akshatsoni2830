import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  DollarSign,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isAdmin = () => {
    return user?.role === 'ADMIN' || user?.role === 'admin';
  };

  const employeeMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Clock, label: 'Attendance', path: '/attendance' },
    { icon: Calendar, label: 'Leave', path: '/leave' },
    { icon: DollarSign, label: 'Payroll', path: '/payroll' },
  ];

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Employees', path: '/employees' },
    { icon: Clock, label: 'Attendance', path: '/attendance' },
    { icon: Calendar, label: 'Leave Approvals', path: '/leave/admin' },
    { icon: DollarSign, label: 'Payroll', path: '/payroll/admin' },
  ];

  const menuItems = isAdmin() ? adminMenuItems : employeeMenuItems;

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`sidebar flex ${isCollapsed ? 'collapsed' : 'expanded'}`}>
      {/* Header */}
      <div className="p-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Dayflow</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4" style={{ borderBottom: '1px solid #e5e7eb' }}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1" style={{ minWidth: 0 }}>
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name || user?.email}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role === 'ADMIN' || user?.role === 'admin' ? 'Administrator' : 'Employee'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-nav-item ${isCollapsed ? 'collapsed' : 'expanded'} ${active ? 'active' : ''}`}
                  title={isCollapsed ? item.label : ''}
                  style={{ textDecoration: 'none' }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="nav-text">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-3" style={{ borderTop: '1px solid #e5e7eb' }}>
        <button
          onClick={handleLogout}
          className={`sidebar-nav-item logout-btn ${isCollapsed ? 'collapsed' : 'expanded'} w-full`}
          title={isCollapsed ? 'Logout' : ''}
          style={{ 
            border: 'none', 
            background: 'transparent', 
            cursor: 'pointer',
            color: '#dc2626'
          }}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="nav-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
