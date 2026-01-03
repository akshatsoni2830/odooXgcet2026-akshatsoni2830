import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import FormInput from '../components/ui/FormInput';
import Button from '../components/ui/Button';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.new_password !== formData.confirm_password) {
      setError('New passwords do not match');
      return;
    }

    if (formData.new_password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/auth/change-password', {
        current_password: formData.current_password,
        new_password: formData.new_password
      });

      alert('Password changed successfully. Please login again.');
      logout();
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full" style={{ maxWidth: '28rem' }}>
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Change Password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You must change your password before continuing
            </p>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormInput
                label="Current Password"
                name="current_password"
                type="password"
                required
                value={formData.current_password}
                onChange={handleChange}
                placeholder="Enter current password"
              />
              
              <FormInput
                label="New Password"
                name="new_password"
                type="password"
                required
                value={formData.new_password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
              />
              
              <FormInput
                label="Confirm New Password"
                name="confirm_password"
                type="password"
                required
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Re-enter new password"
              />
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
              Change Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
