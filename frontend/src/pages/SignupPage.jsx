import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormInput from '../components/ui/FormInput';
import Button from '../components/ui/Button';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    company_code: '',
    company_logo: '',
    admin_name: '',
    admin_email: '',
    admin_password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingCompany, setCheckingCompany] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    checkCompanyExists();
  }, []);

  const checkCompanyExists = async () => {
    try {
      const response = await axios.get('/api/company/exists');
      if (response.data.exists) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Company check error:', err);
    } finally {
      setCheckingCompany(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.admin_password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (formData.admin_password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/company/setup', {
        company_name: formData.company_name,
        company_code: formData.company_code,
        company_logo: formData.company_logo || null,
        admin_name: formData.admin_name,
        admin_email: formData.admin_email,
        admin_password: formData.admin_password
      });

      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingCompany) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full" style={{ maxWidth: '32rem' }}>
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center" style={{ margin: '0 auto' }}>
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Setup Dayflow HRMS
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              One-time company and admin setup
            </p>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Information</h3>
                <div className="space-y-3">
                  <FormInput
                    label="Company Name"
                    name="company_name"
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Enter company name"
                  />
                  
                  <FormInput
                    label="Company Code"
                    name="company_code"
                    type="text"
                    required
                    value={formData.company_code}
                    onChange={handleChange}
                    placeholder="e.g., OIJO"
                    maxLength={10}
                  />
                  
                  <FormInput
                    label="Company Logo URL (Optional)"
                    name="company_logo"
                    type="text"
                    value={formData.company_logo}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Admin Account</h3>
                <div className="space-y-3">
                  <FormInput
                    label="Admin Name"
                    name="admin_name"
                    type="text"
                    required
                    value={formData.admin_name}
                    onChange={handleChange}
                    placeholder="Enter admin full name"
                  />
                  
                  <FormInput
                    label="Admin Email"
                    name="admin_email"
                    type="email"
                    required
                    value={formData.admin_email}
                    onChange={handleChange}
                    placeholder="admin@company.com"
                  />
                  
                  <FormInput
                    label="Password"
                    name="admin_password"
                    type="password"
                    required
                    value={formData.admin_password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                  />
                  
                  <FormInput
                    label="Confirm Password"
                    name="confirm_password"
                    type="password"
                    required
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full btn-lg"
            >
              Complete Setup
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
