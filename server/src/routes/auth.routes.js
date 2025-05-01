const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { protect, routeEnabled } = require('../middleware/auth.middleware');

// Validation rules
const registerValidation = [
  check('name', 'Name is required').not().isEmpty().isLength({ min: 3 }),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 8 characters long with at least one uppercase letter, one lowercase letter, one number, and one special character')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
  check('confirm_password', 'Confirm password is required').not().isEmpty()
];

const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

const changePasswordValidation = [
  check('current_password', 'Current password is required').not().isEmpty(),
  check('new_password', 'Password must be at least 8 characters long with at least one uppercase letter, one lowercase letter, one number, and one special character')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
  check('retype_new_password', 'Retype password is required').not().isEmpty()
];

// Register route
router.post(
  '/register',
  routeEnabled('register'),
  registerValidation,
  authController.register
);

// Login route
router.post(
  '/login',
  routeEnabled('login'),
  loginValidation,
  authController.login
);

// Get current user profile
router.get(
  '/me',
  protect,
  authController.getCurrentUser
);

// Change password
router.put(
  '/change-password',
  protect,
  routeEnabled('change_password'),
  changePasswordValidation,
  authController.changePassword
);

// Logout (client-side token removal)
router.post(
  '/logout',
  authController.logout
);

module.exports = router; 