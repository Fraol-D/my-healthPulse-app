import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * EmptyState component for displaying when there's no data
 * 
 * @param {Object} props - Component properties
 * @param {string} props.title - Main message to display
 * @param {string} [props.description] - Optional detailed description
 * @param {React.ReactNode} [props.icon] - Optional icon to display
 * @param {string} [props.buttonText] - Optional text for the action button
 * @param {Function} [props.buttonAction] - Optional function to call when button is clicked
 * @param {Object} [props.sx] - Optional SX prop for additional styling
 * @returns {React.ReactNode} The rendered EmptyState component
 */
const EmptyState = ({ 
  title, 
  description, 
  icon, 
  buttonText, 
  buttonAction,
  sx = {}
}) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: 2,
        backgroundColor: 'background.paper',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: 'divider',
        height: '100%',
        minHeight: 200,
        ...sx
      }}
    >
      {icon && (
        <Box 
          sx={{ 
            mb: 2, 
            color: 'text.secondary',
            '& svg': {
              fontSize: '4rem'
            }
          }}
        >
          {icon}
        </Box>
      )}
      
      <Typography 
        variant="h6" 
        component="h2" 
        color="text.primary"
        gutterBottom
      >
        {title}
      </Typography>
      
      {description && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ mb: buttonText ? 3 : 0, maxWidth: 500 }}
        >
          {description}
        </Typography>
      )}
      
      {buttonText && buttonAction && (
        <Button 
          variant="contained" 
          color="primary"
          onClick={buttonAction}
          sx={{ mt: 2 }}
        >
          {buttonText}
        </Button>
      )}
    </Paper>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.node,
  buttonText: PropTypes.string,
  buttonAction: PropTypes.func,
  sx: PropTypes.object,
};

export default EmptyState; 