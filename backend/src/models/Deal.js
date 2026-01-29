/**
 * Deal Model
 * 
 * Represents SaaS deals and partnerships available on the platform.
 * 
 * Key Features:
 * - Public vs locked deals (access control)
 * - Category-based organization
 * - Partner information
 * - Discount and value proposition
 * - Claim tracking (how many times claimed)
 * 
 * Reasoning:
 * - isLocked controls who can access the deal
 * - Category enables filtering on frontend
 * - claimCount for analytics and popularity
 * - Eligibility requirements for locked deals
 * - Indexes for efficient querying
 */

const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Deal title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Deal description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'cloud_services',
        'marketing',
        'analytics',
        'productivity',
        'development',
        'design',
        'communication',
        'finance',
        'legal',
        'other',
      ],
    },
    partner: {
      name: {
        type: String,
        required: [true, 'Partner name is required'],
        trim: true,
      },
      logo: {
        type: String,
        default: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400',
      },
      website: {
        type: String,
        match: [
          /^https?:\/\/.+/,
          'Please provide a valid URL starting with http:// or https://',
        ],
      },
      description: {
        type: String,
        maxlength: [500, 'Partner description cannot exceed 500 characters'],
      },
    },
    discount: {
      type: {
        type: String,
        enum: ['percentage', 'fixed', 'credits', 'free_trial'],
        required: true,
      },
      value: {
        type: String,
        required: [true, 'Discount value is required'],
        // Examples: "50%", "$500", "1000 credits", "6 months"
      },
      originalPrice: {
        type: String,
        // Optional: to show savings
      },
    },
    isLocked: {
      type: Boolean,
      default: false,
      // Locked deals require user verification
    },
    eligibilityRequirements: {
      type: String,
      // Explains what users need to claim this deal
      default: 'Available to all registered users',
    },
    features: [
      {
        type: String,
        // Key features or benefits of the deal
      },
    ],
    terms: {
      type: String,
      maxlength: [1000, 'Terms cannot exceed 1000 characters'],
      // Terms and conditions
    },
    validUntil: {
      type: Date,
      // Deal expiration date
    },
    claimCount: {
      type: Number,
      default: 0,
      min: 0,
      // Track popularity and usage
    },
    maxClaims: {
      type: Number,
      // Optional: limit total claims
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      // Soft delete / enable-disable deals
    },
    featured: {
      type: Boolean,
      default: false,
      // Highlight special deals
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for efficient querying
dealSchema.index({ category: 1 });
dealSchema.index({ isLocked: 1 });
dealSchema.index({ isActive: 1 });
dealSchema.index({ featured: -1, createdAt: -1 });
dealSchema.index({ claimCount: -1 }); // For sorting by popularity
dealSchema.index({ title: 'text', description: 'text' }); // For search functionality

/**
 * Instance method to check if deal is claimable
 */
dealSchema.methods.isClaimable = function () {
  // Check if deal is active
  if (!this.isActive) {
    return { claimable: false, reason: 'Deal is no longer active' };
  }

  // Check if deal has expired
  if (this.validUntil && new Date() > this.validUntil) {
    return { claimable: false, reason: 'Deal has expired' };
  }

  // Check if max claims reached
  if (this.maxClaims && this.claimCount >= this.maxClaims) {
    return { claimable: false, reason: 'Maximum claims reached' };
  }

  return { claimable: true };
};

/**
 * Static method to get active deals
 */
dealSchema.statics.getActiveDeals = function (filters = {}) {
  const query = { isActive: true, ...filters };
  return this.find(query).sort({ featured: -1, createdAt: -1 });
};

const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;