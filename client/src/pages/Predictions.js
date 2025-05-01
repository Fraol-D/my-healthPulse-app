import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Tooltip
} from '@mui/material';
import { 
  WarningAmber as WarningIcon,
  Favorite as HeartIcon,
  MonitorHeart as DiabetesIcon,
  Insights as InsightsIcon,
  Lightbulb as LightbulbIcon,
  Timeline as TimelineIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// Risk Level component
const RiskLevel = ({ title, value, icon, color, description }) => {
  // Convert value from 0-1 to percentage
  const percentage = value * 100;
  let riskText = '';
  let chipColor = '';
  
  if (percentage < 20) {
    riskText = 'Low Risk';
    chipColor = 'success';
  } else if (percentage < 40) {
    riskText = 'Moderate Risk';
    chipColor = 'info';
  } else if (percentage < 60) {
    riskText = 'Medium Risk';
    chipColor = 'warning';
  } else if (percentage < 80) {
    riskText = 'High Risk';
    chipColor = 'error';
  } else {
    riskText = 'Very High Risk';
    chipColor = 'error';
  }
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        borderLeft: `5px solid ${color}`,
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div" color={color}>
            {title}
          </Typography>
          {icon}
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            {percentage.toFixed(1)}%
          </Typography>
          <Chip 
            label={riskText} 
            color={chipColor} 
            size="small" 
            sx={{ fontWeight: 'bold', mb: 1 }}
          />
          <LinearProgress 
            variant="determinate" 
            value={percentage} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              backgroundColor: 'grey.300',
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
                borderRadius: 5
              }
            }} 
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Predictions = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState({
    diabetesRisk: [],
    heartDiseaseRisk: []
  });
  
  // Fetch prediction data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get latest prediction
        const predictionsResponse = await axios.get('/api/predictions/latest');
        setPredictions(predictionsResponse.data);
        
        // Get historical prediction data for charts
        const historyResponse = await axios.get('/api/predictions/history');
        
        const diabetesData = [];
        const heartData = [];
        
        historyResponse.data.forEach(record => {
          if (record.diabetesRisk) {
            diabetesData.push({
              x: new Date(record.date),
              y: record.diabetesRisk
            });
          }
          
          if (record.heartDiseaseRisk) {
            heartData.push({
              x: new Date(record.date),
              y: record.heartDiseaseRisk
            });
          }
        });
        
        setHistoricalData({
          diabetesRisk: diabetesData.sort((a, b) => a.x - b.x),
          heartDiseaseRisk: heartData.sort((a, b) => a.x - b.x)
        });
        
      } catch (err) {
        console.error('Error fetching prediction data:', err);
        setError('Failed to load prediction data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Prepare chart data
  const prepareChartData = (dataset, title, color) => {
    const dates = dataset.map(item => {
      const date = new Date(item.x);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().substr(2, 2)}`;
    });
    
    const values = dataset.map(item => (item.y * 100).toFixed(1));
    
    return {
      labels: dates,
      datasets: [
        {
          label: title,
          data: values,
          borderColor: color,
          backgroundColor: `${color}33`, // Add transparency
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: color
        }
      ]
    };
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Risk: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Risk Level (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };
  
  // Risk factors for diabetes
  const diabetesRiskFactors = [
    'High blood sugar levels',
    'Overweight or obesity',
    'Physical inactivity',
    'Family history of diabetes',
    'Age (45 or older)',
    'Poor dietary habits'
  ];
  
  // Risk factors for heart disease
  const heartRiskFactors = [
    'High blood pressure',
    'High cholesterol',
    'Smoking',
    'Physical inactivity',
    'Overweight or obesity',
    'Family history of heart disease'
  ];
  
  // No predictions message
  const NoPredictionsMessage = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Assessment sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        No Prediction Data Available
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        We need more health data to generate accurate predictions.
      </Typography>
      <Button 
        variant="contained" 
        component={Link} 
        to="/health-data"
        size="large"
        sx={{ mt: 2 }}
      >
        Add Health Data
      </Button>
    </Box>
  );
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Health Predictions
        </Typography>
        <Typography variant="body1" paragraph>
          Based on your health data, our AI model has analyzed your risk factors and generated the following predictions.
        </Typography>
        
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress size={60} />
          </Box>
        ) : !predictions ? (
          <NoPredictionsMessage />
        ) : (
          <>
            {/* Risk Assessment */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <RiskLevel 
                  title="Diabetes Risk" 
                  value={predictions.diabetesRisk || 0}
                  icon={<DiabetesIcon sx={{ color: '#3f51b5', fontSize: 40 }} />}
                  color="#3f51b5"
                  description="Probability of developing type 2 diabetes based on your health metrics."
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <RiskLevel 
                  title="Heart Disease Risk" 
                  value={predictions.heartDiseaseRisk || 0}
                  icon={<HeartIcon sx={{ color: '#f44336', fontSize: 40 }} />}
                  color="#f44336"
                  description="Probability of developing cardiovascular disease based on your health metrics."
                />
              </Grid>
            </Grid>
            
            {/* Recommendations */}
            <Paper 
              elevation={1} 
              sx={{ 
                p: 3, 
                mb: 4, 
                borderRadius: 2,
                backgroundColor: 'primary.light',
                color: 'white'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LightbulbIcon sx={{ fontSize: 30, mr: 1 }} />
                <Typography variant="h5">
                  Personalized Recommendations
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                {predictions.recommendations || 
                  'Based on your health metrics, we recommend focusing on regular exercise, maintaining a balanced diet, and regular health check-ups.'}
              </Typography>
              
              <Typography variant="body1">
                <strong>Key Action Items:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <TimelineIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Continue monitoring your health metrics regularly"
                  />
                </ListItem>
                {(predictions.diabetesRisk > 0.4 || predictions.heartDiseaseRisk > 0.4) && (
                  <ListItem>
                    <ListItemIcon sx={{ color: 'white' }}>
                      <WarningIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Consider consulting with a healthcare professional about your risk factors"
                    />
                  </ListItem>
                )}
                <ListItem>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <InsightsIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Follow the specific recommendations for your risk factors below"
                  />
                </ListItem>
              </List>
            </Paper>
            
            {/* Risk Factors */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <DiabetesIcon sx={{ mr: 1 }} /> Diabetes Risk Factors
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    {diabetesRiskFactors.map((factor, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <InfoIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={factor} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom color="error" sx={{ display: 'flex', alignItems: 'center' }}>
                    <HeartIcon sx={{ mr: 1 }} /> Heart Disease Risk Factors
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    {heartRiskFactors.map((factor, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <InfoIcon color="error" />
                        </ListItemIcon>
                        <ListItemText primary={factor} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
            
            {/* Risk Trends */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Risk Trends Over Time
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              View how your health risk assessments have changed over time
            </Typography>
            
            <Grid container spacing={3}>
              {historicalData.diabetesRisk.length > 1 ? (
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Diabetes Risk Trend
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Line 
                        data={prepareChartData(historicalData.diabetesRisk, 'Diabetes Risk (%)', '#3f51b5')} 
                        options={chartOptions}
                      />
                    </Box>
                  </Paper>
                </Grid>
              ) : (
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom color="primary">
                      Diabetes Risk Trend
                    </Typography>
                    <Box sx={{ p: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        Not enough data to display trend.
                        Continue adding health data to see your risk trend over time.
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              )}
              
              {historicalData.heartDiseaseRisk.length > 1 ? (
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom color="error">
                      Heart Disease Risk Trend
                    </Typography>
                    <Box sx={{ height: 300 }}>
                      <Line 
                        data={prepareChartData(historicalData.heartDiseaseRisk, 'Heart Disease Risk (%)', '#f44336')} 
                        options={chartOptions}
                      />
                    </Box>
                  </Paper>
                </Grid>
              ) : (
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom color="error">
                      Heart Disease Risk Trend
                    </Typography>
                    <Box sx={{ p: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        Not enough data to display trend.
                        Continue adding health data to see your risk trend over time.
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              )}
            </Grid>
            
            {/* Update Health Data CTA */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 4,
                p: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: 1
              }}
            >
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                component={Link}
                to="/health-data"
                startIcon={<TimelineIcon />}
                sx={{ py: 1.5, px: 4 }}
              >
                Update Your Health Data
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Predictions; 