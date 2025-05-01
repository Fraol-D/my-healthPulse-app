const User = require('../models/user.model');
const GlobalSettings = require('../models/global-settings.model');
const { validationResult } = require('express-validator');

// @desc    Get user profile by UUID
// @route   GET /api/users/profile/:uuid
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    // Check if route is enabled
    const profileSetting = await GlobalSettings.findOne({ route_name: 'my_profile' });
    if (!profileSetting || !profileSetting.is_enabled) {
      return res.status(403).json({ 
        success: false, 
        message: 'Profile view is currently disabled' 
      });
    }

    const { uuid } = req.params;

    // Ensure only admins can view other profiles, or users can view their own
    if (req.user.role !== 'admin' && req.user.uuid !== uuid) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this profile'
      });
    }

    const user = await User.findOne({ uuid }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile/:uuid
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    // Check if route is enabled
    const profileSetting = await GlobalSettings.findOne({ route_name: 'my_profile' });
    if (!profileSetting || !profileSetting.is_enabled) {
      return res.status(403).json({ 
        success: false, 
        message: 'Profile update is currently disabled' 
      });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { uuid } = req.params;
    
    // Ensure only admins can update other profiles, or users their own
    if (req.user.role !== 'admin' && req.user.uuid !== uuid) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    const { name, email, dob, address, mobile_no } = req.body;

    // Check if email exists and belongs to different user
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.uuid !== uuid) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already registered to another user' 
        });
      }
    }

    // Find user and update
    const updateData = {
      name,
      email,
      dob,
      address,
      mobile_no
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedUser = await User.findOneAndUpdate(
      { uuid },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:uuid
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const { uuid } = req.params;
    
    const deletedUser = await User.findOneAndDelete({ uuid });
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    });
  }
};

// @desc    Upload profile image
// @route   POST /api/users/profile/:uuid/upload-image
// @access  Private
exports.uploadProfileImage = async (req, res) => {
  try {
    const { uuid } = req.params;
    
    // Ensure only admins can update other profiles, or users their own
    if (req.user.role !== 'admin' && req.user.uuid !== uuid) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }
    
    // Check if file exists in request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Update profile with new image path
    const updatedUser = await User.findOneAndUpdate(
      { uuid },
      { 
        $set: { profileImage: req.file.filename },
        $push: { 
          image_files: {
            file_id: req.file.id, 
            filename: req.file.filename
          } 
        }
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error uploading image'
    });
  }
}; 