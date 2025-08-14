import mongoose from 'mongoose';

const KeywordDatabaseSchema = new mongoose.Schema({
  // Industry and Job Level
  industry: {
    type: String,
    required: true,
    enum: [
      'technology', 'finance', 'healthcare', 'marketing', 'sales',
      'education', 'engineering', 'design', 'operations', 'management',
      'consulting', 'retail', 'manufacturing', 'logistics', 'legal',
      'media', 'nonprofit', 'government', 'general', 'other'
    ]
  },
  
  jobLevel: {
    type: String,
    required: true,
    enum: ['entry', 'mid', 'senior', 'executive', 'general']
  },

  // Keywords Array
  keywords: [{
    keyword: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['technical', 'soft', 'methodology', 'industry-specific', 'certification']
    },
    relevanceScore: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 3
    }
  }],

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Compound index for industry and jobLevel
KeywordDatabaseSchema.index({ industry: 1, jobLevel: 1 });

// Pre-save middleware
KeywordDatabaseSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const KeywordDatabase = mongoose.model('KeywordDatabase', KeywordDatabaseSchema);

export default KeywordDatabase;
