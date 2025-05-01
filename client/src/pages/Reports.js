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
  Card,
  CardContent,
  CardActions,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  GetApp as DownloadIcon,
  Assessment as AssessmentIcon,
  DateRange as DateRangeIcon,
  BarChart as BarChartIcon,
  Insights as InsightsIcon,
  Close as CloseIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [healthData, setHealthData] = useState([]);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [chartType, setChartType] = useState('bar');
  const [timeFilter, setTimeFilter] = useState('all');
  
  // Fetch reports and health data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch reports
        const reportsRes = await axios.get('/api/reports');
        setReports(reportsRes.data);
        
        // Fetch health data for charts
        const healthDataRes = await axios.get('/api/health/history');
        setHealthData(healthDataRes.data);
      } catch (err) {
        console.error('Error fetching reports data:', err);
        setError('Failed to load reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter health data based on time selection
  const getFilteredHealthData = () => {
    if (timeFilter === 'all') {
      return healthData;
    }
    
    const now = new Date();
    let startDate;
    
    if (timeFilter === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeFilter === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else if (timeFilter === 'year') {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    }
    
    return healthData.filter(item => new Date(item.date) >= startDate);
  };
  
  // Handle opening report details
  const handleOpenReport = (report) => {
    setSelectedReport(report);
    setReportDialogOpen(true);
  };
  
  // Close report dialog
  const handleCloseReportDialog = () => {
    setReportDialogOpen(false);
  };
  
  // Handle chart type change
  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };
  
  // Handle time filter change
  const handleTimeFilterChange = (event) => {
    setTimeFilter(event.target.value);
  };
  
  // Format date string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Prepare heart rate chart data
  const getHeartRateChartData = () => {
    const filteredData = getFilteredHealthData();
    
    const sortedData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const labels = sortedData.map(item => formatDate(item.date));
    const data = sortedData.map(item => item.heartRate || 0);
    
    return {
      labels,
      datasets: [
        {
          label: 'Heart Rate (bpm)',
          data,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }
      ]
    };
  };
  
  // Prepare blood pressure chart data
  const getBloodPressureChartData = () => {
    const filteredData = getFilteredHealthData();
    
    const sortedData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const labels = sortedData.map(item => formatDate(item.date));
    const systolicData = sortedData.map(item => item.systolic || 0);
    const diastolicData = sortedData.map(item => item.diastolic || 0);
    
    return {
      labels,
      datasets: [
        {
          label: 'Systolic (mmHg)',
          data: systolicData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        },
        {
          label: 'Diastolic (mmHg)',
          data: diastolicData,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }
      ]
    };
  };
  
  // Prepare blood sugar chart data
  const getBloodSugarChartData = () => {
    const filteredData = getFilteredHealthData();
    
    const sortedData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const labels = sortedData.map(item => formatDate(item.date));
    const data = sortedData.map(item => item.bloodSugar || 0);
    
    return {
      labels,
      datasets: [
        {
          label: 'Blood Sugar (mg/dL)',
          data,
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgb(255, 206, 86)',
          borderWidth: 1
        }
      ]
    };
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Health Metrics Over Time'
      }
    }
  };
  
  // Get the chart component based on type
  const getChartComponent = (dataFunc) => {
    const data = dataFunc();
    
    if (chartType === 'bar') {
      return <Bar data={data} options={chartOptions} />;
    } else {
      return <Line data={data} options={chartOptions} />;
    }
  };
  
  // Generate PDF report
  const generatePdfReport = async () => {
    try {
      const response = await axios.get('/api/reports/generate', {
        responseType: 'blob'
      });
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `health_report_${new Date().toISOString().slice(0, 10)}.pdf`);
      
      // Append to html page
      document.body.appendChild(link);
      
      // Start download
      link.click();
      
      // Clean up and remove the link
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      setError('Failed to generate PDF report. Please try again later.');
    }
  };
  
  // Summary statistics
  const getSummaryStats = () => {
    const filteredData = getFilteredHealthData();
    
    if (filteredData.length === 0) {
      return {
        avgHeartRate: 'N/A',
        avgSystolic: 'N/A',
        avgDiastolic: 'N/A',
        avgBloodSugar: 'N/A',
        latestBmi: 'N/A'
      };
    }
    
    const heartRates = filteredData.filter(item => item.heartRate).map(item => item.heartRate);
    const systolicValues = filteredData.filter(item => item.systolic).map(item => item.systolic);
    const diastolicValues = filteredData.filter(item => item.diastolic).map(item => item.diastolic);
    const bloodSugarValues = filteredData.filter(item => item.bloodSugar).map(item => item.bloodSugar);
    
    // Sort by date in descending order for latest data
    const sortedByDate = [...filteredData].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestBmi = sortedByDate.length > 0 && sortedByDate[0].bmi ? sortedByDate[0].bmi : null;
    
    // Calculate averages
    const avgHeartRate = heartRates.length > 0 
      ? (heartRates.reduce((sum, val) => sum + val, 0) / heartRates.length).toFixed(1) 
      : 'N/A';
      
    const avgSystolic = systolicValues.length > 0 
      ? (systolicValues.reduce((sum, val) => sum + val, 0) / systolicValues.length).toFixed(1) 
      : 'N/A';
      
    const avgDiastolic = diastolicValues.length > 0 
      ? (diastolicValues.reduce((sum, val) => sum + val, 0) / diastolicValues.length).toFixed(1) 
      : 'N/A';
      
    const avgBloodSugar = bloodSugarValues.length > 0 
      ? (bloodSugarValues.reduce((sum, val) => sum + val, 0) / bloodSugarValues.length).toFixed(1) 
      : 'N/A';
    
    return {
      avgHeartRate,
      avgSystolic,
      avgDiastolic,
      avgBloodSugar,
      latestBmi: latestBmi ? latestBmi.toFixed(1) : 'N/A'
    };
  };
  
  const stats = getSummaryStats();
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" color="primary" gutterBottom>
            Health Reports
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={generatePdfReport}
          >
            Generate Report
          </Button>
        </Box>
        
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
        ) : (
          <>
            {/* Health Summary */}
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
              Health Summary
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={2.4}>
                <Card sx={{ height: '100%', borderTop: '4px solid #f44336' }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Avg. Heart Rate
                    </Typography>
                    <Typography variant="h5" component="div">
                      {stats.avgHeartRate}
                      {stats.avgHeartRate !== 'N/A' && ' bpm'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <Card sx={{ height: '100%', borderTop: '4px solid #3f51b5' }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Avg. Systolic
                    </Typography>
                    <Typography variant="h5" component="div">
                      {stats.avgSystolic}
                      {stats.avgSystolic !== 'N/A' && ' mmHg'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <Card sx={{ height: '100%', borderTop: '4px solid #2196f3' }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Avg. Diastolic
                    </Typography>
                    <Typography variant="h5" component="div">
                      {stats.avgDiastolic}
                      {stats.avgDiastolic !== 'N/A' && ' mmHg'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <Card sx={{ height: '100%', borderTop: '4px solid #ff9800' }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Avg. Blood Sugar
                    </Typography>
                    <Typography variant="h5" component="div">
                      {stats.avgBloodSugar}
                      {stats.avgBloodSugar !== 'N/A' && ' mg/dL'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2.4}>
                <Card sx={{ height: '100%', borderTop: '4px solid #4caf50' }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Latest BMI
                    </Typography>
                    <Typography variant="h5" component="div">
                      {stats.latestBmi}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Chart Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BarChartIcon sx={{ mr: 1 }} /> Health Trends
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                  <InputLabel id="chart-type-label">Chart Type</InputLabel>
                  <Select
                    labelId="chart-type-label"
                    id="chart-type"
                    value={chartType}
                    onChange={handleChartTypeChange}
                    label="Chart Type"
                  >
                    <MenuItem value="bar">Bar Chart</MenuItem>
                    <MenuItem value="line">Line Chart</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                  <InputLabel id="time-filter-label">Time Period</InputLabel>
                  <Select
                    labelId="time-filter-label"
                    id="time-filter"
                    value={timeFilter}
                    onChange={handleTimeFilterChange}
                    label="Time Period"
                  >
                    <MenuItem value="week">Last Week</MenuItem>
                    <MenuItem value="month">Last Month</MenuItem>
                    <MenuItem value="year">Last Year</MenuItem>
                    <MenuItem value="all">All Time</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            {/* Charts */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Heart Rate
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    {getFilteredHealthData().length > 0 ? (
                      getChartComponent(getHeartRateChartData)
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography color="text.secondary">
                          No heart rate data available for the selected time period
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Blood Pressure
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    {getFilteredHealthData().length > 0 ? (
                      getChartComponent(getBloodPressureChartData)
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography color="text.secondary">
                          No blood pressure data available for the selected time period
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Blood Sugar
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    {getFilteredHealthData().length > 0 ? (
                      getChartComponent(getBloodSugarChartData)
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography color="text.secondary">
                          No blood sugar data available for the selected time period
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            
            {/* Health Reports Table */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <AssessmentIcon sx={{ mr: 1 }} /> Generated Reports
            </Typography>
            
            {reports.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                No reports have been generated yet. Click the "Generate Report" button to create a new report.
              </Alert>
            ) : (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'primary.light' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Report Name</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date Generated</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report._id} hover>
                        <TableCell>{report.name}</TableCell>
                        <TableCell>{formatDate(report.createdAt)}</TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>
                          <Chip 
                            label={report.status} 
                            color={report.status === 'Completed' ? 'success' : 'warning'} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="small" 
                            onClick={() => handleOpenReport(report)}
                            variant="outlined"
                            sx={{ mr: 1 }}
                          >
                            View
                          </Button>
                          <IconButton color="primary" title="Download">
                            <DownloadIcon />
                          </IconButton>
                          <IconButton color="primary" title="Share">
                            <ShareIcon />
                          </IconButton>
                          <IconButton color="primary" title="Print">
                            <PrintIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </Paper>
      
      {/* Report Details Dialog */}
      <Dialog
        open={reportDialogOpen}
        onClose={handleCloseReportDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedReport && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedReport.name}</Typography>
                <IconButton onClick={handleCloseReportDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Report Details</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body1">
                      <strong>Generated On:</strong> {formatDate(selectedReport.createdAt)}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Report Type:</strong> {selectedReport.type}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Status:</strong> {selectedReport.status}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Time Period:</strong> {selectedReport.timePeriod || 'All Time'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold">Summary</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body1">
                      {selectedReport.summary || 
                        'This report contains a comprehensive analysis of your health metrics over time, including vital signs, blood tests, and health risk assessments.'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight="bold">Report Content</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body1">
                      {selectedReport.content || 
                        'The detailed content of this report includes:'}
                    </Typography>
                    <ul>
                      <li>Health metrics trends over time</li>
                      <li>Risk assessments for common conditions</li>
                      <li>Personalized health recommendations</li>
                      <li>Comparison with healthy ranges</li>
                    </ul>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={handleCloseReportDialog}
                variant="outlined"
              >
                Close
              </Button>
              <Button 
                startIcon={<DownloadIcon />}
                variant="contained"
                color="primary"
              >
                Download PDF
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Reports; 