import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          GREENVISTA 
        </Link>
        
        <div style={styles.links}>
          {user ? (
            <>
              <span style={styles.userInfo}>
                {user.name} ({user.role})
              </span>
              {user.role === 'owner' && (
                <>
                  <Link to="/requests" style={styles.link}>Requests</Link>
                  <Link to="/invoices" style={styles.link}>Invoices</Link>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <Link to="/users" style={styles.link}>Users</Link>
                  <Link to="/requests" style={styles.link}>Requests</Link>
                  <Link to="/staff" style={styles.link}>Staff</Link>
                  <Link to="/invoices" style={styles.link}>Invoices</Link>
                </>
              )}
              <Link to="/notices" style={styles.link}>Notices</Link>
              <button onClick={handleLogout} style={styles.button}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '10px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  brand: {
    fontSize: '20px',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: 'white'
  },
  links: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px'
  },
  userInfo: {
    fontSize: '12px',
    opacity: 0.8
  },
  button: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default Navbar;
