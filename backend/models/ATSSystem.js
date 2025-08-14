import mongoose from 'mongoose';

const ATSSystemSchema = new mongoose.Schema({
  // System Information
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  
  vendor: {
    type: String,
    required: true,
    trim: true
  },
  
  version: {
    type: String,
    trim: true
  },
  
  // System Capabilities and Rules
  capabilities: {
    fileFormats: {
      supported: [{
        format: {
          type: String,
          enum: ['pdf', 'docx', 'doc', 'txt', 'rtf'],
          required: true
        },
        preference: {
          type: String,
          enum: ['preferred', 'supported', 'limited'],
          default: 'supported'
        },
        maxSize: {
          type: Number, // in MB
          default: 10
        }
      }],
      unsupported: [String]
    },
    
    parsing: {
      textExtraction: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor'],
        default: 'good'
      },
      layoutPreservation: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor'],
        default: 'fair'
      },
      imageHandling: {
        type: String,
        enum: ['extracts-text', 'ignores', 'fails'],
        default: 'ignores'
      },
      tableHandling: {
        type: String,
        enum: ['preserves-structure', 'linearizes', 'ignores'],
        default: 'linearizes'
      }
    },
    
    keyword: {
      exactMatch: Boolean,
      stemming: Boolean,
      synonymRecognition: Boolean,
      contextAware: Boolean,
      skillsLibrary: Boolean
    },
    
    formatting: {
      fontSensitivity: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
      },
      colorSensitivity: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'low'
      },
      layoutSensitivity: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
      }
    }
  },
  
  // Scoring Criteria
  scoringCriteria: {
    keywordWeight: {
      type: Number,
      default: 40,
      min: 0,
      max: 100
    },
    experienceWeight: {
      type: Number,
      default: 30,
      min: 0,
      max: 100
    },
    educationWeight: {
      type: Number,
      default: 15,
      min: 0,
      max: 100
    },
    skillsWeight: {
      type: Number,
      default: 15,
      min: 0,
      max: 100
    },
    
    // Advanced criteria
    industryRelevance: {
      type: Number,
      default: 10,
      min: 0,
      max: 100
    },
    recencyBias: {
      type: Number,
      default: 5,
      min: 0,
      max: 100
    },
    formatPenalty: {
      type: Number,
      default: 10,
      min: 0,
      max: 100
    }
  },
  
  // Common Issues and Limitations
  commonIssues: [{
    issue: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    description: String,
    workaround: String
  }],
  
  // Market Share and Usage
  marketInfo: {
    marketShare: {
      type: Number, // percentage
      min: 0,
      max: 100
    },
    commonIndustries: [String],
    companySize: {
      type: String,
      enum: ['startup', 'small', 'medium', 'large', 'enterprise'],
      default: 'medium'
    },
    popularity: {
      type: String,
      enum: ['very-low', 'low', 'medium', 'high', 'very-high'],
      default: 'medium'
    }
  },
  
  // Testing and Validation
  lastTested: {
    type: Date,
    default: Date.now
  },
  
  testResults: [{
    testDate: Date,
    version: String,
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    },
    categories: {
      parsing: Number,
      keyword: Number,
      formatting: Number,
      accuracy: Number
    },
    notes: String
  }],
  
  // Status and Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  
  confidence: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  source: {
    type: String,
    enum: ['vendor-docs', 'testing', 'research', 'community'],
    default: 'research'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
ATSSystemSchema.index({ name: 1 });
ATSSystemSchema.index({ vendor: 1 });
ATSSystemSchema.index({ 'marketInfo.popularity': -1 });
ATSSystemSchema.index({ isActive: 1 });

// Pre-save middleware
ATSSystemSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to get compatibility score for a resume
ATSSystemSchema.methods.calculateCompatibilityScore = function(resumeAnalysis) {
  let score = 100;
  
  // File format penalty
  const resumeFormat = resumeAnalysis.fileType;
  const supportedFormat = this.capabilities.fileFormats.supported
    .find(f => f.format === resumeFormat);
  
  if (!supportedFormat) {
    score -= 20;
  } else if (supportedFormat.preference === 'limited') {
    score -= 10;
  }
  
  // Layout complexity penalty
  if (resumeAnalysis.documentMetadata.layout === 'multi-column' && 
      this.capabilities.formatting.layoutSensitivity === 'high') {
    score -= 15;
  }
  
  // Image penalty
  if (resumeAnalysis.atsCompatibility.images.count > 0 && 
      this.capabilities.parsing.imageHandling === 'fails') {
    score -= 10;
  }
  
  return Math.max(score, 0);
};

// Static method to get popular ATS systems
ATSSystemSchema.statics.getPopularSystems = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ 'marketInfo.popularity': -1, 'marketInfo.marketShare': -1 })
    .limit(limit);
};

const ATSSystem = mongoose.model('ATSSystem', ATSSystemSchema);

export default ATSSystem;
