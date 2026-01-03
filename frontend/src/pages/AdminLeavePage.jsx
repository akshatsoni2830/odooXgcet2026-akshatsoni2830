import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { CheckCircle, XCircle, Calendar } from 'lucide-react';

const AdminLeavePage = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLeaveRequests();
  }, [filter]);

  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const endpoint = filter === 'pending' ? '/api/leave/pending' : '/api/leave/all';
      const response = await axios.get(endpoint);
      setLeaveRequests(response.data);
    } catch (err) {
      setError('Failed to load leave requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setError('');
    setMessage('');
    try {
      await axios.put(`/api/leave/${id}/approve`);
      setMessage('Leave request approved successfully!');
      fetchLeaveRequests();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to approve leave request');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this leave request?')) {
      return;
    }

    setError('');
    setMessage('');
    try {
      await axios.put(`/api/leave/${id}/reject`);
      setMessage('Leave request rejected successfully!');
      fetchLeaveRequests();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to reject leave request');
    }
  };



  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Calendar className="w-8 h-8 text-purple-600" />
        <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
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

      <Card 
        title="Leave Requests" 
        subtitle="Review and manage employee leave applications"
        action={
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-input"
            style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}
          >
            <option value="pending">Pending Only</option>
            <option value="all">All Requests</option>
          </select>
        }
      >
        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No leave requests found
                    </td>
                  </tr>
                ) : (
                  leaveRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{request.first_name} {request.last_name}</div>
                          <div className="text-sm text-gray-500">{request.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{formatDate(request.start_date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">{formatDate(request.end_date)}</td>
                      <td className="px-6 py-4 text-gray-700">{request.reason || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={request.status} type="leave" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {request.status === 'PENDING' ? (
                          <div className="flex justify-end space-x-2">
                            <Button
                              onClick={() => handleApprove(request.id)}
                              variant="primary"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(request.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-gray-400">No actions</span>
                        )}
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

export default AdminLeavePage;
