import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createAppTheme } from '../theme';

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Get theme preference from localStorage or default to light
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Create MUI theme based on current theme setting
  const muiTheme = createAppTheme(theme);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Effect to set theme on body and apply CSS variables
  useEffect(() => {
    document.body.dataset.theme = theme;
    
    // Apply CSS variables for colors to :root
    document.documentElement.style.setProperty('--primary-main', muiTheme.palette.primary.main);
    document.documentElement.style.setProperty('--primary-light', muiTheme.palette.primary.light);
    document.documentElement.style.setProperty('--primary-dark', muiTheme.palette.primary.dark);
    document.documentElement.style.setProperty('--background-light', muiTheme.palette.background.default);
    document.documentElement.style.setProperty('--background-dark', muiTheme.palette.background.default);
    document.documentElement.style.setProperty('--text-primary', muiTheme.palette.text.primary);
    document.documentElement.style.setProperty('--text-secondary', muiTheme.palette.text.secondary);
  }, [theme, muiTheme]);

  // Context value
  const contextValue = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={muiTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 