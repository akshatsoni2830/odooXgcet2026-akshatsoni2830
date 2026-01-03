import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import { User, Clock, Calendar, DollarSign, CheckCircle, Users } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'ADMIN';
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    totalPayroll: 0
  });
  const [employeeData, setEmployeeData] = useState({
    todayAttendance: null,
    thisMonthAttendance: { present: 0, absent: 0, halfDay: 0 },
    pendingLeaves: 0,
    approvedLeaves: 0,
    lastPayroll: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        fetchAdminStats();
      } else {
        fetchEmployeeData();
      }
    }
  }, [user]);

  const fetchAdminStats = async () => {
    try {
      console.log('Fetching admin stats...');
      const [employeesRes, attendanceRes, leaveRes, payrollRes] = await Promise.all([
        axios.get('/api/employees').catch(err => { console.error('Employees error:', err); return { data: [] }; }),
        axios.get('/api/attendance/daily').catch(err => { console.error('Attendance error:', err); return { data: [] }; }),
        axios.get('/api/leave/pending').catch(err => { console.error('Leave error:', err); return { data: [] }; }),
        axios.get('/api/payroll').catch(err => { console.error('Payroll error:', err); return { data: [] }; })
      ]);

      console.log('Admin stats fetched:', {
        employees: employeesRes.data.length,
        attendance: attendanceRes.data.length,
        leaves: leaveRes.data.length,
        payroll: payrollRes.data.length
      });

      setStats({
        totalEmployees: employeesRes.data.length,
        presentToday: attendanceRes.data.filter(a => a.check_in_time).length,
        pendingLeaves: leaveRes.data.length,
        totalPayroll: payrollRes.data.reduce((sum, p) => sum + parseFloat(p.net_salary || 0), 0)
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      console.log('Fetching employee data...');
      const [attendanceRes, leaveRes, payrollRes] = await Promise.all([
        axios.get('/api/attendance/daily').catch(err => { console.error('Attendance error:', err); return { data: [] }; }),
        axios.get('/api/leave/my-requests').catch(err => { console.error('Leave error:', err); return { data: [] }; }),
        axios.get('/api/payroll/my-payroll').catch(err => { console.error('Payroll error:', err); return { data: [] }; })
      ]);

      console.log('Employee data fetched:', {
        attendance: attendanceRes.data.length,
        leaves: leaveRes.data.length,
        payroll: payrollRes.data.length
      });

      const todayAttendance = attendanceRes.data.find(a => 
        new Date(a.date).toDateString() === new Date().toDateString()
      );

      const thisMonth = new Date().getMonth();
      const monthAttendance = attendanceRes.data.filter(a => 
        new Date(a.date).getMonth() === thisMonth
      );

      setEmployeeData({
        todayAttendance: todayAttendance?.check_in_time ? 'Present' : 'Absent',
        thisMonthAttendance: {
          present: monthAttendance.filter(a => a.check_in_time && a.check_out_time).length,
          absent: 0,
          halfDay: 0
        },
        pendingLeaves: leaveRes.data.filter(l => l.status === 'PENDING').length,
        approvedLeaves: leaveRes.data.filter(l => l.status === 'APPROVED').length,
        lastPayroll: payrollRes.data[0] || null
      });
    } catch (error) {
      console.error('Failed to fetch employee data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        {error}
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome, {user?.name || user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-compact">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
              </div>
            </div>
          </div>

          <div className="card-compact">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Present Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.presentToday}</p>
              </div>
            </div>
          </div>

          <div className="card-compact">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Calendar className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Leaves</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingLeaves}</p>
              </div>
            </div>
          </div>

          <div className="card-compact">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Payroll</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalPayroll.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome back, {user?.name || user?.email}!
            </h1>
            <p className="text-gray-600">
              {user?.position || 'Employee'} • {user?.department || 'General'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-compact">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Today's Status</p>
              <StatusBadge status={employeeData.todayAttendance} type="attendance" />
            </div>
          </div>
        </div>

        <div className="card-compact">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {employeeData.thisMonthAttendance.present}
              </p>
              <p className="text-xs text-gray-500">Days Present</p>
            </div>
          </div>
        </div>

        <div className="card-compact">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Pending Leaves</p>
              <p className="text-2xl font-bold text-gray-900">
                {employeeData.pendingLeaves}
              </p>
            </div>
          </div>
        </div>

        <div className="card-compact">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Last Payroll</p>
              <p className="text-2xl font-bold text-gray-900">
                ${employeeData.lastPayroll?.net_salary || '0.00'}
              </p>
              <p className="text-xs text-gray-500">
                {employeeData.lastPayroll?.pay_date ? new Date(employeeData.lastPayroll.pay_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
