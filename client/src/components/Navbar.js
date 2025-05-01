import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Switch,
  useMediaQuery,
  useTheme as useMuiTheme
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  AccountCircle, 
  Brightness4, 
  Brightness7,
  Dashboard,
  HealthAndSafety,
  Assessment,
  Person,
  ExitToApp,
  AdminPanelSettings
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Health Data', icon: <HealthAndSafety />, path: '/health-data' },
    { text: 'Predictions', icon: <Assessment />, path: '/predictions' },
    { text: 'Reports', icon: <Assessment />, path: '/reports' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ text: 'Admin Dashboard', icon: <AdminPanelSettings />, path: '/admin' });
  }

  const drawerList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Avatar 
          alt={user?.name || 'User'} 
          src={user?.avatar || ''}
          sx={{ width: 60, height: 60, mb: 1 }}
        />
        <Typography variant="subtitle1">{user?.name || 'Guest'}</Typography>
        <Typography variant="body2" color="text.secondary">{user?.email || ''}</Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            component={Link} 
            to={item.path} 
            key={item.text}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem sx={{ justifyContent: 'space-between' }}>
          <ListItemIcon>
            {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </ListItemIcon>
          <ListItemText primary={theme === 'dark' ? 'Light Mode' : 'Dark Mode'} />
          <Switch checked={theme === 'dark'} onChange={toggleTheme} />
        </ListItem>
        {isAuthenticated && (
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="primary" elevation={4}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {isAuthenticated && isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={isAuthenticated ? '/dashboard' : '/login'}
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            HealthPulse
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          
          {isAuthenticated ? (
            <>
              {!isMobile && (
                <Box sx={{ display: 'flex' }}>
                  {menuItems.map((item) => (
                    <Button
                      key={item.text}
                      component={Link}
                      to={item.path}
                      sx={{ 
                        my: 2, 
                        color: 'white', 
                        display: 'flex', 
                        alignItems: 'center',
                        backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent'
                      }}
                      startIcon={item.icon}
                    >
                      {item.text}
                    </Button>
                  ))}
                </Box>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                {!isMobile && (
                  <IconButton onClick={toggleTheme} color="inherit">
                    {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
                  </IconButton>
                )}
                
                {!isMobile && (
                  <>
                    <IconButton
                      size="large"
                      aria-label="account of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={handleMenu}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem component={Link} to="/profile" onClick={handleClose}>Profile</MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </>
                )}
              </Box>
            </>
          ) : (
            <Box>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
              <IconButton onClick={toggleTheme} color="inherit">
                {theme === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerList()}
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 