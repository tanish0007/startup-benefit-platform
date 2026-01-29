/**
 * Claim Model
 * 
 * Represents a user's claim on a deal.
 * Links users to deals they've claimed.
 * 
 * Key Features:
 * - Status tracking (pending, approved, rejected)
 * - Unique constraint: one user can't claim same deal twice
 * - Redemption code generation
 * - Claim metadata (notes, expiration)
 * 
 * Reasoning:
 * - Compound index ensures one claim per user per deal
 * - Status allows for approval workflows
 * - Redemption info stores how to actually use the deal
 * - References to User and Deal for relational queries
 */

const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    deal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deal',
      required: [true, 'Deal reference is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'expired'],
      default: 'pending',
      // Pending: awaiting verification/approval
      // Approved: user can access deal
      // Rejected: claim denied
      // Expired: deal expired after claiming
    },
    redemptionCode: {
      type: String,
      // Generated code or link for user to redeem
    },
    redemptionInstructions: {
      type: String,
      // How to use the deal/code
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      // Admin notes or additional info
    },
    claimedAt: {
      type: Date,
      default: Date.now,
    },
    approvedAt: {
      type: Date,
      // When the claim was approved
    },
    expiresAt: {
      type: Date,
      // When the claim/code expires
    },
    usedAt: {
      type: Date,
      // Track if/when user actually used the deal
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

// Compound index: prevent duplicate claims
// A user can only claim a specific deal once
claimSchema.index({ user: 1, deal: 1 }, { unique: true });

// Additional indexes for queries
claimSchema.index({ user: 1, status: 1 });
claimSchema.index({ deal: 1, status: 1 });
claimSchema.index({ status: 1, createdAt: -1 });

/**
 * Pre-save middleware
 * Set approvedAt timestamp when status changes to approved
 */
claimSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'approved' && !this.approvedAt) {
    this.approvedAt = new Date();
  }
  // next();
});

/**
 * Static method to get user's claims with deal details
 */
claimSchema.statics.getUserClaimsWithDeals = function (userId, status = null) {
  const query = { user: userId };
  if (status) {
    query.status = status;
  }
  return this.find(query)
    .populate('deal')
    .sort({ createdAt: -1 });
};

/**
 * Instance method to check if claim is active
 */
claimSchema.methods.isActive = function () {
  if (this.status !== 'approved') {
    return false;
  }
  if (this.expiresAt && new Date() > this.expiresAt) {
    return false;
  }
  return true;
};

/**
 * Instance method to generate redemption code
 * Simple implementation - in production, use more sophisticated generation
 */
claimSchema.methods.generateRedemptionCode = function () {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  this.redemptionCode = code;
  return code;
};

const Claim = mongoose.model('Claim', claimSchema);

module.exports = Claim;