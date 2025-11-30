import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user.role === 'admin') {
      fetchUsers();
    }
  }, [user.role]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/users');
      setUsers(response.data.users || []);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  const ownerCount = users.filter(u => u.role === 'owner').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>User Management</h1>

      {error && <div style={styles.error}>{error}</div>}

      {/* Statistics */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Total Users</h3>
          <p style={styles.statValue}>{users.length}</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Property Owners</h3>
          <p style={styles.statValue}>{ownerCount}</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Administrators</h3>
          <p style={styles.statValue}>{adminCount}</p>
        </div>
      </div>

      {/* Search */}
      <div style={styles.card}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button onClick={fetchUsers} style={styles.refreshButton}>
            🔄 Refresh
          </button>
        </div>

        {/* Users List */}
        {loading ? (
          <p>Loading users...</p>
        ) : filteredUsers.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div style={styles.usersList}>
            {filteredUsers.map(u => (
              <div key={u._id} style={styles.userCard}>
                <div style={styles.userHeader}>
                  <div style={styles.userInfo}>
                    <h3 style={styles.userName}>{u.name}</h3>
                    <p style={styles.userEmail}>{u.email}</p>
                  </div>
                  <span style={{...styles.roleBadge, backgroundColor: u.role === 'admin' ? '#e74c3c' : '#27ae60'}}>
                    {u.role.toUpperCase()}
                  </span>
                </div>

                <div style={styles.userDetails}>
                  <div style={styles.detailRow}>
                    <span style={styles.label}>📞 Phone:</span>
                    <span>{u.phone}</span>
                  </div>
                  {u.apartmentNumber && (
                    <div style={styles.detailRow}>
                      <span style={styles.label}>🏠 Property:</span>
                      <span>{u.apartmentNumber}</span>
                    </div>
                  )}
                  <div style={styles.detailRow}>
                    <span style={styles.label}>📅 Registered:</span>
                    <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
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
    color: '#2c3e50'
  },
  error: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px',
    marginBottom: '20px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  statTitle: {
    marginBottom: '10px',
    fontSize: '14px',
    color: '#7f8c8d',
    margin: 0
  },
  statValue: {
    margin: 0,
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#27ae60'
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  searchContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  searchInput: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  refreshButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  usersList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '15px'
  },
  userCard: {
    border: '1px solid #ecf0f1',
    padding: '15px',
    borderRadius: '4px',
    backgroundColor: '#fafafa'
  },
  userHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    margin: 0,
    fontSize: '16px',
    color: '#2c3e50'
  },
  userEmail: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: '#7f8c8d'
  },
  roleBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    marginLeft: '10px'
  },
  userDetails: {
    fontSize: '13px',
    color: '#555'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  label: {
    fontWeight: '500',
    color: '#2c3e50'
  }
};

export default Users;
