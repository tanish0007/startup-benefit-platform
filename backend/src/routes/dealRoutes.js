/**
 * Deal Routes
 * 
 * Defines all deal-related endpoints.
 */

const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');
const { validateDealId, validateDealsQuery } = require('../middleware/validation');
const { optionalAuth } = require('../middleware/auth');

// Public routes (with optional auth for personalization)
router.get('/', validateDealsQuery, optionalAuth, dealController.getAllDeals);
router.get('/featured', optionalAuth, dealController.getFeaturedDeals);
router.get('/popular', optionalAuth, dealController.getPopularDeals);
router.get('/categories', dealController.getCategories);
router.get('/:dealId', validateDealId, optionalAuth, dealController.getDealById);

module.exports = router;