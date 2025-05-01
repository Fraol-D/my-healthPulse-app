import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Divider,
  Alert
} from '@mui/material';
import { 
  Timeline, 
  TrendingUp, 
  LocalHospital, 
  Assessment,
  Favorite,
  DirectionsRun,
  RestaurantMenu,
  Opacity
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Dashboard statistic card component
const StatCard = ({ title, value, icon, description, loading, color }) => (
  <Card 
    sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 4
      }
    }}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h6" component="div" color="text.secondary">
          {title}
        </Typography>
        <Box sx={{ 
          backgroundColor: `${color}.100`, 
          color: `${color}.main`, 
          borderRadius: '50%', 
          p: 1,
          display: 'flex'
        }}>
          {icon}
        </Box>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </>
      )}
    </CardContent>
  </Card>
);

// Health tip component
const HealthTip = ({ tip }) => (
  <Box sx={{ p: 2, mb: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
    <Typography variant="body1">{tip}</Typography>
  </Box>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const healthTips = [
    "Stay hydrated! Aim to drink at least 8 glasses of water daily.",
    "Try to get 7-9 hours of sleep each night for optimal health.",
    "Regular physical activity can reduce your risk of chronic diseases.",
    "Include a variety of fruits and vegetables in your daily diet.",
    "Take short breaks during work to reduce stress and improve focus."
  ];
  
  // Fetch user's health data and predictions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch latest health data
        const healthResponse = await axios.get('/api/health/latest');
        setHealthData(healthResponse.data);
        
        // Fetch latest predictions
        const predictionsResponse = await axios.get('/api/predictions/latest');
        setPredictions(predictionsResponse.data);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Get a random health tip
  const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column',
              background: 'linear-gradient(45deg, #3f51b5 30%, #1a237e 90%)',
              color: 'white',
              borderRadius: 2
            }}
          >
            <Typography component="h1" variant="h4" sx={{ mb: 1 }}>
              Welcome, {user?.name || 'User'}!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Track your health metrics, get personalized insights, and stay on top of your well-being.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="secondary" 
                component={Link} 
                to="/health-data"
                startIcon={<Timeline />}
              >
                Update Health Data
              </Button>
              <Button 
                variant="outlined"
                component={Link} 
                to="/predictions"
                startIcon={<Assessment />}
                sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'white' }}
              >
                View Predictions
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Error Alert */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Grid>
        )}
        
        {/* Health Metrics */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Latest Health Metrics
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Heart Rate" 
            value={healthData ? `${healthData.heartRate} bpm` : 'N/A'} 
            icon={<Favorite />} 
            description="Your latest recorded heart rate"
            loading={loading}
            color="error"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Blood Pressure" 
            value={healthData ? `${healthData.systolic}/${healthData.diastolic}` : 'N/A'}
            icon={<LocalHospital />} 
            description="Systolic/Diastolic (mmHg)"
            loading={loading}
            color="info"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Blood Sugar" 
            value={healthData ? `${healthData.bloodSugar} mg/dL` : 'N/A'} 
            icon={<Opacity />} 
            description="Latest blood glucose level"
            loading={loading}
            color="warning"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="BMI" 
            value={healthData ? healthData.bmi.toFixed(1) : 'N/A'} 
            icon={<DirectionsRun />} 
            description={healthData ? `Based on your weight: ${healthData.weight}kg` : 'Body Mass Index'}
            loading={loading}
            color="success"
          />
        </Grid>
        
        {/* Risk Assessment */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Health Risk Assessment
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : predictions ? (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" paragraph>
                    Based on your health data, our predictive model has analyzed your risk factors:
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Diabetes Risk:
                        </Typography>
                        <Typography variant="body1">
                          {predictions.diabetesRisk ? 
                            `${(predictions.diabetesRisk * 100).toFixed(1)}% risk level` : 
                            'Insufficient data'}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'error.main' }}>
                          <Favorite sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Heart Disease Risk:
                        </Typography>
                        <Typography variant="body1">
                          {predictions.heartDiseaseRisk ? 
                            `${(predictions.heartDiseaseRisk * 100).toFixed(1)}% risk level` : 
                            'Insufficient data'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Recommendations:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {predictions.recommendations || 
                      'Continue monitoring your health metrics regularly for personalized recommendations.'}
                  </Typography>
                  
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    component={Link} 
                    to="/predictions"
                    endIcon={<TrendingUp />}
                  >
                    View Detailed Analysis
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="body1">
                No prediction data available. Please update your health metrics to get personalized risk assessments.
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Health Tips */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Health Tips
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              Daily tip for better health:
            </Typography>
            
            <HealthTip tip={randomTip} />
            
            <Typography variant="body2" sx={{ mt: 4, mb: 2 }}>
              Remember to check in daily to track your health metrics for the most accurate predictions.
            </Typography>
            
            <Button 
              fullWidth 
              variant="contained"
              color="secondary"
              component={Link}
              to="/health-data"
              startIcon={<RestaurantMenu />}
            >
              Log Today's Health Data
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 