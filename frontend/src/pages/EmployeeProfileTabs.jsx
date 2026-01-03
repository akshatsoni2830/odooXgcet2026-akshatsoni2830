import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { User, Lock, FileText, DollarSign, Edit, ArrowLeft } from 'lucide-react';

const EmployeeProfileTabs = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resume');
  const isAdmin = user?.role === 'ADMIN';
  const isOwnProfile = user?.id === id;

  useEffect(() => {
    fetchEmployee();
    if (isAdmin) {
      fetchPayroll();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`/api/employees/${id}`);
      setEmployee(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayroll = async () => {
    try {
      const response = await axios.get('/api/payroll');
      const userPayroll = response.data.filter(p => p.user_id === id);
      setPayroll(userPayroll);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!employee) {
    return <div className="text-center py-12">Employee not found</div>;
  }

  const tabs = [
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'private', label: 'Private Info', icon: User },
    ...(isAdmin ? [{ id: 'salary', label: 'Salary Info', icon: DollarSign }] : []),
    { id: 'security', label: 'Security', icon: Lock }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/employees')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {employee.first_name} {employee.last_name}
          </h1>
        </div>
        {isAdmin && (
          <Button variant="primary" onClick={() => navigate(`/employees/edit/${id}`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'resume' && (
        <Card title="Resume">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-gray-900">{employee.first_name} {employee.last_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Login ID</label>
              <p className="text-gray-900">{employee.login_id || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{employee.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <p className="text-gray-900">{employee.mobile || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <p className="text-gray-900">{employee.department || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <p className="text-gray-900">{employee.position || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
              <p className="text-gray-900">{employee.manager || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <p className="text-gray-900">{employee.location || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
              <p className="text-gray-900">{employee.about || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
              <p className="text-gray-900">{employee.interests || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <p className="text-gray-900">{employee.skills || 'N/A'}</p>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
              <p className="text-gray-900">{employee.certifications || 'N/A'}</p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'private' && (
        <Card title="Private Information">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <p className="text-gray-900">{employee.phone || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <p className="text-gray-900">{employee.mobile || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <p className="text-gray-900">{employee.bank_name || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account</label>
              <p className="text-gray-900">{employee.bank_account || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
              <p className="text-gray-900">{employee.bank_ifsc || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN</label>
              <p className="text-gray-900">{employee.pan || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UAN</label>
              <p className="text-gray-900">{employee.uan || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee Code</label>
              <p className="text-gray-900">{employee.emp_code || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
              <p className="text-gray-900">{employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'salary' && isAdmin && (
        <Card title="Salary Information">
          {payroll.length === 0 ? (
            <p className="text-gray-500">No payroll data available</p>
          ) : (
            <div className="space-y-6">
              {payroll.map((p, idx) => (
                <div key={idx} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold text-lg mb-4">
                    {new Date(p.year, p.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Wage</label>
                      <p className="text-gray-900">₹{p.monthly_wage?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Wage</label>
                      <p className="text-gray-900">₹{p.yearly_wage?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Basic</label>
                      <p className="text-gray-900">₹{p.basic?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">HRA</label>
                      <p className="text-gray-900">₹{p.hra?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Standard Allowance</label>
                      <p className="text-gray-900">₹{p.standard_allowance?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Performance Bonus</label>
                      <p className="text-gray-900">₹{p.performance_bonus?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">LTA</label>
                      <p className="text-gray-900">₹{p.lta?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fixed Allowance</label>
                      <p className="text-gray-900">₹{p.fixed_allowance?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PF (Employee)</label>
                      <p className="text-gray-900">₹{p.pf_employee?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PF (Employer)</label>
                      <p className="text-gray-900">₹{p.pf_employer?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Professional Tax</label>
                      <p className="text-gray-900">₹{p.professional_tax?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Net Salary</label>
                      <p className="text-gray-900 font-semibold">₹{p.net_salary?.toLocaleString() || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'security' && (
        <Card title="Security">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{employee.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Login ID</label>
              <p className="text-gray-900">{employee.login_id || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <p className="text-gray-900">{employee.role}</p>
            </div>
            {isOwnProfile && (
              <div className="pt-4">
                <Button variant="outline" onClick={() => navigate('/change-password')}>
                  Change Password
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default EmployeeProfileTabs;
