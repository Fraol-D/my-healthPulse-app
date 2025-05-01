import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Card,
  CardContent,
  Chip,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { 
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon
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
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
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

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalHealthRecords: 0,
    totalPredictions: 0
  });
  const [systemSettings, setSystemSettings] = useState({});
  const [error, setError] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Dialog states
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [userDialogMode, setUserDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
    open: false,
    userId: null
  });
  
  // User form data
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    active: true
  });
  
  // Settings form data
  const [settingsForm, setSettingsForm] = useState({
    siteName: '',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    defaultUserRole: 'user'
  });
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Fetch users, stats, and settings
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const usersRes = await axios.get('/api/admin/users');
        setUsers(usersRes.data);
        
        // Fetch stats
        const statsRes = await axios.get('/api/admin/stats');
        setStats(statsRes.data);
        
        // Fetch system settings
        const settingsRes = await axios.get('/api/admin/settings');
        setSystemSettings(settingsRes.data);
        setSettingsForm({
          siteName: settingsRes.data.siteName || 'HealthPulse',
          maintenanceMode: settingsRes.data.maintenanceMode || false,
          allowRegistration: settingsRes.data.allowRegistration !== false,
          emailNotifications: settingsRes.data.emailNotifications !== false,
          defaultUserRole: settingsRes.data.defaultUserRole || 'user'
        });
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load admin data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Open add user dialog
  const handleAddUser = () => {
    setUserForm({
      name: '',
      email: '',
      password: '',
      role: 'user',
      active: true
    });
    setUserDialogMode('add');
    setUserDialogOpen(true);
  };
  
  // Open edit user dialog
  const handleEditUser = (user) => {
    setUserForm({
      name: user.name,
      email: user.email,
      password: '', // Password field will be optional when editing
      role: user.role || 'user',
      active: user.active !== false
    });
    setSelectedUser(user);
    setUserDialogMode('edit');
    setUserDialogOpen(true);
  };
  
  // Close user dialog
  const handleCloseUserDialog = () => {
    setUserDialogOpen(false);
    setSelectedUser(null);
  };
  
  // Open delete confirmation dialog
  const handleDeleteConfirm = (userId) => {
    setConfirmDeleteDialog({
      open: true,
      userId
    });
  };
  
  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setConfirmDeleteDialog({
      open: false,
      userId: null
    });
  };
  
  // Handle user form changes
  const handleUserFormChange = (e) => {
    const { name, value, checked } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: name === 'active' ? checked : value
    }));
  };
  
  // Handle settings form changes
  const handleSettingsFormChange = (e) => {
    const { name, value, checked } = e.target;
    setSettingsForm(prev => ({
      ...prev,
      [name]: name === 'maintenanceMode' || name === 'allowRegistration' || name === 'emailNotifications' 
        ? checked 
        : value
    }));
  };
  
  // Submit user form (add or edit)
  const handleUserSubmit = async () => {
    setUserLoading(true);
    try {
      if (userDialogMode === 'add') {
        // Add new user
        await axios.post('/api/admin/users', userForm);
        
        setSnackbar({
          open: true,
          message: 'User added successfully!',
          severity: 'success'
        });
      } else {
        // Edit existing user
        const userData = { ...userForm };
        if (!userData.password) {
          delete userData.password; // Don't send password if not changed
        }
        
        await axios.put(`/api/admin/users/${selectedUser._id}`, userData);
        
        setSnackbar({
          open: true,
          message: 'User updated successfully!',
          severity: 'success'
        });
      }
      
      // Refresh users list
      const usersRes = await axios.get('/api/admin/users');
      setUsers(usersRes.data);
      
      // Close dialog
      handleCloseUserDialog();
    } catch (err) {
      console.error('Error saving user:', err);
      setSnackbar({
        open: true,
        message: `Failed to ${userDialogMode === 'add' ? 'add' : 'update'} user. Please try again.`,
        severity: 'error'
      });
    } finally {
      setUserLoading(false);
    }
  };
  
  // Delete user
  const handleDeleteUser = async () => {
    try {
      await axios.delete(`/api/admin/users/${confirmDeleteDialog.userId}`);
      
      // Refresh users list
      const usersRes = await axios.get('/api/admin/users');
      setUsers(usersRes.data);
      
      setSnackbar({
        open: true,
        message: 'User deleted successfully!',
        severity: 'success'
      });
      
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting user:', err);
      setSnackbar({
        open: true,
        message: 'Failed to delete user. Please try again.',
        severity: 'error'
      });
    }
  };
  
  // Save system settings
  const handleSaveSettings = async () => {
    try {
      await axios.put('/api/admin/settings', settingsForm);
      
      setSnackbar({
        open: true,
        message: 'System settings updated successfully!',
        severity: 'success'
      });
      
      // Update system settings state
      setSystemSettings(settingsForm);
    } catch (err) {
      console.error('Error saving settings:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update system settings. Please try again.',
        severity: 'error'
      });
    }
  };
  
  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };
  
  // Refresh data
  const handleRefreshData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const usersRes = await axios.get('/api/admin/users');
      setUsers(usersRes.data);
      
      // Fetch stats
      const statsRes = await axios.get('/api/admin/stats');
      setStats(statsRes.data);
      
      setSnackbar({
        open: true,
        message: 'Data refreshed successfully!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error refreshing data:', err);
      setSnackbar({
        open: true,
        message: 'Failed to refresh data. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AdminIcon /> Admin Dashboard
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={handleRefreshData}
            disabled={loading}
          >
            Refresh Data
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
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  height: '100%', 
                  backgroundColor: '#3f51b5', 
                  color: 'white',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent>
                    <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" component="div">
                      {stats.totalUsers}
                    </Typography>
                    <Typography variant="body2">
                      Total Users
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  height: '100%', 
                  backgroundColor: '#4caf50', 
                  color: 'white',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent>
                    <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" component="div">
                      {stats.activeUsers}
                    </Typography>
                    <Typography variant="body2">
                      Active Users
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  height: '100%', 
                  backgroundColor: '#f44336', 
                  color: 'white',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent>
                    <AnalyticsIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" component="div">
                      {stats.totalHealthRecords}
                    </Typography>
                    <Typography variant="body2">
                      Health Records
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  height: '100%', 
                  backgroundColor: '#ff9800', 
                  color: 'white',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent>
                    <AnalyticsIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" component="div">
                      {stats.totalPredictions}
                    </Typography>
                    <Typography variant="body2">
                      Predictions Generated
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="admin tabs"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="User Management" icon={<PeopleIcon />} iconPosition="start" />
                <Tab label="System Settings" icon={<SettingsIcon />} iconPosition="start" />
                <Tab label="Security" icon={<SecurityIcon />} iconPosition="start" />
              </Tabs>
            </Box>
            
            {/* User Management Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">User Management</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  onClick={handleAddUser}
                >
                  Add User
                </Button>
              </Box>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'primary.light' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Role</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Joined</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user) => (
                        <TableRow key={user._id} hover>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip 
                              label={user.role === 'admin' ? 'Administrator' : 'User'} 
                              color={user.role === 'admin' ? 'secondary' : 'primary'} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={user.active !== false ? 'Active' : 'Inactive'} 
                              color={user.active !== false ? 'success' : 'error'} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell>
                            <IconButton 
                              color="primary" 
                              onClick={() => handleEditUser(user)}
                              title="Edit User"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              color="error" 
                              onClick={() => handleDeleteConfirm(user._id)}
                              title="Delete User"
                              disabled={user._id === user._id} // Disable deleting yourself
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={users.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </TabPanel>
            
            {/* System Settings Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>System Settings</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Site Name"
                    name="siteName"
                    value={settingsForm.siteName}
                    onChange={handleSettingsFormChange}
                    margin="normal"
                  />
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="default-role-label">Default User Role</InputLabel>
                    <Select
                      labelId="default-role-label"
                      name="defaultUserRole"
                      value={settingsForm.defaultUserRole}
                      onChange={handleSettingsFormChange}
                      label="Default User Role"
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Administrator</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>System Features</Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControl component="fieldset">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Switch
                              checked={settingsForm.maintenanceMode}
                              onChange={handleSettingsFormChange}
                              name="maintenanceMode"
                              color="primary"
                            />
                            <Typography>
                              Maintenance Mode {settingsForm.maintenanceMode ? 'On' : 'Off'}
                            </Typography>
                          </Box>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControl component="fieldset">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Switch
                              checked={settingsForm.allowRegistration}
                              onChange={handleSettingsFormChange}
                              name="allowRegistration"
                              color="primary"
                            />
                            <Typography>
                              Allow Public Registration {settingsForm.allowRegistration ? 'Enabled' : 'Disabled'}
                            </Typography>
                          </Box>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControl component="fieldset">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Switch
                              checked={settingsForm.emailNotifications}
                              onChange={handleSettingsFormChange}
                              name="emailNotifications"
                              color="primary"
                            />
                            <Typography>
                              Email Notifications {settingsForm.emailNotifications ? 'Enabled' : 'Disabled'}
                            </Typography>
                          </Box>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveSettings}
                >
                  Save Settings
                </Button>
              </Box>
            </TabPanel>
            
            {/* Security Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>Security Settings</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom color="primary" fontWeight="bold">
                      Password Policy
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ mb: 2 }}>
                      <FormControl component="fieldset">
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Switch
                            checked={true}
                            color="primary"
                            disabled
                          />
                          <Typography>
                            Minimum 6 characters
                          </Typography>
                        </Box>
                      </FormControl>
                      
                      <FormControl component="fieldset">
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Switch
                            checked={false}
                            color="primary"
                            disabled
                          />
                          <Typography>
                            Require uppercase letters
                          </Typography>
                        </Box>
                      </FormControl>
                      
                      <FormControl component="fieldset">
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Switch
                            checked={false}
                            color="primary"
                            disabled
                          />
                          <Typography>
                            Require numbers
                          </Typography>
                        </Box>
                      </FormControl>
                      
                      <FormControl component="fieldset">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Switch
                            checked={false}
                            color="primary"
                            disabled
                          />
                          <Typography>
                            Require special characters
                          </Typography>
                        </Box>
                      </FormControl>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      Password policy settings can be configured by system administrators.
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                    <Typography variant="subtitle1" gutterBottom color="primary" fontWeight="bold">
                      Authentication Security
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ mb: 2 }}>
                      <FormControl component="fieldset">
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Switch
                            checked={true}
                            color="primary"
                            disabled
                          />
                          <Typography>
                            JWT Token Authentication
                          </Typography>
                        </Box>
                      </FormControl>
                      
                      <FormControl component="fieldset">
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Switch
                            checked={true}
                            color="primary"
                            disabled
                          />
                          <Typography>
                            Secure Password Hashing (bcrypt)
                          </Typography>
                        </Box>
                      </FormControl>
                      
                      <FormControl component="fieldset">
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Switch
                            checked={false}
                            color="primary"
                            disabled
                          />
                          <Typography>
                            Two-Factor Authentication
                          </Typography>
                        </Box>
                      </FormControl>
                      
                      <FormControl component="fieldset">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Switch
                            checked={false}
                            color="primary"
                            disabled
                          />
                          <Typography>
                            Account Lockout After Failed Attempts
                          </Typography>
                        </Box>
                      </FormControl>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      Additional security features will be available in future updates.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
          </>
        )}
      </Paper>
      
      {/* Add/Edit User Dialog */}
      <Dialog
        open={userDialogOpen}
        onClose={handleCloseUserDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {userDialogMode === 'add' ? 'Add New User' : 'Edit User'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={userForm.name}
                onChange={handleUserFormChange}
                required
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={userForm.email}
                onChange={handleUserFormChange}
                required
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={userDialogMode === 'add' ? 'Password' : 'New Password (leave blank to keep current)'}
                name="password"
                type="password"
                value={userForm.password}
                onChange={handleUserFormChange}
                required={userDialogMode === 'add'}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={userForm.role}
                  onChange={handleUserFormChange}
                  label="Role"
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset" sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Switch
                    checked={userForm.active}
                    onChange={handleUserFormChange}
                    name="active"
                    color="primary"
                  />
                  <Typography>
                    Active Account
                  </Typography>
                </Box>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleUserSubmit}
            disabled={userLoading}
          >
            {userLoading ? <CircularProgress size={24} /> : (userDialogMode === 'add' ? 'Add User' : 'Save Changes')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteDialog.open}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteUser} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default AdminDashboard; 