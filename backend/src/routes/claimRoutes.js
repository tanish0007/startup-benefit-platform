/**
 * Claim Routes
 * 
 * Defines all claim-related endpoints.
 */

const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const { validateClaim } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

// All claim routes require authentication
router.use(authenticate);

router.post('/', validateClaim, claimController.claimDeal);
router.get('/', claimController.getUserClaims);
router.get('/stats', claimController.getClaimStats);
router.get('/:claimId', claimController.getClaimById);

module.exports = router;