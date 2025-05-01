const mongoose = require('mongoose');

const globalSettingsSchema = new mongoose.Schema({
  route_name: {
    type: String,
    required: true,
    unique: true
  },
  is_enabled: {
    type: Boolean,
    default: true
  },
  description: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updated_at' field on save
globalSettingsSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Initialize default routes
globalSettingsSchema.statics.initializeDefaultSettings = async function() {
  const defaults = [
    { route_name: 'login', is_enabled: true, description: 'User login functionality' },
    { route_name: 'register', is_enabled: true, description: 'User registration functionality' },
    { route_name: 'my_profile', is_enabled: true, description: 'User profile view and edit' },
    { route_name: 'change_password', is_enabled: true, description: 'Password change functionality' },
    { route_name: 'diabetes', is_enabled: true, description: 'Diabetes prediction' },
    { route_name: 'heart_diseases', is_enabled: true, description: 'Heart disease prediction' }
  ];

  for (const setting of defaults) {
    try {
      await this.findOneAndUpdate(
        { route_name: setting.route_name },
        setting,
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error(`Error initializing setting ${setting.route_name}:`, error);
    }
  }
};

const GlobalSettings = mongoose.model('GlobalSettings', globalSettingsSchema);

module.exports = GlobalSettings; 