const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const healthRoutes = require('./src/routes/health.routes');
const predictionRoutes = require('./src/routes/prediction.routes');

// Import DB initialization functions
const dbInit = require('./src/utils/db-init');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Ensure uploads directory exists
dbInit.ensureUploadsDirectory();

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/predictions', predictionRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to HealthPulse API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Initialize database settings
  await dbInit.initializeSettings();
  
  // Create admin user if one doesn't exist
  await dbInit.createAdminUser();
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API ready at http://localhost:${PORT}/api`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
}); 