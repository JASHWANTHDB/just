import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p>Welcome, {user?.name}!</p>
        
        <div style={styles.info}>
          <p>Use the navigation menu to manage users, service requests, staff, and invoices.</p>
        </div>
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
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  title: {
    marginBottom: '20px',
    color: '#2c3e50'
  },
  info: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#ecf0f1',
    borderRadius: '4px',
    color: '#2c3e50'
  }
};

export default AdminDashboard;
