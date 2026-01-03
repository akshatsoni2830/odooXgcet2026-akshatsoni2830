import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { Clock, Calendar } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Clock className="w-8 h-8 text-purple-600" />
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
      </div>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Check-in/Check-out Section */}
      <Card title="Today's Attendance" subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Check-in Time</p>
              <p className="text-lg font-semibold text-gray-900">
                {todayAttendance?.check_in ? formatTime(todayAttendance.check_in) : 'Not checked in'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Check-out Time</p>
              <p className="text-lg font-semibold text-gray-900">
                {todayAttendance?.check_out ? formatTime(todayAttendance.check_out) : 'Not checked out'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={handleCheckIn}
            disabled={todayAttendance?.check_in}
            variant="primary"
            className="flex-1"
          >
            Check In
          </Button>
          <Button
            onClick={handleCheckOut}
            disabled={!todayAttendance?.check_in || todayAttendance?.check_out}
            variant="secondary"
            className="flex-1"
          >
            Check Out
          </Button>
        </div>
      </Card>

      {/* Attendance History */}
      <Card 
        title="Attendance History" 
        subtitle="View your attendance records"
        action={
          <div className="flex space-x-3">
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setView('daily')}
                className={`px-3 py-1.5 text-sm ${view === 'daily' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Daily
              </button>
              <button
                onClick={() => setView('weekly')}
                className={`px-3 py-1.5 text-sm ${view === 'weekly' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Weekly
              </button>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-input"
              style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}
            />
          </div>
        }
      >
        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading...</div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{formatDate(record.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatTime(record.check_in)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatTime(record.check_out)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          status={record.check_out ? 'Present' : 'In Progress'} 
                          type="attendance" 
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AttendancePage;
