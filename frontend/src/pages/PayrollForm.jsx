import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import { DollarSign, Save, X } from 'lucide-react';

const PayrollForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    user_id: '',
    month: '',
    year: new Date().getFullYear(),
    base_salary: '',
    deductions: '0',
    net_salary: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
    if (isEdit) {
      fetchPayrollEntry();
    }
  }, [id]);

  useEffect(() => {
    calculateNetSalary();
  }, [formData.base_salary, formData.deductions]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees');
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const fetchPayrollEntry = async () => {
    try {
      const response = await axios.get('/api/payroll');
      const entry = response.data.find(p => p.id === id);
      if (entry) {
        setFormData({
          user_id: entry.user_id,
          month: entry.month,
          year: entry.year,
          base_salary: entry.base_salary,
          deductions: entry.deductions,
          net_salary: entry.net_salary,
        });
      }
    } catch (err) {
      setError('Failed to load payroll entry');
      console.error(err);
    }
  };

  const calculateNetSalary = () => {
    const base = parseFloat(formData.base_salary) || 0;
    const deduct = parseFloat(formData.deductions) || 0;
    const net = base - deduct;
    setFormData(prev => ({ ...prev, net_salary: net.toFixed(2) }));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await axios.put(`/api/payroll/${id}`, formData);
      } else {
        await axios.post('/api/payroll', formData);
      }
      navigate('/admin/payroll');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to save payroll entry');
    } finally {
      setLoading(false);
    }
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <DollarSign className="w-8 h-8 text-purple-600" />
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Payroll Entry' : 'Add New Payroll Entry'}
        </h1>
      </div>

      <Card title={isEdit ? 'Update Payroll Information' : 'Payroll Information'} subtitle="Enter salary details for the employee">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Employee <span className="text-red-600">*</span>
            </label>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              required
              disabled={isEdit}
              className="form-input"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name} ({emp.email})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Month <span className="text-red-600">*</span>
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Select Month</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Year <span className="text-red-600">*</span>
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="form-input"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <FormInput
            label="Base Salary"
            type="number"
            name="base_salary"
            value={formData.base_salary}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />

          <FormInput
            label="Deductions"
            type="number"
            name="deductions"
            value={formData.deductions}
            onChange={handleChange}
            min="0"
            step="0.01"
          />

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Net Salary
            </label>
            <input
              type="number"
              name="net_salary"
              value={formData.net_salary}
              readOnly
              className="form-input font-semibold text-green-600"
              style={{ backgroundColor: '#f9fafb' }}
            />
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : isEdit ? 'Update Payroll' : 'Create Payroll'}
            </Button>
            <Button
              type="button"
              onClick={() => navigate('/admin/payroll')}
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PayrollForm;
