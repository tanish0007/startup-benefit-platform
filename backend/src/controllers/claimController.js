/**
 * Claim Controller
 * 
 * Handles deal claiming and user's claimed deals.
 * 
 * Core Flow:
 * 1. User requests to claim a deal
 * 2. Verify deal exists and is claimable
 * 3. Check if user has permission (verified for locked deals)
 * 4. Check if user already claimed this deal
 * 5. Create claim record
 * 6. Increment deal's claim count
 * 7. Generate redemption code (auto-approve for now)
 * 
 * Reasoning:
 * - Authorization check happens before claim creation
 * - Duplicate claims prevented by unique index
 * - Transaction-like behavior (create claim + update deal)
 * - Auto-approval for simplicity (in production: manual approval flow)
 */

const Claim = require('../models/Claim');
const Deal = require('../models/Deal');
const { successResponse } = require('../utils/response');
const { NotFoundError, AuthorizationError, ConflictError, ValidationError } = require('../utils/errors');

/**
 * Claim a deal
 * POST /api/claims
 * Protected route
 */
const claimDeal = async (req, res, next) => {
  try {
    const { dealId } = req.body;
    const userId = req.user._id;

    // Find deal
    const deal = await Deal.findById(dealId);

    if (!deal || !deal.isActive) {
      throw new NotFoundError('Deal not found');
    }

    // Check if deal is claimable
    const { claimable, reason } = deal.isClaimable();
    if (!claimable) {
      throw new ValidationError(reason);
    }

    // Authorization: Check if deal is locked and user is verified
    if (deal.isLocked && !req.user.isVerified) {
      throw new AuthorizationError(
        'This deal requires account verification. Please verify your account to claim this deal.'
      );
    }

    // Check if user already claimed this deal
    const existingClaim = await Claim.findOne({
      user: userId,
      deal: dealId,
    });

    if (existingClaim) {
      throw new ConflictError('You have already claimed this deal');
    }

    // Create claim
    const claim = await Claim.create({
      user: userId,
      deal: dealId,
      status: 'approved', // Auto-approve for now; in production, might be 'pending'
      redemptionInstructions: `Visit ${deal.partner.website} and use your redemption code at checkout.`,
    });

    // Generate redemption code
    claim.generateRedemptionCode();
    await claim.save();

    // Increment deal's claim count
    deal.claimCount += 1;
    await deal.save();

    // Populate deal details in response
    await claim.populate('deal');

    successResponse(
      res,
      { claim },
      'Deal claimed successfully',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's claimed deals
 * GET /api/claims
 * Protected route
 */
const getUserClaims = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get claims with populated deal data
    const claims = await Claim.find(query)
      .populate('deal')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count
    const total = await Claim.countDocuments(query);

    successResponse(res, {
      claims,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    }, 'Claims retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get single claim by ID
 * GET /api/claims/:claimId
 * Protected route
 */
const getClaimById = async (req, res, next) => {
  try {
    const { claimId } = req.params;
    const userId = req.user._id;

    const claim = await Claim.findById(claimId).populate('deal');

    if (!claim) {
      throw new NotFoundError('Claim not found');
    }

    // Verify claim belongs to user
    if (claim.user.toString() !== userId.toString()) {
      throw new AuthorizationError('Access denied');
    }

    successResponse(res, { claim }, 'Claim retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get claim statistics for user
 * GET /api/claims/stats
 * Protected route
 */
const getClaimStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const stats = await Claim.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      expired: 0,
    };

    stats.forEach((stat) => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    successResponse(res, { stats: formattedStats }, 'Statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  claimDeal,
  getUserClaims,
  getClaimById,
  getClaimStats,
};