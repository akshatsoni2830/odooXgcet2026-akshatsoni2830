import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const adminCards = [
    { title: 'Employees', description: 'Manage employee profiles', link: '/employees', icon: '👥' },
    { title: 'Attendance', description: 'View all attendance records', link: '/admin/attendance', icon: '📅' },
    { title: 'Leave Requests', description: 'Approve or reject leave', link: '/admin/leave', icon: '📝' },
    { title: 'Payroll', description: 'Manage employee payroll', link: '/admin/payroll', icon: '💰' },
  ];

  const employeeCards = [
    { title: 'My Profile', description: 'View and edit your profile', link: '/profile', icon: '👤' },
    { title: 'Attendance', description: 'Check-in/out and view history', link: '/attendance', icon: '📅' },
    { title: 'Leave', description: 'Apply for leave and view status', link: '/leave', icon: '📝' },
    { title: 'Payroll', description: 'View your salary details', link: '/payroll', icon: '💰' },
  ];

  const cards = user?.role === 'ADMIN' ? adminCards : employeeCards;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user?.email}
        </h1>
        <p className="text-gray-600 mb-8">
          Role: <span className="font-semibold">{user?.role}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Link
              key={card.link}
              to={card.link}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{card.icon}</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {card.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
