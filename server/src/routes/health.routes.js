const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const healthController = require('../controllers/health.controller');
const { protect } = require('../middleware/auth.middleware');

// Validation rules
const healthDataValidation = [
  check('age', 'Age must be a number').optional().isNumeric(),
  check('gender', 'Gender must be male, female, or other').optional().isIn(['male', 'female', 'other']),
  check('height', 'Height must be a positive number').optional().isNumeric().isFloat({ min: 0 }),
  check('weight', 'Weight must be a positive number').optional().isNumeric().isFloat({ min: 0 }),
  check('bloodPressure.systolic', 'Systolic blood pressure must be a positive number').optional().isNumeric().isFloat({ min: 0 }),
  check('bloodPressure.diastolic', 'Diastolic blood pressure must be a positive number').optional().isNumeric().isFloat({ min: 0 }),
  check('medicalHistory.hypertension', 'Hypertension must be a boolean').optional().isBoolean(),
  check('medicalHistory.heartDisease', 'Heart disease must be a boolean').optional().isBoolean(),
  check('lifestyle.smokingStatus', 'Invalid smoking status').optional().isIn(['never', 'former', 'current', 'not current', 'ever', 'No Info']),
  check('lifestyle.alcoholConsumption', 'Alcohol consumption must be a boolean').optional().isBoolean(),
  check('lifestyle.physicalActivity', 'Physical activity must be a boolean').optional().isBoolean(),
  check('labResults.cholesterol', 'Cholesterol must be 1, 2, or 3').optional().isIn([1, 2, 3]),
  check('labResults.glucose', 'Glucose must be 1, 2, or 3').optional().isIn([1, 2, 3]),
  check('labResults.hba1c', 'HbA1c must be a positive number').optional().isNumeric().isFloat({ min: 0 }),
  check('labResults.bloodGlucose', 'Blood glucose must be a positive number').optional().isNumeric().isFloat({ min: 0 })
];

// Get all health data for logged-in user
router.get(
  '/',
  protect,
  healthController.getUserHealthData
);

// Get specific health data entry
router.get(
  '/:id',
  protect,
  healthController.getHealthDataById
);

// Add new health data
router.post(
  '/',
  protect,
  healthDataValidation,
  healthController.addHealthData
);

// Update health data
router.put(
  '/:id',
  protect,
  healthDataValidation,
  healthController.updateHealthData
);

// Delete health data
router.delete(
  '/:id',
  protect,
  healthController.deleteHealthData
);

module.exports = router; 