const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const GlobalSettings = require('../models/global-settings.model');

// Protect routes - verify token and set user on request
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (remove Bearer part)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user from token payload and exclude password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found or token is invalid'
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// Admin only middleware
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Not authorized as admin'
    });
  }
};

// Check if a specific route is enabled
exports.routeEnabled = (routeName) => {
  return async (req, res, next) => {
    try {
      const route = await GlobalSettings.findOne({ route_name: routeName });
      
      if (route && route.is_enabled) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: 'This feature is currently disabled'
        });
      }
    } catch (error) {
      console.error('Route enabled middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error checking route status'
      });
    }
  };
}; 