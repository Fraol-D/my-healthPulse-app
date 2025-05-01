import React from 'react';
import { Box, Typography, Divider, useTheme as useMuiTheme } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * PageHeader component for consistent page headers across the application
 * 
 * @param {Object} props - Component properties
 * @param {string} props.title - Main title of the page
 * @param {string} [props.subtitle] - Optional subtitle or description
 * @param {React.ReactNode} [props.icon] - Optional icon to display next to the title
 * @param {React.ReactNode} [props.action] - Optional action component (like a button) to display on the right
 * @param {Object} [props.sx] - Optional SX prop for additional styling
 * @returns {React.ReactNode} The rendered PageHeader component
 */
const PageHeader = ({ title, subtitle, icon, action, sx }) => {
  const muiTheme = useMuiTheme();
  
  return (
    <Box sx={{ mb: 4, ...sx }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: subtitle ? 1 : 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon && (
            <Box sx={{ 
              mr: 1.5, 
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center'
            }}>
              {icon}
            </Box>
          )}
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 600,
              color: muiTheme.palette.mode === 'dark' ? 'primary.light' : 'primary.dark'
            }}
          >
            {title}
          </Typography>
        </Box>
        
        {action && (
          <Box>
            {action}
          </Box>
        )}
      </Box>
      
      {subtitle && (
        <Typography 
          variant="subtitle1" 
          color="text.secondary" 
          sx={{ mb: 2, ml: icon ? 5 : 0 }}
        >
          {subtitle}
        </Typography>
      )}
      
      <Divider sx={{ 
        borderColor: muiTheme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.12)' 
          : 'rgba(0, 0, 0, 0.12)'
      }} />
    </Box>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  action: PropTypes.node,
  sx: PropTypes.object,
};

export default PageHeader; 