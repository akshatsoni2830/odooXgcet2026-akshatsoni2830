import { Link } from 'react-router-dom';
import { Users, Clock, Calendar, DollarSign, ArrowRight } from 'lucide-react';

const LandingPage = () => {
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
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Employee Management</h3>
            <p className="text-gray-600">
              Manage employee profiles, roles, and information efficiently
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Attendance Tracking</h3>
            <p className="text-gray-600">
              Track employee check-ins and check-outs with ease
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Leave Management</h3>
            <p className="text-gray-600">
              Handle leave requests and approvals seamlessly
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Payroll Management</h3>
            <p className="text-gray-600">
              Manage employee salaries and payroll records
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to transform your HR operations?
            </h2>
            <p className="text-gray-600 mb-8">
              Join organizations that trust Dayflow HRMS for their human resource management
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              Sign In Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
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
