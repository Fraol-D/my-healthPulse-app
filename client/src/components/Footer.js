import React from 'react';
import { Box, Typography, Container, Link, Divider } from '@mui/material';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5',
        borderTop: `1px solid ${theme === 'dark' ? '#333' : '#ddd'}`
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              HealthPulse
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Predictive Health Monitoring System
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/dashboard" color="text.secondary" display="block" variant="body2">
              Dashboard
            </Link>
            <Link href="/health-data" color="text.secondary" display="block" variant="body2">
              Health Data
            </Link>
            <Link href="/predictions" color="text.secondary" display="block" variant="body2">
              Predictions
            </Link>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Resources
            </Typography>
            <Link href="#" color="text.secondary" display="block" variant="body2">
              Help Center
            </Link>
            <Link href="#" color="text.secondary" display="block" variant="body2">
              Privacy Policy
            </Link>
            <Link href="#" color="text.secondary" display="block" variant="body2">
              Terms of Service
            </Link>
          </Box>
        </Box>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {'© '}
            {currentYear}
            {' HealthPulse. All rights reserved.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;