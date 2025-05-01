const HealthData = require('../models/health-data.model');
const HealthReport = require('../models/health-report.model');
const GlobalSettings = require('../models/global-settings.model');
const User = require('../models/user.model');
const axios = require('axios');
const { validationResult } = require('express-validator');

// Placeholder for ML model integration
// In production, this would call a Python microservice or use a Node.js ML library
const predictDiabetes = async (healthData) => {
  // Mock prediction logic - would be replaced with actual ML model
  const { 
    age, 
    gender, 
    calculatedMetrics: { bmi }, 
    labResults: { hba1c, bloodGlucose },
    medicalHistory: { hypertension }
  } = healthData;

  // Simplified risk formula based on known risk factors
  let risk = 0;

  // Age is a risk factor
  if (age > 45) risk += 0.2;
  if (age > 60) risk += 0.1;

  // BMI is a risk factor
  if (bmi > 25) risk += 0.1;
  if (bmi > 30) risk += 0.2;

  // HbA1c is a strong predictor
  if (hba1c > 5.7) risk += 0.2;
  if (hba1c > 6.5) risk += 0.5;

  // Blood glucose is a strong predictor
  if (bloodGlucose > 100) risk += 0.1;
  if (bloodGlucose > 125) risk += 0.3;

  // Hypertension is a risk factor
  if (hypertension) risk += 0.1;

  // Ensure risk is between 0 and 1
  risk = Math.min(Math.max(risk, 0), 1);

  // Add some randomness to the confidence score (simulating model confidence)
  const confidenceScore = Math.min(Math.floor(risk * 100) + Math.floor(Math.random() * 10), 100);

  return {
    risk,
    confidenceScore
  };
};

// Placeholder for ML model integration
// In production, this would call a Python microservice or use a Node.js ML library
const predictHeartDisease = async (healthData) => {
  // Mock prediction logic - would be replaced with actual ML model
  const { 
    age, 
    gender, 
    calculatedMetrics: { bmi }, 
    bloodPressure: { systolic, diastolic },
    medicalHistory: { hypertension },
    lifestyle: { smokingStatus, physicalActivity }
  } = healthData;

  // Simplified risk formula based on known risk factors
  let risk = 0;

  // Age is a risk factor
  if (age > 45) risk += 0.1;
  if (age > 65) risk += 0.2;

  // Men have higher risk at younger ages
  if (gender === 'male' && age < 55) risk += 0.1;
  
  // Women's risk increases after menopause
  if (gender === 'female' && age > 55) risk += 0.1;

  // BMI is a risk factor
  if (bmi > 25) risk += 0.1;
  if (bmi > 30) risk += 0.15;

  // Blood pressure is a major risk factor
  if (systolic > 130) risk += 0.1;
  if (systolic > 160) risk += 0.3;
  if (diastolic > 80) risk += 0.1;
  if (diastolic > 100) risk += 0.2;

  // Hypertension is a major risk factor
  if (hypertension) risk += 0.2;

  // Smoking is a major risk factor
  if (smokingStatus === 'current') risk += 0.3;
  if (smokingStatus === 'former') risk += 0.1;

  // Physical activity is protective
  if (physicalActivity) risk -= 0.1;

  // Ensure risk is between 0 and 1
  risk = Math.min(Math.max(risk, 0), 1);

  // Add some randomness to the confidence score (simulating model confidence)
  const confidenceScore = Math.min(Math.floor(risk * 100) + Math.floor(Math.random() * 10), 100);

  return {
    risk,
    confidenceScore
  };
};

