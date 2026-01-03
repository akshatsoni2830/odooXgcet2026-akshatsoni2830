import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [view, setView] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTodayAttendance();
    fetchAttendance();
  }, [view, selectedDate]);

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get(`/api/attendance/daily?date=${today}`);
      setTodayAttendance(response.data[0] || null);
    } catch (err) {
      console.error('Failed to fetch today attendance:', err);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      let response;
      if (view === 'daily') {
        response = await axios.get(`/api/attendance/daily?date=${selectedDate}`);
      } else {
        response = await axios.get(`/api/attendance/weekly?startDate=${selectedDate}`);
      }
      setAttendance(response.data);
    } catch (err) {
      setError('Failed to load attendance');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setError('');
    setMessage('');
    try {
      await axios.post('/api/attendance/checkin');
      setMessage('Checked in successfully!');
      fetchTodayAttendance();
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    setError('');
    setMessage('');
    try {
      await axios.post('/api/attendance/checkout');
      setMessage('Checked out successfully!');
      fetchTodayAttendance();
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to check out');
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Attendance</h1>

        {/* Check-in/Check-out Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Today's Attendance</h2>
          
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <p className="text-sm text-gray-600">Check-in Time</p>
              <p className="text-lg font-semibold">
                {todayAttendance?.check_in ? formatTime(todayAttendance.check_in) : 'Not checked in'}
              </p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Check-out Time</p>
              <p className="text-lg font-semibold">
                {todayAttendance?.check_out ? formatTime(todayAttendance.check_out) : 'Not checked out'}
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleCheckIn}
              disabled={todayAttendance?.check_in}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Check In
            </button>
            <button
              onClick={handleCheckOut}
              disabled={!todayAttendance?.check_in || todayAttendance?.check_out}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Check Out
            </button>
          </div>
        </div>

        {/* Attendance History */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Attendance History</h2>
            <div className="flex space-x-4">
              <select
                value={view}
                onChange={(e) => setView(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-out</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No attendance records found
                      </td>
                    </tr>
                  ) : (
                    attendance.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(record.date)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatTime(record.check_in)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatTime(record.check_out)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded ${
                            record.check_out 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.check_out ? 'Complete' : 'In Progress'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AttendancePage;
