const mongoose = require('mongoose');

const healthReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  healthData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealthData',
    required: true
  },
  reportType: {
    type: String,
    enum: ['diabetes', 'heartDisease', 'general'],
    required: true
  },
  predictions: {
    // Diabetes prediction
    diabetes: {
      risk: {
        type: Number,  // 0-1 probability
        min: 0,
        max: 1
      },
      riskLevel: {
        type: String,
        enum: ['low', 'moderate', 'high']
      },
      confidenceScore: {
        type: Number,
        min: 0,
        max: 100
      }
    },
    // Heart disease prediction
    heartDisease: {
      risk: {
        type: Number,  // 0-1 probability
        min: 0,
        max: 1
      },
      riskLevel: {
        type: String,
        enum: ['low', 'moderate', 'high']
      },
      confidenceScore: {
        type: Number,
        min: 0,
        max: 100
      }
    }
  },
  recommendations: [{
    category: {
      type: String,
      enum: ['diet', 'exercise', 'medication', 'lifestyle', 'followUp']
    },
    title: String,
    description: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  }],
  notes: String,
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Method to determine risk level based on probability
healthReportSchema.methods.calculateRiskLevel = function(probability) {
  if (probability < 0.3) return 'low';
  if (probability < 0.7) return 'moderate';
  return 'high';
};

// Add risk level based on risk probability before saving
healthReportSchema.pre('save', function(next) {
  if (this.predictions.diabetes && this.predictions.diabetes.risk !== undefined) {
    this.predictions.diabetes.riskLevel = this.calculateRiskLevel(this.predictions.diabetes.risk);
  }
  
  if (this.predictions.heartDisease && this.predictions.heartDisease.risk !== undefined) {
    this.predictions.heartDisease.riskLevel = this.calculateRiskLevel(this.predictions.heartDisease.risk);
  }
  
  next();
});

const HealthReport = mongoose.model('HealthReport', healthReportSchema);

module.exports = HealthReport; 