// Generate personalized recommendations based on health data and predictions
const generateRecommendations = (healthData, diabetesRisk, heartRisk) => {
  const recommendations = [];

  // BMI-based recommendations
  if (healthData.calculatedMetrics?.bmi > 30) {
    recommendations.push({
      category: 'lifestyle',
      title: 'Weight Management',
      description: 'Your BMI indicates obesity, which increases risk for diabetes and heart disease. Aim to reduce weight gradually through diet and exercise.',
      priority: 'high'
    });
  } else if (healthData.calculatedMetrics?.bmi > 25) {
    recommendations.push({
      category: 'lifestyle',
      title: 'Weight Management',
      description: 'Your BMI indicates overweight status. Consider working with a dietitian to develop a healthy eating plan.',
      priority: 'medium'
    });
  }

  // Blood pressure recommendations
  if (healthData.bloodPressure?.systolic > 140 || healthData.bloodPressure?.diastolic > 90) {
    recommendations.push({
      category: 'followUp',
      title: 'Blood Pressure Control',
      description: 'Your blood pressure is elevated. Follow up with your healthcare provider to discuss management strategies.',
      priority: 'high'
    });
  }

  // Diabetes-specific recommendations
  if (diabetesRisk.risk > 0.5) {
    recommendations.push({
      category: 'followUp',
      title: 'Diabetes Screening',
      description: 'Your risk assessment shows high diabetes risk. Schedule a fasting blood glucose test with your doctor.',
      priority: 'high'
    });

    recommendations.push({
      category: 'diet',
      title: 'Reduce Sugar Intake',
      description: 'Limit consumption of sugary foods and beverages. Choose whole foods with a low glycemic index.',
      priority: 'medium'
    });
  }

  // Heart disease-specific recommendations
  if (heartRisk.risk > 0.5) {
    recommendations.push({
      category: 'followUp',
      title: 'Cardiovascular Assessment',
      description: 'Your heart disease risk is elevated. Consider scheduling a cardiovascular assessment with your doctor.',
      priority: 'high'
    });

    recommendations.push({
      category: 'diet',
      title: 'Heart-Healthy Diet',
      description: 'Follow a diet low in saturated fat and sodium, and rich in fruits, vegetables, and whole grains.',
      priority: 'medium'
    });
  }

  // Lifestyle recommendations
  if (healthData.lifestyle?.smokingStatus === 'current') {
    recommendations.push({
      category: 'lifestyle',
      title: 'Smoking Cessation',
      description: 'Quitting smoking is one of the most important things you can do for your health. Consider seeking support for smoking cessation.',
      priority: 'high'
    });
  }

  if (!healthData.lifestyle?.physicalActivity) {
    recommendations.push({
      category: 'exercise',
      title: 'Increase Physical Activity',
      description: 'Aim for at least 150 minutes of moderate-intensity exercise per week, such as brisk walking or swimming.',
      priority: 'medium'
    });
  }

  // General recommendations
  recommendations.push({
    category: 'lifestyle',
    title: 'Regular Health Check-ups',
    description: 'Schedule regular health check-ups to monitor your health status and catch any issues early.',
    priority: 'medium'
  });

  return recommendations;
};

// @desc    Generate diabetes prediction
// @route   POST /api/predictions/diabetes
// @access  Private
exports.predictDiabetes = async (req, res) => {
  try {
    // Check if route is enabled
    const diabetesSetting = await GlobalSettings.findOne({ route_name: 'diabetes' });
    if (!diabetesSetting || !diabetesSetting.is_enabled) {
      return res.status(403).json({ 
        success: false, 
        message: 'Diabetes prediction is currently disabled' 
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

    // Get health data ID from request or use the latest health data
    const healthDataId = req.body.healthDataId;
    let healthData;

    if (healthDataId) {
      // Fetch specific health data
      healthData = await HealthData.findById(healthDataId);
      
      if (!healthData) {
        return res.status(404).json({
          success: false,
          message: 'Health data not found'
        });
      }

      // Check if health data belongs to the logged-in user
      if (healthData.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this health data'
        });
      }
    } else {
      // Fetch latest health data for the user
      healthData = await HealthData.findOne({ user: req.user._id }).sort({ createdAt: -1 });
      
      if (!healthData) {
        return res.status(404).json({
          success: false,
          message: 'No health data found for this user. Please add health data first.'
        });
      }
    }

    // Generate prediction
    const diabetesPrediction = await predictDiabetes(healthData);
    
    // Create a health report with the prediction
    const heartDiseasePrediction = { risk: 0, confidenceScore: 0 }; // Default heart disease prediction
    
    // Generate recommendations
    const recommendations = generateRecommendations(healthData, diabetesPrediction, heartDiseasePrediction);

    // Create a health report
    const healthReport = new HealthReport({
      user: req.user._id,
      healthData: healthData._id,
      reportType: 'diabetes',
      predictions: {
        diabetes: {
          risk: diabetesPrediction.risk,
          confidenceScore: diabetesPrediction.confidenceScore
        }
      },
      recommendations
    });

    const savedReport = await healthReport.save();

    // Add report reference to user's reports array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { reports: savedReport._id } }
    );

    return res.status(200).json({
      success: true,
      message: 'Diabetes prediction generated successfully',
      data: {
        report: savedReport
      }
    });
  } catch (error) {
    console.error('Diabetes prediction error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error generating diabetes prediction'
    });
  }
};

