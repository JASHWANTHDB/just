import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Invoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ownerId: '',
    amount: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchInvoices();
    if (user.role === 'admin') {
      fetchOwners();
    }
  }, []);

  const fetchOwners = async () => {
    try {
      const response = await api.get('/api/users');
      const ownersList = (response.data.users || []).filter(u => u.role === 'owner');
      setOwners(ownersList);
    } catch (err) {
      console.error('Failed to fetch owners:', err);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/api/invoices');
      setInvoices(response.data.invoices || []);
    } catch (err) {
      setError('Failed to fetch invoices');
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
    if (!formData.ownerId || !formData.amount || !formData.dueDate) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/invoices', {
        ownerId: formData.ownerId,
        amount: parseFloat(formData.amount),
        dueDate: new Date(formData.dueDate)
      });
      setSuccessMessage('Invoice created successfully!');
      setFormData({ ownerId: '', amount: '', dueDate: '' });
      setShowForm(false);
      await fetchInvoices();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (invoiceId) => {
    try {
      const response = await api.post(`/api/invoices/${invoiceId}/pay`);
      setSuccessMessage(`Payment processed! Transaction ID: ${response.data.transactionId}`);
      await fetchInvoices();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError('Payment failed');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💰 Invoices</h1>

      {error && <div style={styles.error}>{error}</div>}
      {successMessage && <div style={styles.success}>{successMessage}</div>}

      {user.role === 'admin' && (
        <div style={styles.card}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={styles.toggleButton}
          >
            {showForm ? '✕ Close' : '+ Create Invoice'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Select Owner</label>
                <select
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">-- Choose an Owner --</option>
                  {owners.map(owner => (
                    <option key={owner._id} value={owner._id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  step="0.01"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{...styles.submitButton, opacity: loading ? 0.6 : 1}}
              >
                {loading ? 'Creating...' : 'Create Invoice'}
              </button>
            </form>
          )}
        </div>
      )}

      <div style={styles.card}>
        <h2 style={styles.subtitle}>
          {user.role === 'admin' ? 'All Invoices' : 'Your Invoices'}
        </h2>

        {invoices.length === 0 ? (
          <p style={styles.emptyText}>No invoices found.</p>
        ) : (
          <div style={styles.invoicesList}>
            {invoices.map(invoice => (
              <div key={invoice._id} style={styles.invoiceCard}>
                <div style={styles.invoiceHeader}>
                  <div>
                    <h3 style={styles.invoiceAmount}>₹{invoice.amount.toLocaleString()}</h3>
                    {user.role === 'admin' && invoice.ownerId && (
                      <p style={styles.ownerInfo}>Owner: {invoice.ownerId.name} ({invoice.ownerId.email})</p>
                    )}
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: invoice.paid ? '#27ae60' : '#e74c3c'
                  }}>
                    {invoice.paid ? '✓ Paid' : 'Pending'}
                  </span>
                </div>

                <div style={styles.invoiceDetails}>
                  <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                  {invoice.paymentTxId && <p><strong>Transaction ID:</strong> {invoice.paymentTxId}</p>}
                  <p><strong>Created:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
                </div>

                {!invoice.paid && user.role === 'owner' && (
                  <button
                    onClick={() => handlePayment(invoice._id)}
                    style={styles.payButton}
                  >
                    💳 Pay Now
                  </button>
                )}
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
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  invoicesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  invoiceCard: {
    border: '1px solid #ecf0f1',
    padding: '15px',
    borderRadius: '4px',
    backgroundColor: '#fafafa'
  },
  invoiceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  invoiceAmount: {
    margin: 0,
    fontSize: '20px',
    color: '#2c3e50',
    fontWeight: 'bold'
  },
  ownerInfo: {
    margin: '5px 0 0 0',
    fontSize: '12px',
    color: '#7f8c8d'
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  invoiceDetails: {
    fontSize: '13px',
    color: '#555',
    marginBottom: '12px'
  },
  payButton: {
    padding: '8px 16px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  emptyText: {
    color: '#7f8c8d',
    fontSize: '14px',
    textAlign: 'center',
    padding: '20px'
  }
};

export default Invoices;
