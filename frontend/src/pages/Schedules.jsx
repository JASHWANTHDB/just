import React, { useState, useEffect } from 'react';
import api from '../api/api';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/api/schedules');
      setSchedules(response.data.schedules);
    } catch (err) {
      setError('Failed to fetch schedules');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Schedules</h1>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.card}>
        {schedules.length === 0 ? (
          <p>No schedules found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Service Type</th>
                <th>Staff</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map(schedule => (
                <tr key={schedule._id}>
                  <td>{new Date(schedule.date).toLocaleDateString()}</td>
                  <td>{schedule.serviceType}</td>
                  <td>{schedule.staffId?.name || 'Unassigned'}</td>
                  <td>{schedule.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  }
};

export default Schedules;
