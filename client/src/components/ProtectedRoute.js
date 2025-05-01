import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

/**
 * ProtectedRoute component for handling route access control based on authentication and roles
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to render if access is granted
 * @param {string} [props.requiredRole] - Optional role required to access the route
 * @returns {React.ReactNode} The protected content or a redirect
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  // Show loading indicator while authentication state is being determined
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect to dashboard if role requirement not met
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  // User is authenticated and meets role requirements
  return children;
};

export default ProtectedRoute; 