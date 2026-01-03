import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, Clock, Calendar, DollarSign, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const [companyExists, setCompanyExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkCompany();
  }, []);

  const checkCompany = async () => {
    try {
      const response = await axios.get('/api/company/exists');
      setCompanyExists(response.data.exists);
    } catch (err) {
      console.error('Company check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    if (companyExists) {
      navigate('/login');
    } else {
      navigate('/signup');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-purple-600">Dayflow HRMS</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Streamline your HR operations with our comprehensive management system
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
          >
            {companyExists ? 'Sign In' : 'Get Started'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Powerful Features for Modern HR Management
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Employee Management</h3>
            <p className="text-gray-600">
              Manage employee profiles, track information, and maintain comprehensive records
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Attendance Tracking</h3>
            <p className="text-gray-600">
              Track daily check-ins and check-outs with detailed attendance reports
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Leave Management</h3>
            <p className="text-gray-600">
              Streamline leave requests and approvals with automated workflows
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Payroll Management</h3>
            <p className="text-gray-600">
              Manage salary information and payroll records efficiently
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your HR Operations?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Join organizations that trust Dayflow HRMS for their HR management needs
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
          >
            {companyExists ? 'Sign In Now' : 'Start Your Journey'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Dayflow HRMS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
