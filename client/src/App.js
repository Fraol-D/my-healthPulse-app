import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import HealthData from './pages/HealthData';
import Predictions from './pages/Predictions';
import Reports from './pages/Reports';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  const { theme } = useTheme();
  
  return (
    <Box sx={{ 
      backgroundColor: theme === 'dark' ? 'var(--background-dark)' : 'var(--background-light)',
      color: theme === 'dark' ? 'white' : 'var(--text-primary)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <CssBaseline />
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, py: 3, px: { xs: 2, md: 4 } }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/health-data" element={
            <ProtectedRoute>
              <HealthData />
            </ProtectedRoute>
          } />
          
          <Route path="/predictions" element={
            <ProtectedRoute>
              <Predictions />
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App; 