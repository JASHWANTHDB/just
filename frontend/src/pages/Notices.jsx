import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Notices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    visibleTo: 'all'
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await api.get('/api/notices');
      setNotices(response.data.notices || []);
    } catch (err) {
      setError('Failed to fetch notices');
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
    if (!formData.title || !formData.body) {
      setError('Title and body are required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/notices', {
        title: formData.title,
        body: formData.body,
        visibleTo: formData.visibleTo
      });
      setSuccessMessage('Notice created successfully!');
      setFormData({ title: '', body: '', visibleTo: 'all' });
      setShowForm(false);
      await fetchNotices();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to create notice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📢 Notices & Announcements</h1>

      {error && <div style={styles.error}>{error}</div>}
      {successMessage && <div style={styles.success}>{successMessage}</div>}

      {user.role === 'admin' && (
        <div style={styles.card}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={styles.toggleButton}
          >
            {showForm ? '✕ Close' : '+ Create Notice'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter notice title"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Message</label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  placeholder="Enter notice message..."
                  required
                  style={styles.textarea}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Visible To</label>
                <select
                  name="visibleTo"
                  value={formData.visibleTo}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="all">All Users</option>
                  <option value="owners">Owners Only</option>
                  <option value="admin">Admin Only</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{...styles.submitButton, opacity: loading ? 0.6 : 1}}
              >
                {loading ? 'Creating...' : 'Create Notice'}
              </button>
            </form>
          )}
        </div>
      )}

      <div style={styles.card}>
        <h2 style={styles.subtitle}>Recent Notices</h2>

        {notices.length === 0 ? (
          <p style={styles.emptyText}>No notices available.</p>
        ) : (
          <div style={styles.noticesList}>
            {notices.map(notice => (
              <div key={notice._id} style={styles.noticeItem}>
                <div style={styles.noticeHeader}>
                  <h3 style={styles.noticeTitle}>{notice.title}</h3>
                  <span style={styles.noticeBadge}>
                    {notice.visibleTo === 'all' ? '👥 All' : notice.visibleTo === 'owners' ? '👤 Owners' : '🔐 Admin'}
                  </span>
                </div>
                <p style={styles.noticeBody}>{notice.body}</p>
                <p style={styles.noticeDate}>
                  📅 {new Date(notice.createdAt).toLocaleDateString()} at {new Date(notice.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  title: {
    marginBottom: '20px',
    color: '#2c3e50',
    fontSize: '28px'
  },
  subtitle: {
    fontSize: '18px',
    color: '#2c3e50',
    marginBottom: '15px'
  },
  error: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px'
  },
  success: {
    backgroundColor: '#27ae60',
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
  toggleButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  form: {
    backgroundColor: '#ecf0f1',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '15px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#2c3e50',
    fontSize: '14px'
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
    minHeight: '100px',
    fontFamily: 'Arial, sans-serif'
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  noticesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  noticeItem: {
    padding: '15px',
    borderLeft: '4px solid #3498db',
    backgroundColor: '#ecf0f1',
    borderRadius: '4px'
  },
  noticeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  noticeTitle: {
    color: '#2c3e50',
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold'
  },
  noticeBadge: {
    fontSize: '12px',
    backgroundColor: '#3498db',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    whiteSpace: 'nowrap'
  },
  noticeBody: {
    color: '#2c3e50',
    marginBottom: '8px',
    fontSize: '14px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap'
  },
  noticeDate: {
    fontSize: '12px',
    color: '#7f8c8d',
    margin: 0
  },
  emptyText: {
    color: '#7f8c8d',
    fontSize: '14px',
    textAlign: 'center',
    padding: '20px'
  }
};

export default Notices;
