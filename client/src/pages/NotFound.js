import React from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Paper 
} from '@mui/material';
import { 
  SentimentVeryDissatisfied as SadIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Container maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          mt: 8, 
          p: 5, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          borderRadius: 2
        }}
      >
        <SadIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h2" component="h1" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ maxWidth: 600, mb: 4 }}>
          Oops! The page you're looking for doesn't exist or may have been moved.
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to={isAuthenticated ? "/dashboard" : "/login"}
          startIcon={<HomeIcon />}
          size="large"
          sx={{ py: 1.5, px: 4 }}
        >
          {isAuthenticated ? "Back to Dashboard" : "Go to Login"}
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFound; 