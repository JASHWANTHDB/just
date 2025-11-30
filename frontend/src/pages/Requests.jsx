import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Requests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    details: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const endpoint = user.role === 'admin' ? '/api/requests' : '/api/requests/my';
      const response = await api.get(endpoint);
      // Sort requests with newest first
      const sortedRequests = (response.data.requests || []).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setRequests(sortedRequests);
    } catch (err) {
      setError('Failed to fetch requests');
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
    setLoading(true);
    setError('');

    try {
      await api.post('/api/requests', formData);
      setFormData({ type: '', details: '', images: [] });
      await fetchRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    setActionLoading({ ...actionLoading, [requestId]: true });
    try {
      const response = await api.put(`/api/requests/${requestId}`, { status: 'approved' });
      console.log('Approve response:', response.data);
      await fetchRequests();
    } catch (err) {
      console.error('Approve error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to approve request');
    } finally {
      setActionLoading({ ...actionLoading, [requestId]: false });
    }
  };

  const handleReject = async (requestId) => {
    setActionLoading({ ...actionLoading, [requestId]: true });
    try {
      const response = await api.put(`/api/requests/${requestId}`, { status: 'rejected' });
      console.log('Reject response:', response.data);
      await fetchRequests();
    } catch (err) {
      console.error('Reject error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to reject request');
    } finally {
      setActionLoading({ ...actionLoading, [requestId]: false });
    }
  };

  const handleCancel = async (requestId) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      setActionLoading({ ...actionLoading, [requestId]: true });
      try {
        const response = await api.put(`/api/requests/${requestId}`, { status: 'cancelled' });
        console.log('Cancel response:', response.data);
        await fetchRequests();
      } catch (err) {
        console.error('Cancel error:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to cancel request');
      } finally {
        setActionLoading({ ...actionLoading, [requestId]: false });
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Service Requests</h1>

      {error && <div style={styles.error}>{error}</div>}

      {user.role === 'owner' && (
        <div style={styles.card}>
          <h2 style={styles.subtitle}>Create New Request</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Service Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="e.g., Plumbing, Electrical"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Details</label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                placeholder="Describe the issue..."
                required
                style={styles.textarea}
              />
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Creating...' : 'Create Request'}
            </button>
          </form>
        </div>
      )}

      <div style={styles.card}>
        <h2 style={styles.subtitle}>
          {user.role === 'admin' ? 'All Service Requests' : 'Your Requests'}
        </h2>
        {requests.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          <div style={styles.requestsList}>
            {requests.map(req => (
              <div key={req._id} style={styles.requestCard}>
                <div style={styles.requestHeader}>
                  <h3 style={styles.requestType}>{req.type}</h3>
                  <span style={{...styles.statusBadge, backgroundColor: getStatusColor(req.status)}}>
                    {req.status?.toUpperCase()}
                  </span>
                </div>
                
                <p style={styles.requestDetails}>{req.details}</p>
                
                <div style={styles.requestMeta}>
                  {req.ownerId && (
                    <div style={styles.ownerDetailsContainer}>
                      <div style={styles.ownerDetailRow}>
                        <strong>👤 Owner:</strong> {req.ownerId.name}
                      </div>
                      <div style={styles.ownerDetailRow}>
                        <strong>📧 Email:</strong> {req.ownerId.email}
                      </div>
                      <div style={styles.ownerDetailRow}>
                        <strong>📱 Phone:</strong> {req.ownerId.phone}
                      </div>
                      {req.ownerId.address && (
                        <div style={styles.ownerDetailRow}>
                          <strong>📍 Address:</strong> {req.ownerId.address}
                        </div>
                      )}
                      {req.ownerId.apartmentNumber && (
                        <div style={styles.ownerDetailRow}>
                          <strong>🏢 Apt/Unit:</strong> {req.ownerId.apartmentNumber}
                        </div>
                      )}
                    </div>
                  )}
                  <span style={styles.dateInfo}>📅 {new Date(req.createdAt).toLocaleDateString()}</span>
                </div>

                {user.role === 'admin' && (
                  <div style={styles.actionButtons}>
                    <button
                      onClick={() => handleApprove(req._id)}
                      disabled={actionLoading[req._id] || req.status === 'approved' || req.status === 'rejected' || req.status === 'cancelled'}
                      style={{...styles.approveButton, opacity: actionLoading[req._id] || req.status === 'approved' || req.status === 'rejected' || req.status === 'cancelled' ? 0.6 : 1}}
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      disabled={actionLoading[req._id] || req.status === 'approved' || req.status === 'rejected' || req.status === 'cancelled'}
                      style={{...styles.rejectButton, opacity: actionLoading[req._id] || req.status === 'approved' || req.status === 'rejected' || req.status === 'cancelled' ? 0.6 : 1}}
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}

                {user.role === 'owner' && (
                  <div style={styles.actionButtons}>
                    <button
                      onClick={() => handleCancel(req._id)}
                      disabled={actionLoading[req._id] || req.status === 'cancelled' || req.status === 'completed' || req.status === 'rejected'}
                      style={{...styles.cancelButton, opacity: actionLoading[req._id] || req.status === 'cancelled' || req.status === 'completed' || req.status === 'rejected' ? 0.6 : 1}}
                    >
                      🗑️ Cancel Request
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    pending: '#f39c12',
    open: '#f39c12',
    approved: '#27ae60',
    rejected: '#e74c3c',
    cancelled: '#95a5a6',
    completed: '#2c3e50',
    assigned: '#3498db'
  };
  return colors[status] || '#95a5a6';
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  title: {
    marginBottom: '20px',
    color: '#2c3e50'
  },
  subtitle: {
    marginBottom: '15px',
    fontSize: '18px',
    color: '#2c3e50'
  },
  error: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  form: {
    marginBottom: '20px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#2c3e50'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    minHeight: '100px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  requestsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  requestCard: {
    border: '1px solid #ecf0f1',
    padding: '15px',
    borderRadius: '4px',
    backgroundColor: '#fafafa'
  },
  requestHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  requestType: {
    margin: 0,
    fontSize: '16px',
    color: '#2c3e50'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  requestDetails: {
    margin: '10px 0',
    color: '#555',
    lineHeight: '1.5'
  },
  requestMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '13px',
    color: '#7f8c8d',
    marginBottom: '12px'
  },
  ownerDetailsContainer: {
    backgroundColor: '#ecf0f1',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '8px'
  },
  ownerDetailRow: {
    fontSize: '13px',
    color: '#2c3e50',
    padding: '4px 0',
    lineHeight: '1.4'
  },
  dateInfo: {
    fontSize: '12px',
    color: '#95a5a6',
    marginTop: '4px'
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px'
  },
  approveButton: {
    padding: '8px 16px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  rejectButton: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#e67e22',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  }
};

export default Requests;

