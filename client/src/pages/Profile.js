import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button,
  TextField,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Tab,
  Tabs
} from '@mui/material';
import { 
  Person as PersonIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Height as HeightIcon,
  MonitorWeight as WeightIcon,
  MedicalServices as MedicalIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
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

const Profile = () => {
  const { user, updateProfile, changePassword, error: authError, setError: setAuthError } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    age: '',
    phone: '',
    height: '',
    weight: '',
    medicalConditions: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [formErrors, setFormErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // Load user data into form when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        gender: user.gender || '',
        age: user.age?.toString() || '',
        phone: user.phone || '',
        height: user.height?.toString() || '',
        weight: user.weight?.toString() || '',
        medicalConditions: user.medicalConditions || ''
      });
    }
  }, [user]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
    setFormErrors({});
  };

  // Handle profile form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user types
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: ''
      });
    }
  };

  // Toggle password visibility
  const handleTogglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Validate profile form
  const validateProfileForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (formData.age && (isNaN(formData.age) || parseInt(formData.age) < 1 || parseInt(formData.age) > 120)) {
      errors.age = 'Please enter a valid age';
    }
    
    if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (formData.height && (isNaN(formData.height) || parseFloat(formData.height) < 50 || parseFloat(formData.height) > 250)) {
      errors.height = 'Please enter a valid height in cm (50-250)';
    }

    if (formData.weight && (isNaN(formData.weight) || parseFloat(formData.weight) < 20 || parseFloat(formData.weight) > 500)) {
      errors.weight = 'Please enter a valid weight in kg (20-500)';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setLoading(true);
    setAuthError(null);
    
    try {
      // Convert string values to numbers where appropriate
      const updatedData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined
      };
      
      const success = await updateProfile(updatedData);
      
      if (success) {
        setSnackbar({
          open: true,
          message: 'Profile updated successfully!',
          severity: 'success'
        });
        setEditMode(false);
      } else {
        throw new Error(authError || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update profile',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setPasswordLoading(true);
    setAuthError(null);
    
    try {
      const success = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (success) {
        setSnackbar({
          open: true,
          message: 'Password changed successfully!',
          severity: 'success'
        });
        
        // Reset password form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        throw new Error(authError || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to change password',
        severity: 'error'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" color="primary" gutterBottom>
            My Profile
          </Typography>
          {!editMode && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={toggleEditMode}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="profile tabs"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Profile Information" icon={<PersonIcon />} iconPosition="start" />
            <Tab label="Change Password" icon={<LockIcon />} iconPosition="start" />
            <Tab label="Medical Information" icon={<MedicalIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Profile Information Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: 40
                }}
              >
                {getInitials(user?.name)}
              </Avatar>
              
              <Typography variant="h5" gutterBottom>
                {user?.name}
              </Typography>
              
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              
              <Chip 
                label={user?.role === 'admin' ? 'Administrator' : 'User'} 
                color={user?.role === 'admin' ? 'secondary' : 'primary'} 
                sx={{ mt: 1 }}
              />
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Box component="form" onSubmit={handleProfileUpdate}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editMode}
                      error={!!formErrors.name}
                      helperText={formErrors.name}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editMode}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      disabled={!editMode}
                      error={!!formErrors.age}
                      helperText={formErrors.age}
                      InputProps={{
                        inputProps: { min: 1, max: 120 },
                        startAdornment: (
                          <InputAdornment position="start">
                            <CakeIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editMode}
                      error={!!formErrors.phone}
                      helperText={formErrors.phone}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  {editMode && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={toggleEditMode}
                          sx={{ mr: 2 }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          startIcon={<SaveIcon />}
                          disabled={loading}
                        >
                          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                        </Button>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Password Tab */}
        <TabPanel value={tabValue} index={1}>
          <Card variant="outlined" sx={{ maxWidth: 600, mx: 'auto' }}>
            <CardHeader
              title="Change Your Password"
              subheader="Update your password periodically to maintain security"
              avatar={<LockIcon color="primary" />}
            />
            <CardContent>
              <Box component="form" onSubmit={handlePasswordChange}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      name="currentPassword"
                      type={showPassword.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      error={!!passwordErrors.currentPassword}
                      helperText={passwordErrors.currentPassword}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleTogglePasswordVisibility('current')}
                              edge="end"
                            >
                              {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="newPassword"
                      type={showPassword.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      error={!!passwordErrors.newPassword}
                      helperText={passwordErrors.newPassword || 'Password must be at least 6 characters'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleTogglePasswordVisibility('new')}
                              edge="end"
                            >
                              {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      name="confirmPassword"
                      type={showPassword.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      error={!!passwordErrors.confirmPassword}
                      helperText={passwordErrors.confirmPassword}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleTogglePasswordVisibility('confirm')}
                              edge="end"
                            >
                              {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        disabled={passwordLoading}
                      >
                        {passwordLoading ? <CircularProgress size={24} /> : 'Update Password'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Medical Information Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box component="form" onSubmit={handleProfileUpdate}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  disabled={!editMode}
                  error={!!formErrors.height}
                  helperText={formErrors.height || 'Your height in centimeters'}
                  InputProps={{
                    inputProps: { min: 50, max: 250, step: 0.1 },
                    startAdornment: (
                      <InputAdornment position="start">
                        <HeightIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  disabled={!editMode}
                  error={!!formErrors.weight}
                  helperText={formErrors.weight || 'Your weight in kilograms'}
                  InputProps={{
                    inputProps: { min: 20, max: 500, step: 0.1 },
                    startAdornment: (
                      <InputAdornment position="start">
                        <WeightIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Medical Conditions or Allergies"
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="List any medical conditions, allergies, or ongoing treatments..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                        <MedicalIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              {editMode && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={toggleEditMode}
                      sx={{ mr: 2 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
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
    </Container>
  );
};

export default Profile; 