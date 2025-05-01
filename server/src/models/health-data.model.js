const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Demographics
  age: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  height: {
    type: Number,  // in cm
    min: 0
  },
  weight: {
    type: Number,  // in kg
    min: 0
  },
  
  // Vital signs
  bloodPressure: {
    systolic: {  // systolic (ap_hi)
      type: Number,
      min: 0
    },
    diastolic: {  // diastolic (ap_lo)
      type: Number,
      min: 0
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  
  // Medical history
  medicalHistory: {
    hypertension: {
      type: Boolean,
      default: false
    },
    heartDisease: {
      type: Boolean,
      default: false
    }
  },
  
  // Lifestyle factors
  lifestyle: {
    smokingStatus: {
      type: String,
      enum: ['never', 'former', 'current', 'not current', 'ever', 'No Info'],
      default: 'No Info'
    },
    alcoholConsumption: {
      type: Boolean,
      default: false
    },
    physicalActivity: {
      type: Boolean,
      default: false
    }
  },
  
  // Lab results
  labResults: {
    cholesterol: {
      type: Number,
      enum: [1, 2, 3],  // 1: normal, 2: above normal, 3: high
      default: 1
    },
    glucose: {
      type: Number,
      enum: [1, 2, 3],  // 1: normal, 2: above normal, 3: high
      default: 1
    },
    hba1c: {
      type: Number,
      min: 0
    },
    bloodGlucose: {
      type: Number,
      min: 0
    }
  },
  
  // Calculated metrics
  calculatedMetrics: {
    bmi: {
      type: Number,
      min: 0
    }
  },
  
  // Timestamps
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate BMI before saving if height and weight are available
healthDataSchema.pre('save', function(next) {
  if (this.height && this.weight) {
    // BMI = weight(kg) / (height(m))²
    const heightInMeters = this.height / 100;
    this.calculatedMetrics.bmi = this.weight / (heightInMeters * heightInMeters);
  }
  next();
});

const HealthData = mongoose.model('HealthData', healthDataSchema);

module.exports = HealthData; 