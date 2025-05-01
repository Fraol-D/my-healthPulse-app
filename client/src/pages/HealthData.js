import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button,
  TextField,
  MenuItem,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Add as AddIcon, 
  Save as SaveIcon, 
  History as HistoryIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`health-data-tabpanel-${index}`}
      aria-labelledby={`health-data-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const HealthData = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    heartRate: '',
    systolic: '',
    diastolic: '',
    bloodSugar: '',
    cholesterol: '',
    weight: '',
    height: '',
    exercise: '0',
    sleep: '',
    stress: '1',
    dietaryHabits: '1',
    notes: ''
  });
  const [healthHistory, setHealthHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    id: null
  });
  const [viewDialog, setViewDialog] = useState({
    open: false,
    data: null
  });

  // Fetch health history on component mount
  useEffect(() => {
    fetchHealthHistory();
  }, []);

  // Calculate BMI when weight or height changes
  const calculateBMI = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height) / 100; // convert cm to meters
    
    if (weight && height) {
      const bmi = (weight / (height * height)).toFixed(2);
      return bmi;
    }
    return 'N/A';
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 1) {
      fetchHealthHistory();
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fetch health history
  const fetchHealthHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await axios.get('/api/health/history');
      setHealthHistory(response.data);
    } catch (error) {
      console.error('Error fetching health history:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load health history',
        severity: 'error'
      });
    } finally {
      setHistoryLoading(false);
    }
  };

  // Submit health data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Calculate BMI
      const bmi = calculateBMI();
      
      // Create data object to send
      const dataToSubmit = {
        ...formData,
        bmi: bmi !== 'N/A' ? parseFloat(bmi) : undefined,
        date: new Date().toISOString()
      };
      
      const response = await axios.post('/api/health/add', dataToSubmit);
      
      // Reset form
      setFormData({
        heartRate: '',
        systolic: '',
        diastolic: '',
        bloodSugar: '',
        cholesterol: '',
        weight: '',
        height: '',
        exercise: '0',
        sleep: '',
        stress: '1',
        dietaryHabits: '1',
        notes: ''
      });
      
      setSnackbar({
        open: true,
        message: 'Health data saved successfully!',
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Error saving health data:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save health data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete health record
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/health/${id}`);
      fetchHealthHistory();
      setSnackbar({
        open: true,
        message: 'Health record deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting health record:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete health record',
        severity: 'error'
      });
    }
    setConfirmDialog({ open: false, id: null });
  };

  // View health record details
  const handleView = (record) => {
    setViewDialog({
      open: true,
      data: record
    });
  };

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Health Data
        </Typography>
        <Typography variant="body1" paragraph>
          Track your health metrics to get personalized insights and predictions.
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="health data tabs"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Add New Data" icon={<AddIcon />} iconPosition="start" />
            <Tab label="View History" icon={<HistoryIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Vital Signs
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Heart Rate (bpm)"
                  name="heartRate"
                  type="number"
                  value={formData.heartRate}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 40, max: 220 } }}
                  helperText="Normal: 60-100 bpm"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Systolic BP (mmHg)"
                  name="systolic"
                  type="number"
                  value={formData.systolic}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 70, max: 250 } }}
                  helperText="Normal: <120 mmHg"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Diastolic BP (mmHg)"
                  name="diastolic"
                  type="number"
                  value={formData.diastolic}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 40, max: 150 } }}
                  helperText="Normal: <80 mmHg"
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              Blood Metrics
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Blood Sugar (mg/dL)"
                  name="bloodSugar"
                  type="number"
                  value={formData.bloodSugar}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 50, max: 500 } }}
                  helperText="Normal fasting: 70-100 mg/dL"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cholesterol (mg/dL)"
                  name="cholesterol"
                  type="number"
                  value={formData.cholesterol}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 100, max: 400 } }}
                  helperText="Normal: <200 mg/dL"
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              Body Metrics
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 20, max: 300, step: 0.1 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 100, max: 250 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="BMI"
                  value={calculateBMI()}
                  InputProps={{ readOnly: true }}
                  helperText={
                    calculateBMI() !== 'N/A'
                      ? `${
                          calculateBMI() < 18.5
                            ? 'Underweight'
                            : calculateBMI() < 25
                            ? 'Normal'
                            : calculateBMI() < 30
                            ? 'Overweight'
                            : 'Obese'
                        }`
                      : 'Enter weight and height to calculate'
                  }
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              Lifestyle Factors
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Exercise Level"
                  name="exercise"
                  value={formData.exercise}
                  onChange={handleChange}
                  helperText="How active are you?"
                >
                  <MenuItem value="0">Sedentary (little or no exercise)</MenuItem>
                  <MenuItem value="1">Light (1-3 days/week)</MenuItem>
                  <MenuItem value="2">Moderate (3-5 days/week)</MenuItem>
                  <MenuItem value="3">Active (6-7 days/week)</MenuItem>
                  <MenuItem value="4">Very Active (intense exercise daily)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sleep Duration (hours)"
                  name="sleep"
                  type="number"
                  value={formData.sleep}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 0, max: 24, step: 0.5 } }}
                  helperText="Recommended: 7-9 hours"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Stress Level"
                  name="stress"
                  value={formData.stress}
                  onChange={handleChange}
                >
                  <MenuItem value="1">Low (Rarely stressed)</MenuItem>
                  <MenuItem value="2">Moderate (Occasionally stressed)</MenuItem>
                  <MenuItem value="3">High (Frequently stressed)</MenuItem>
                  <MenuItem value="4">Severe (Constantly stressed)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Dietary Habits"
                  name="dietaryHabits"
                  value={formData.dietaryHabits}
                  onChange={handleChange}
                >
                  <MenuItem value="1">Very Healthy (balanced diet)</MenuItem>
                  <MenuItem value="2">Mostly Healthy (occasional junk food)</MenuItem>
                  <MenuItem value="3">Average (mixed diet)</MenuItem>
                  <MenuItem value="4">Unhealthy (frequent junk food)</MenuItem>
                  <MenuItem value="5">Very Unhealthy (mostly junk food)</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom>
              Additional Notes
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional information about your health today..."
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                size="large"
                disabled={loading}
                sx={{ mt: 2, mb: 2, py: 1.5, px: 4 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Health Data'}
              </Button>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {historyLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : healthHistory.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No health data records found. Start tracking your health metrics to see your history.
            </Alert>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.light' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Heart Rate</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Blood Pressure</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Blood Sugar</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Weight</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>BMI</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {healthHistory.map((record) => (
                    <TableRow key={record._id} hover>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>{record.heartRate ? `${record.heartRate} bpm` : 'N/A'}</TableCell>
                      <TableCell>
                        {record.systolic && record.diastolic
                          ? `${record.systolic}/${record.diastolic} mmHg`
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{record.bloodSugar ? `${record.bloodSugar} mg/dL` : 'N/A'}</TableCell>
                      <TableCell>{record.weight ? `${record.weight} kg` : 'N/A'}</TableCell>
                      <TableCell>
                        {record.bmi
                          ? `${record.bmi.toFixed(1)} (${
                              record.bmi < 18.5
                                ? 'Underweight'
                                : record.bmi < 25
                                ? 'Normal'
                                : record.bmi < 30
                                ? 'Overweight'
                                : 'Obese'
                            })`
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleView(record)}
                          title="View Details"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => setConfirmDialog({ open: true, id: record._id })}
                          title="Delete Record"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, id: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this health record? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, id: null })}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleDelete(confirmDialog.id)} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, data: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Health Record Details
          <Typography variant="subtitle2" color="text.secondary">
            {viewDialog.data && new Date(viewDialog.data.date).toLocaleString()}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {viewDialog.data && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Vital Signs
                </Typography>
                <Box sx={{ ml: 2, mb: 3 }}>
                  <Typography variant="body1">
                    Heart Rate: {viewDialog.data.heartRate ? `${viewDialog.data.heartRate} bpm` : 'Not recorded'}
                  </Typography>
                  <Typography variant="body1">
                    Blood Pressure: {viewDialog.data.systolic && viewDialog.data.diastolic
                      ? `${viewDialog.data.systolic}/${viewDialog.data.diastolic} mmHg`
                      : 'Not recorded'}
                  </Typography>
                </Box>

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Blood Metrics
                </Typography>
                <Box sx={{ ml: 2, mb: 3 }}>
                  <Typography variant="body1">
                    Blood Sugar: {viewDialog.data.bloodSugar ? `${viewDialog.data.bloodSugar} mg/dL` : 'Not recorded'}
                  </Typography>
                  <Typography variant="body1">
                    Cholesterol: {viewDialog.data.cholesterol ? `${viewDialog.data.cholesterol} mg/dL` : 'Not recorded'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Body Metrics
                </Typography>
                <Box sx={{ ml: 2, mb: 3 }}>
                  <Typography variant="body1">
                    Weight: {viewDialog.data.weight ? `${viewDialog.data.weight} kg` : 'Not recorded'}
                  </Typography>
                  <Typography variant="body1">
                    Height: {viewDialog.data.height ? `${viewDialog.data.height} cm` : 'Not recorded'}
                  </Typography>
                  <Typography variant="body1">
                    BMI: {viewDialog.data.bmi
                      ? `${viewDialog.data.bmi.toFixed(1)} (${
                          viewDialog.data.bmi < 18.5
                            ? 'Underweight'
                            : viewDialog.data.bmi < 25
                            ? 'Normal'
                            : viewDialog.data.bmi < 30
                            ? 'Overweight'
                            : 'Obese'
                        })`
                      : 'Not recorded'}
                  </Typography>
                </Box>

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Lifestyle Factors
                </Typography>
                <Box sx={{ ml: 2, mb: 3 }}>
                  <Typography variant="body1">
                    Exercise Level: {
                      viewDialog.data.exercise === '0' ? 'Sedentary' :
                      viewDialog.data.exercise === '1' ? 'Light' :
                      viewDialog.data.exercise === '2' ? 'Moderate' :
                      viewDialog.data.exercise === '3' ? 'Active' :
                      viewDialog.data.exercise === '4' ? 'Very Active' : 'Not recorded'
                    }
                  </Typography>
                  <Typography variant="body1">
                    Sleep: {viewDialog.data.sleep ? `${viewDialog.data.sleep} hours` : 'Not recorded'}
                  </Typography>
                  <Typography variant="body1">
                    Stress Level: {
                      viewDialog.data.stress === '1' ? 'Low' :
                      viewDialog.data.stress === '2' ? 'Moderate' :
                      viewDialog.data.stress === '3' ? 'High' :
                      viewDialog.data.stress === '4' ? 'Severe' : 'Not recorded'
                    }
                  </Typography>
                  <Typography variant="body1">
                    Dietary Habits: {
                      viewDialog.data.dietaryHabits === '1' ? 'Very Healthy' :
                      viewDialog.data.dietaryHabits === '2' ? 'Mostly Healthy' :
                      viewDialog.data.dietaryHabits === '3' ? 'Average' :
                      viewDialog.data.dietaryHabits === '4' ? 'Unhealthy' :
                      viewDialog.data.dietaryHabits === '5' ? 'Very Unhealthy' : 'Not recorded'
                    }
                  </Typography>
                </Box>
              </Grid>

              {viewDialog.data.notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Notes
                  </Typography>
                  <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                    <Typography variant="body1">
                      {viewDialog.data.notes}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, data: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HealthData; 