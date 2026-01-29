/**
 * User Model
 * 
 * Represents platform users (startup founders, indie hackers).
 * 
 * Key Features:
 * - Password hashing with bcrypt before saving
 * - Email uniqueness and validation
 * - User verification status for access control
 * - Profile information storage
 * - Timestamps for auditing
 * 
 * Reasoning:
 * - isVerified field controls access to locked deals
 * - Password never returned in queries (select: false)
 * - Indexes on email for fast lookup
 * - Pre-save hook for automatic password hashing
 * - Instance methods for password comparison
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never return password in queries by default
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      enum: ['founder', 'team_member', 'indie_hacker'],
      default: 'indie_hacker',
    },
    isVerified: {
      type: Boolean,
      default: false,
      // Controls access to locked deals
      // In production, this would be set via email verification or admin approval
    },
    verificationDocument: {
      type: String,
      // URL to uploaded verification document (future implementation)
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    refreshToken: {
      type: String,
      select: false, // Security: never expose refresh tokens
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    toJSON: {
      // Customize JSON output
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ isVerified: 1 });
userSchema.index({ createdAt: -1 });

/**
 * Pre-save middleware
 * Hash password before saving to database
 * Only hash if password is modified
 */
userSchema.pre('save', async function (next) {
  // Only hash password if it's new or modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method to compare passwords
 * Used during login to verify credentials
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

/**
 * Instance method to get public profile
 * Returns user data safe for client consumption
 */
userSchema.methods.getPublicProfile = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    company: this.company,
    role: this.role,
    isVerified: this.isVerified,
    avatar: this.avatar,
    bio: this.bio,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;