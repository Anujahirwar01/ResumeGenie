import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  // User and Analysis Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Analysis',
    required: true
  },
  
  // Report Information
  reportType: {
    type: String,
    enum: ['detailed', 'summary', 'comparison', 'improvement'],
    default: 'detailed'
  },
  
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  description: {
    type: String,
    trim: true
  },
  
  // Report Content
  content: {
    // Executive Summary
    executiveSummary: {
      overallScore: Number,
      grade: {
        type: String,
        enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
      },
      keyStrengths: [String],
      majorWeaknesses: [String],
      recommendation: String
    },
    
    // Detailed Analysis
    detailedAnalysis: {
      keywordAnalysis: {
        score: Number,
        foundKeywords: [{
          keyword: String,
          relevance: String,
          frequency: Number
        }],
        missingKeywords: [{
          keyword: String,
          importance: String,
          suggestion: String
        }],
        keywordDensity: Number,
        recommendations: [String]
      },
      
      formattingAnalysis: {
        score: Number,
        passedChecks: [String],
        failedChecks: [{
          check: String,
          issue: String,
          solution: String
        }],
        recommendations: [String]
      },
      
      contentAnalysis: {
        score: Number,
        sections: [{
          name: String,
          present: Boolean,
          quality: String,
          feedback: String
        }],
        achievements: {
          total: Number,
          quantified: Number,
          suggestions: [String]
        },
        recommendations: [String]
      }
    },
    
    // Improvement Plan
    improvementPlan: {
      quickWins: [{
        action: String,
        impact: String,
        effort: String,
        timeEstimate: String
      }],
      mediumTermGoals: [{
        action: String,
        impact: String,
        effort: String,
        timeEstimate: String
      }],
      longTermGoals: [{
        action: String,
        impact: String,
        effort: String,
        timeEstimate: String
      }]
    },
    
    // Industry Benchmarking
    benchmarking: {
      industryAverage: Number,
      percentile: Number,
      comparisonInsights: [String],
      industryTrends: [String]
    },
    
    // ATS Compatibility Details
    atsCompatibility: {
      systemsAnalyzed: [String],
      compatibilityScores: [{
        system: String,
        score: Number,
        status: String
      }],
      recommendations: [String]
    }
  },
  
  // Report Generation Info
  generatedBy: {
    method: {
      type: String,
      enum: ['ai', 'template', 'manual'],
      default: 'ai'
    },
    version: {
      type: String,
      default: '1.0'
    },
    processingTime: Number
  },
  
  // Report Status and Sharing
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed', 'archived'],
    default: 'generating'
  },
  
  visibility: {
    type: String,
    enum: ['private', 'shared', 'public'],
    default: 'private'
  },
  
  shareToken: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Download and Access Tracking
  downloadCount: {
    type: Number,
    default: 0
  },
  
  viewCount: {
    type: Number,
    default: 0
  },
  
  lastViewed: {
    type: Date
  },
  
  lastDownloaded: {
    type: Date
  },
  
  // Report Format Options
  formats: {
    pdf: {
      available: {
        type: Boolean,
        default: false
      },
      filePath: String,
      fileSize: Number,
      generatedAt: Date
    },
    html: {
      available: {
        type: Boolean,
        default: true
      },
      content: String,
      generatedAt: Date
    },
    json: {
      available: {
        type: Boolean,
        default: true
      },
      data: mongoose.Schema.Types.Mixed,
      generatedAt: Date
    }
  },
  
  // User Feedback
  userFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    helpful: Boolean,
    comments: String,
    submittedAt: Date
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
  }
});

// Indexes
ReportSchema.index({ userId: 1, createdAt: -1 });
ReportSchema.index({ analysisId: 1 });
ReportSchema.index({ shareToken: 1 });
ReportSchema.index({ status: 1 });
ReportSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save middleware
ReportSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Generate share token if report is shared
  if (this.visibility === 'shared' && !this.shareToken) {
    this.shareToken = require('crypto').randomBytes(32).toString('hex');
  }
  
  next();
});

// Method to increment view count
ReportSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  this.lastViewed = new Date();
  return this.save();
};

// Method to increment download count
ReportSchema.methods.incrementDownloadCount = function() {
  this.downloadCount += 1;
  this.lastDownloaded = new Date();
  return this.save();
};

// Static method to get user reports
ReportSchema.statics.getUserReports = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('analysisId', 'fileName atsScore');
};

const Report = mongoose.model('Report', ReportSchema);

export default Report;
