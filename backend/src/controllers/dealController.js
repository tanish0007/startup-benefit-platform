/**
 * Deal Controller
 * 
 * Handles deal listing, details, and filtering.
 * 
 * Key Features:
 * - List all deals with filters (category, locked status, search)
 * - Pagination support
 * - Get single deal details
 * - Featured deals
 * 
 * Reasoning:
 * - Public access for deal listing (optionalAuth for personalization)
 * - Search uses MongoDB text index
 * - Filters allow flexible querying
 * - Pagination prevents overwhelming responses
 */

const Deal = require('../models/Deal');
const { successResponse } = require('../utils/response');
const { NotFoundError } = require('../utils/errors');

/**
 * Get all deals with filtering and pagination
 * GET /api/deals
 */
const getAllDeals = async (req, res, next) => {
  try {
    const {
      category,
      isLocked,
      search,
      page = 1,
      limit = 12,
      sort = '-createdAt',
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (isLocked !== undefined) {
      query.isLocked = isLocked === 'true';
    }

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const deals = await Deal.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Deal.countDocuments(query);

    successResponse(res, {
      deals,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    }, 'Deals retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get single deal by ID
 * GET /api/deals/:dealId
 */
const getDealById = async (req, res, next) => {
  try {
    const { dealId } = req.params;

    const deal = await Deal.findById(dealId);

    if (!deal || !deal.isActive) {
      throw new NotFoundError('Deal not found');
    }

    successResponse(res, { deal }, 'Deal retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured deals
 * GET /api/deals/featured
 */
const getFeaturedDeals = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const deals = await Deal.find({ isActive: true, featured: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    successResponse(res, { deals }, 'Featured deals retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get popular deals (by claim count)
 * GET /api/deals/popular
 */
const getPopularDeals = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const deals = await Deal.find({ isActive: true })
      .sort({ claimCount: -1 })
      .limit(parseInt(limit));

    successResponse(res, { deals }, 'Popular deals retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get deal categories with counts
 * GET /api/deals/categories
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Deal.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const formattedCategories = categories.map((cat) => ({
      category: cat._id,
      count: cat.count,
    }));

    successResponse(res, { categories: formattedCategories }, 'Categories retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDeals,
  getDealById,
  getFeaturedDeals,
  getPopularDeals,
  getCategories,
};