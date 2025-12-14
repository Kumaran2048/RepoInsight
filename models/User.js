const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  githubToken: {
    type: String,
    default: ''
  },
  profile: {
    name: String,
    avatar: String,
    bio: String,
    location: String,
    website: String,
    company: String
  },
  skills: [{
    name: String,
    level: String,
    verified: Boolean,
    lastUpdated: Date
  }],
  badges: [{
    name: String,
    earnedAt: Date,
    description: String,
    icon: String
  }],
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastAnalysis: Date
  },
  preferences: {
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true },
    autoAnalyze: { type: Boolean, default: false }
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update streak method
userSchema.methods.updateStreak = function() {
  const now = new Date();
  const lastAnalysis = this.streak.lastAnalysis;
  
  if (!lastAnalysis) {
    this.streak.current = 1;
  } else {
    const diffDays = Math.floor((now - lastAnalysis) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      this.streak.current += 1;
    } else if (diffDays > 1) {
      this.streak.current = 1;
    }
  }
  
  this.streak.lastAnalysis = now;
  if (this.streak.current > this.streak.longest) {
    this.streak.longest = this.streak.current;
  }
  
  return this.streak.current;
};

// Virtual for total analyses count
userSchema.virtual('analysisCount').get(function() {
  return mongoose.model('Analysis').countDocuments({ userId: this._id });
});

module.exports = mongoose.model('User', userSchema);