// @desc    Generate heart disease prediction
// @route   POST /api/predictions/heart-disease
// @access  Private
exports.predictHeartDisease = async (req, res) => {
  try {
    // Check if route is enabled
    const heartSetting = await GlobalSettings.findOne({ route_name: 'heart_diseases' });
    if (!heartSetting || !heartSetting.is_enabled) {
      return res.status(403).json({ 
        success: false, 
        message: 'Heart disease prediction is currently disabled' 
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

    // Get health data ID from request or use the latest health data
    const healthDataId = req.body.healthDataId;
    let healthData;

    if (healthDataId) {
      // Fetch specific health data
      healthData = await HealthData.findById(healthDataId);
      
      if (!healthData) {
        return res.status(404).json({
          success: false,
          message: 'Health data not found'
        });
      }

      // Check if health data belongs to the logged-in user
      if (healthData.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this health data'
        });
      }
    } else {
      // Fetch latest health data for the user
      healthData = await HealthData.findOne({ user: req.user._id }).sort({ createdAt: -1 });
      
      if (!healthData) {
        return res.status(404).json({
          success: false,
          message: 'No health data found for this user. Please add health data first.'
        });
      }
    }

    // Generate prediction
    const heartDiseasePrediction = await predictHeartDisease(healthData);
    
    // Create a health report with the prediction
    const diabetesPrediction = { risk: 0, confidenceScore: 0 }; // Default diabetes prediction
    
    // Generate recommendations
    const recommendations = generateRecommendations(healthData, diabetesPrediction, heartDiseasePrediction);

    // Create a health report
    const healthReport = new HealthReport({
      user: req.user._id,
      healthData: healthData._id,
      reportType: 'heartDisease',
      predictions: {
        heartDisease: {
          risk: heartDiseasePrediction.risk,
          confidenceScore: heartDiseasePrediction.confidenceScore
        }
      },
      recommendations
    });

    const savedReport = await healthReport.save();

    // Add report reference to user's reports array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { reports: savedReport._id } }
    );

    return res.status(200).json({
      success: true,
      message: 'Heart disease prediction generated successfully',
      data: {
        report: savedReport
      }
    });
  } catch (error) {
    console.error('Heart disease prediction error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error generating heart disease prediction'
    });
  }
};

// @desc    Get all reports for a user
// @route   GET /api/predictions/reports
// @access  Private
exports.getUserReports = async (req, res) => {
  try {
    // Find all reports for the user, sorted by date (newest first)
    const reports = await HealthReport.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('healthData');

    if (!reports || reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No reports found for this user'
      });
    }

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    console.error('Get user reports error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving reports'
    });
  }
};

// @desc    Get a specific report by ID
// @route   GET /api/predictions/reports/:id
// @access  Private
exports.getReportById = async (req, res) => {
  try {
    const reportId = req.params.id;
    
    // Find the report
    const report = await HealthReport.findById(reportId).populate('healthData');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if the report belongs to the logged-in user or if user is admin
    if (report.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this report'
      });
    }

    return res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Get report by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving report'
    });
  }
}; 