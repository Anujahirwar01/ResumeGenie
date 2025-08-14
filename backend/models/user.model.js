import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: [2, 'Name must be at least 2 characters long'],
    maxLength: [100, 'Name must be at most 100 characters long']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minLength: [6, 'Email must be at least 6 characters long'],
    maxLength: [100, 'Email must be at most 100 characters long'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    select: false,
    minLength: [6, 'Password must be at least 6 characters long'],
    maxLength: [100, 'Password must be at most 100 characters long']
  },

  // Basic Profile Information (Optional)
  profile: {
    industry: {
      type: String,
      enum: [
        'technology', 'finance', 'healthcare', 'marketing', 'sales',
        'education', 'engineering', 'design', 'operations', 'management',
        'consulting', 'retail', 'manufacturing', 'logistics', 'legal',
        'media', 'nonprofit', 'government', 'other'
      ]
    },
    jobLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'executive']
    },
    location: {
      type: String,
      trim: true,
      maxLength: [100, 'Location must be at most 100 characters long']
    }
  },

  // Basic Account Settings
  isEmailVerified: { 
    type: Boolean, 
    default: false 
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Account Status
  isActive: { 
    type: Boolean, 
    default: true 
  },
  
  // Basic Timestamps
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
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Hash password before saving
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

// Method to compare password
userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// Generate auth token
userSchema.methods.generateAuthToken = function () {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.sign({ _id: this._id }, secret, {
    expiresIn: '24h'
  });
};

const User = mongoose.model("User", userSchema);

export default User;