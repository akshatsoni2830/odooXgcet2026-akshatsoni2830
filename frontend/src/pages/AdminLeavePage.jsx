import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const AdminLeavePage = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminComments, setAdminComments] = useState('');
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'

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
    setSelectedRequest(id);
    setActionType('approve');
    setAdminComments('');
    setShowCommentsModal(true);
  };

  const handleReject = async (id) => {
    setSelectedRequest(id);
    setActionType('reject');
    setAdminComments('');
    setShowCommentsModal(true);
  };

  const confirmAction = async () => {
    setError('');
    setMessage('');
    try {
      const endpoint = actionType === 'approve' 
        ? `/api/leave/${selectedRequest}/approve`
        : `/api/leave/${selectedRequest}/reject`;
      
      console.log('Sending request to:', endpoint);
      console.log('With data:', { admin_comments: adminComments });
      
      const response = await axios.put(endpoint, { admin_comments: adminComments });
      console.log('Response:', response.data);
      
      setMessage(`Leave request ${actionType}d successfully!`);
      setShowCommentsModal(false);
      setSelectedRequest(null);
      setAdminComments('');
      fetchLeaveRequests();
    } catch (err) {
      console.error('Error approving/rejecting leave:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.error?.message || `Failed to ${actionType} leave request`);
      setShowCommentsModal(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Leave Management</h1>

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

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Leave Requests</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending Only</option>
                <option value="all">All Requests</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
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
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          No leave requests found
                        </td>
                      </tr>
                    ) : (
                      leaveRequests.map((request) => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium">{request.first_name} {request.last_name}</div>
                              <div className="text-sm text-gray-500">{request.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{request.leave_type}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{formatDate(request.start_date)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{formatDate(request.end_date)}</td>
                          <td className="px-6 py-4">{request.reason || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {request.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleApprove(request.id)}
                                  className="text-green-600 hover:text-green-900 mr-4"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(request.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {request.status !== 'PENDING' && (
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
          </div>
        </div>

        {/* Comments Modal */}
        {showCommentsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                {actionType === 'approve' ? 'Approve' : 'Reject'} Leave Request
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={adminComments}
                  onChange={(e) => setAdminComments(e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add comments for the employee..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCommentsModal(false);
                    setSelectedRequest(null);
                    setAdminComments('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 rounded-md text-white ${
                    actionType === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminLeavePage;
