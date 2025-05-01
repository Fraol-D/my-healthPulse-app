const HealthData = require('../models/health-data.model');
const User = require('../models/user.model');
const { validationResult } = require('express-validator');

// @desc    Add health data for a user
// @route   POST /api/health
// @access  Private
exports.addHealthData = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    // Get user ID from authenticated user
    const userId = req.user._id;

    // Create new health data entry
    const {
      age,
      gender,
      height,
      weight,
      bloodPressure,
      medicalHistory,
      lifestyle,
      labResults
    } = req.body;

    // Create health data object
    const healthData = new HealthData({
      user: userId,
      age,
      gender,
      height,
      weight,
      bloodPressure: {
        systolic: bloodPressure?.systolic,
        diastolic: bloodPressure?.diastolic
      },
      medicalHistory: {
        hypertension: medicalHistory?.hypertension || false,
        heartDisease: medicalHistory?.heartDisease || false
      },
      lifestyle: {
        smokingStatus: lifestyle?.smokingStatus || 'No Info',
        alcoholConsumption: lifestyle?.alcoholConsumption || false,
        physicalActivity: lifestyle?.physicalActivity || false
      },
      labResults: {
        cholesterol: labResults?.cholesterol || 1,
        glucose: labResults?.glucose || 1,
        hba1c: labResults?.hba1c,
        bloodGlucose: labResults?.bloodGlucose
      }
    });

    // Save health data
    const savedHealthData = await healthData.save();

    // Update user's healthData reference
    await User.findByIdAndUpdate(userId, { healthData: savedHealthData._id });

    res.status(201).json({
      success: true,
      message: 'Health data added successfully',
      data: savedHealthData
    });
  } catch (error) {
    console.error('Add health data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding health data'
    });
  }
};

// @desc    Get health data for the logged-in user
// @route   GET /api/health
// @access  Private
exports.getUserHealthData = async (req, res) => {
  try {
    // Get user ID from authenticated user
    const userId = req.user._id;

    // Find all health data entries for the user, sorted by date (newest first)
    const healthDataEntries = await HealthData.find({ user: userId })
      .sort({ createdAt: -1 });

    if (!healthDataEntries || healthDataEntries.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No health data found for this user'
      });
    }

    res.status(200).json({
      success: true,
      count: healthDataEntries.length,
      data: healthDataEntries
    });
  } catch (error) {
    console.error('Get health data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving health data'
    });
  }
};

// @desc    Get specific health data entry by ID
// @route   GET /api/health/:id
// @access  Private
exports.getHealthDataById = async (req, res) => {
  try {
    const healthDataId = req.params.id;
    
    // Find the health data entry
    const healthData = await HealthData.findById(healthDataId);

    if (!healthData) {
      return res.status(404).json({
        success: false,
        message: 'Health data entry not found'
      });
    }

    // Check if the health data belongs to the logged-in user or if user is admin
    if (healthData.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this health data'
      });
    }

    res.status(200).json({
      success: true,
      data: healthData
    });
  } catch (error) {
    console.error('Get health data by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving health data'
    });
  }
};

// @desc    Update health data by ID
// @route   PUT /api/health/:id
// @access  Private
exports.updateHealthData = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const healthDataId = req.params.id;
    
    // Find the health data entry
    let healthData = await HealthData.findById(healthDataId);

    if (!healthData) {
      return res.status(404).json({
        success: false,
        message: 'Health data entry not found'
      });
    }

    // Check if the health data belongs to the logged-in user or if user is admin
    if (healthData.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this health data'
      });
    }

    // Update fields
    const {
      age,
      gender,
      height,
      weight,
      bloodPressure,
      medicalHistory,
      lifestyle,
      labResults
    } = req.body;

    // Build update object
    const updateData = {};
    if (age !== undefined) updateData.age = age;
    if (gender !== undefined) updateData.gender = gender;
    if (height !== undefined) updateData.height = height;
    if (weight !== undefined) updateData.weight = weight;
    
    // Nested objects
    if (bloodPressure) {
      updateData.bloodPressure = {};
      if (bloodPressure.systolic !== undefined) updateData.bloodPressure.systolic = bloodPressure.systolic;
      if (bloodPressure.diastolic !== undefined) updateData.bloodPressure.diastolic = bloodPressure.diastolic;
    }
    
    if (medicalHistory) {
      updateData.medicalHistory = {};
      if (medicalHistory.hypertension !== undefined) updateData.medicalHistory.hypertension = medicalHistory.hypertension;
      if (medicalHistory.heartDisease !== undefined) updateData.medicalHistory.heartDisease = medicalHistory.heartDisease;
    }
    
    if (lifestyle) {
      updateData.lifestyle = {};
      if (lifestyle.smokingStatus !== undefined) updateData.lifestyle.smokingStatus = lifestyle.smokingStatus;
      if (lifestyle.alcoholConsumption !== undefined) updateData.lifestyle.alcoholConsumption = lifestyle.alcoholConsumption;
      if (lifestyle.physicalActivity !== undefined) updateData.lifestyle.physicalActivity = lifestyle.physicalActivity;
    }
    
    if (labResults) {
      updateData.labResults = {};
      if (labResults.cholesterol !== undefined) updateData.labResults.cholesterol = labResults.cholesterol;
      if (labResults.glucose !== undefined) updateData.labResults.glucose = labResults.glucose;
      if (labResults.hba1c !== undefined) updateData.labResults.hba1c = labResults.hba1c;
      if (labResults.bloodGlucose !== undefined) updateData.labResults.bloodGlucose = labResults.bloodGlucose;
    }

    // Recalculate BMI if height or weight changed
    if (height !== undefined || weight !== undefined) {
      const heightToUse = height !== undefined ? height : healthData.height;
      const weightToUse = weight !== undefined ? weight : healthData.weight;
      
      if (heightToUse && weightToUse) {
        const heightInMeters = heightToUse / 100;
        updateData.calculatedMetrics = {
          bmi: weightToUse / (heightInMeters * heightInMeters)
        };
      }
    }

    // Update the health data
    const updatedHealthData = await HealthData.findByIdAndUpdate(
      healthDataId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Health data updated successfully',
      data: updatedHealthData
    });
  } catch (error) {
    console.error('Update health data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating health data'
    });
  }
};

// @desc    Delete health data entry
// @route   DELETE /api/health/:id
// @access  Private
exports.deleteHealthData = async (req, res) => {
  try {
    const healthDataId = req.params.id;
    
    // Find the health data entry
    const healthData = await HealthData.findById(healthDataId);

    if (!healthData) {
      return res.status(404).json({
        success: false,
        message: 'Health data entry not found'
      });
    }

    // Check if the health data belongs to the logged-in user or if user is admin
    if (healthData.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this health data'
      });
    }

    // Remove the health data
    await healthData.remove();

    res.status(200).json({
      success: true,
      message: 'Health data deleted successfully'
    });
  } catch (error) {
    console.error('Delete health data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting health data'
    });
  }
}; 