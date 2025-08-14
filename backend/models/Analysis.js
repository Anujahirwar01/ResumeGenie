import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // File Information
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['pdf', 'docx', 'doc', 'txt']
  },
  filePath: {
    type: String,
    required: true
  },

  // Analysis Results
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },

  // Category Scores
  categories: {
    keywords: {
      score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },
      totalKeywords: {
        type: Number,
        default: 0
      },
      foundKeywords: {
        type: Number,
        default: 0
      },
      keywordDensity: {
        type: Number,
        default: 0
      }
    },
    formatting: {
      score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },
      issues: [{
        type: String,
        severity: {
          type: String,
          enum: ['low', 'medium', 'high'],
          default: 'medium'
        },
        description: String
      }],
      passedChecks: [{
        type: String
      }]
    },
    content: {
      score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },
      wordCount: {
        type: Number,
        default: 0
      },
      sectionsFound: [{
        name: String,
        found: Boolean,
        quality: {
          type: String,
          enum: ['poor', 'fair', 'good', 'excellent'],
          default: 'fair'
        }
      }],
      achievements: {
        total: {
          type: Number,
          default: 0
        },
        quantified: {
          type: Number,
          default: 0
        }
      }
    },
    structure: {
      score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },
      organization: {
        type: String,
        enum: ['poor', 'fair', 'good', 'excellent'],
        default: 'fair'
      },
      flow: {
        type: String,
        enum: ['poor', 'fair', 'good', 'excellent'],
        default: 'fair'
      },
      readability: {
        type: String,
        enum: ['poor', 'fair', 'good', 'excellent'],
        default: 'fair'
      }
    }
  },

  // Keyword Analysis
  keywords: {
    found: [{
      keyword: String,
      count: Number,
      relevance: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      category: {
        type: String,
        enum: ['technical', 'soft', 'industry', 'action'],
        default: 'technical'
      }
    }],
    missing: [{
      keyword: String,
      importance: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      category: {
        type: String,
        enum: ['technical', 'soft', 'industry', 'action'],
        default: 'technical'
      },
      suggestion: String
    }],
    suggestions: [{
      type: String
    }]
  },

  // Improvement Suggestions
  suggestions: [{
    category: {
      type: String,
      enum: ['keywords', 'formatting', 'content', 'structure'],
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    impact: {
      type: String,
      enum: ['minor', 'moderate', 'major'],
      default: 'moderate'
    }
  }],

  // Document Metadata
  documentMetadata: {
    pages: {
      type: Number,
      default: 1
    },
    wordCount: {
      type: Number,
      default: 0
    },
    characterCount: {
      type: Number,
      default: 0
    },
    sections: [{
      name: String,
      startIndex: Number,
      endIndex: Number,
      wordCount: Number
    }],
    fonts: [{
      name: String,
      usage: Number
    }],
    layout: {
      type: String,
      enum: ['single-column', 'multi-column', 'complex'],
      default: 'single-column'
    }
  },

  // ATS Compatibility Details
  atsCompatibility: {
    overall: {
      type: String,
      enum: ['poor', 'fair', 'good', 'excellent'],
      default: 'fair'
    },
    fileFormat: {
      compatible: Boolean,
      reason: String
    },
    layout: {
      compatible: Boolean,
      reason: String
    },
    fonts: {
      compatible: Boolean,
      incompatibleFonts: [String]
    },
    images: {
      count: {
        type: Number,
        default: 0
      },
      warning: String
    },
    tables: {
      count: {
        type: Number,
        default: 0
      },
      compatible: Boolean
    }
  },

  // Analysis Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  
  // Processing Information
  processingTime: {
    type: Number, // in milliseconds
    default: 0
  },
  
  // Version and Updates
  version: {
    type: String,
    default: '1.0'
  },
  
  // Additional Metadata
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Analysis Expiry (optional)
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
  }
});

// Indexes for better performance
AnalysisSchema.index({ userId: 1, createdAt: -1 });
AnalysisSchema.index({ atsScore: -1 });
AnalysisSchema.index({ status: 1 });
AnalysisSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save middleware to update updatedAt
AnalysisSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for analysis summary
AnalysisSchema.virtual('summary').get(function() {
  return {
    fileName: this.fileName,
    atsScore: this.atsScore,
    status: this.status,
    createdAt: this.createdAt,
    categories: {
      keywords: this.categories.keywords.score,
      formatting: this.categories.formatting.score,
      content: this.categories.content.score
    }
  };
});

// Method to check if analysis is recent
AnalysisSchema.methods.isRecent = function() {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.createdAt > dayAgo;
};

// Static method to get user's latest analysis
AnalysisSchema.statics.getLatestByUser = function(userId) {
  return this.findOne({ userId })
    .sort({ createdAt: -1 })
    .populate('userId', 'name email');
};

// Static method to get ATS score distribution
AnalysisSchema.statics.getScoreDistribution = function() {
  return this.aggregate([
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              { case: { $lt: ['$atsScore', 60] }, then: 'poor' },
              { case: { $lt: ['$atsScore', 75] }, then: 'fair' },
              { case: { $lt: ['$atsScore', 85] }, then: 'good' }
            ],
            default: 'excellent'
          }
        },
        count: { $sum: 1 },
        avgScore: { $avg: '$atsScore' }
      }
    }
  ]);
};

const Analysis = mongoose.model('Analysis', AnalysisSchema);

export default Analysis;
