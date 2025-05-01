const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const predictionController = require('../controllers/prediction.controller');
const { protect, routeEnabled } = require('../middleware/auth.middleware');

// Validation for prediction requests
const predictionValidation = [
  check('healthDataId', 'Invalid health data ID').optional().isMongoId()
];

// Generate diabetes prediction
router.post(
  '/diabetes',
  protect,
  routeEnabled('diabetes'),
  predictionValidation,
  predictionController.predictDiabetes
);

// Generate heart disease prediction
router.post(
  '/heart-disease',
  protect,
  routeEnabled('heart_diseases'),
  predictionValidation,
  predictionController.predictHeartDisease
);

// Get all reports for logged-in user
router.get(
  '/reports',
  protect,
  predictionController.getUserReports
);

// Get specific report by ID
router.get(
  '/reports/:id',
  protect,
  predictionController.getReportById
);

module.exports = router; 