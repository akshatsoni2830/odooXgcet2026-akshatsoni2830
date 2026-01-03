import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';
import { UserPlus, Save, X } from 'lucide-react';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    department: '',
    position: '',
    hire_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`/api/employees/${id}`);
      const employee = response.data;
      setFormData({
        email: employee.email || '',
        password: '',
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        phone: employee.phone || '',
        department: employee.department || '',
        position: employee.position || '',
        hire_date: employee.hire_date || '',
      });
    } catch (err) {
      setError('Failed to load employee');
      console.error(err);
    }
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
        await axios.put(`/api/employees/${id}`, formData);
      } else {
        await axios.post('/api/employees', formData);
      }
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <UserPlus className="w-8 h-8 text-purple-600" />
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Edit Employee' : 'Add New Employee'}
        </h1>
      </div>

      <Card title={isEdit ? 'Update Employee Information' : 'Employee Information'} subtitle="Fill in the employee details">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Last Name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isEdit}
          />

          {!isEdit && (
            <FormInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEdit}
            />
          )}

          <FormInput
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Department"
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
            <FormInput
              label="Position"
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
            />
          </div>

          <FormInput
            label="Hire Date"
            type="date"
            name="hire_date"
            value={formData.hire_date}
            onChange={handleChange}
          />

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
              {loading ? 'Saving...' : isEdit ? 'Update Employee' : 'Create Employee'}
            </Button>
            <Button
              type="button"
              onClick={() => navigate('/employees')}
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

export default EmployeeForm;
