import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (via token in localStorage)
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Verify token & get user data
        const res = await authAPI.validateToken();
        
        if (res.data) {
          setUser(res.data);
          setIsAuthenticated(true);
        }
      } catch (err) {
        localStorage.removeItem('token');
        console.error('Auth error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const res = await authAPI.login(credentials);
      
      const { token, user } = res.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      setUser(user);
      setIsAuthenticated(true);
      
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
      return false;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const res = await authAPI.register(userData);
      
      const { token, user } = res.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      setUser(user);
      setIsAuthenticated(true);
      
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Registration failed. Please try again.'
      );
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const res = await authAPI.updateProfile(userData);
      setUser(res.data);
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Profile update failed. Please try again.'
      );
      return false;
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      setError(null);
      await authAPI.changePassword(passwordData);
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Password change failed. Please try again.'
      );
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 