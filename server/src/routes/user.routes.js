const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/user.controller');
const { protect, admin, routeEnabled } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function(req, file, cb) {
    // Accept only images
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Validation rules
const updateProfileValidation = [
  check('name', 'Name is required').optional().isLength({ min: 3 }),
  check('email', 'Please include a valid email').optional().isEmail(),
  check('dob', 'Date of birth must be a valid date').optional().isISO8601(),
  check('mobile_no', 'Mobile number must be valid').optional().isLength({ min: 10 })
];

// Get all users (admin only)
router.get(
  '/',
  protect,
  admin,
  userController.getAllUsers
);

// Get user profile by UUID
router.get(
  '/profile/:uuid',
  protect,
  routeEnabled('my_profile'),
  userController.getUserProfile
);

// Update user profile
router.put(
  '/profile/:uuid',
  protect,
  routeEnabled('my_profile'),
  updateProfileValidation,
  userController.updateUserProfile
);

// Upload profile image
router.post(
  '/profile/:uuid/upload-image',
  protect,
  upload.single('profileImage'),
  userController.uploadProfileImage
);

// Delete user (admin only)
router.delete(
  '/:uuid',
  protect,
  admin,
  userController.deleteUser
);

module.exports = router; 