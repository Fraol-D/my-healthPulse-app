const GlobalSettings = require('../models/global-settings.model');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

/**
 * Initialize default global settings in the database
 */
exports.initializeSettings = async () => {
  try {
    console.log('Initializing default settings...');
    
    // Call the static method in GlobalSettings model
    await GlobalSettings.initializeDefaultSettings();
    
    console.log('Default settings initialized successfully');
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
};

/**
 * Create an admin user if one doesn't exist
 */
exports.createAdminUser = async () => {
  try {
    console.log('Checking for admin user...');
    
    // Check if admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      console.log('No admin user found. Creating default admin user...');
      
      // Create admin user
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      
      const adminUser = new User({
        name: 'Admin',
        email: 'admin@healthpulse.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Default admin user created successfully');
      console.log('Admin credentials: admin@healthpulse.com / Admin@123');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

/**
 * Create uploads directory for file storage
 */
exports.ensureUploadsDirectory = () => {
  const fs = require('fs');
  const path = require('path');
  
  const uploadsPath = path.join(__dirname, '../../uploads');
  
  if (!fs.existsSync(uploadsPath)) {
    console.log('Creating uploads directory...');
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log('Uploads directory created at:', uploadsPath);
  }
}; 