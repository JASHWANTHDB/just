import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Requests from './pages/Requests';
import Schedules from './pages/Schedules';
import Invoices from './pages/Invoices';
import Staff from './pages/Staff';
import Notices from './pages/Notices';
import Users from './pages/Users';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            {user?.role === 'admin' ? <AdminDashboard /> : <OwnerDashboard />}
          </PrivateRoute>
        }
      />

      <Route
        path="/requests"
        element={
          <PrivateRoute>
            <Requests />
          </PrivateRoute>
        }
      />

      <Route
        path="/schedules"
        element={
          <PrivateRoute>
            <Schedules />
          </PrivateRoute>
        }
      />

      <Route
        path="/invoices"
        element={
          <PrivateRoute>
            <Invoices />
          </PrivateRoute>
        }
      />

      <Route
        path="/staff"
        element={
          <PrivateRoute>
            <RoleRoute requiredRole="admin">
              <Staff />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/users"
        element={
          <PrivateRoute>
            <RoleRoute requiredRole="admin">
              <Users />
            </RoleRoute>
          </PrivateRoute>
        }
      />

      <Route
        path="/notices"
        element={
          <PrivateRoute>
            <Notices />
          </PrivateRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
