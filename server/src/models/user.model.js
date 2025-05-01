const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  dob: {
    type: Date
  },
  address: {
    type: String
  },
  mobile_no: {
    type: String
  },
  profileImage: {
    type: String
  },
  image_files: [{
    file_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GridFS'
    },
    filename: String
  }],
  healthData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealthData'
  },
  reports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealthReport'
  }],
  created_At: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to verify password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate UUID for new users
userSchema.pre('validate', function(next) {
  if (!this.uuid) {
    // Generate a random 8 character hex string
    this.uuid = require('crypto').randomBytes(4).toString('hex');
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User; 