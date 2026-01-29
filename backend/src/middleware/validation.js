/**
 * Validation Middleware
 * 
 * Handles request validation using express-validator.
 * 
 * Reasoning:
 * - Validates input before it reaches controllers
 * - Prevents invalid data from entering the system
 * - Returns clear validation errors to client
 * - Reusable validation chains
 */

const { body, param, query, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    
    throw new ValidationError('Validation failed', formattedErrors);
  }
  
  next();
};

/**
 * User registration validation
 */
const validateRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  
  body('role')
    .optional()
    .isIn(['founder', 'team_member', 'indie_hacker'])
    .withMessage('Invalid role'),
  
  handleValidationErrors,
];

/**
 * User login validation
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors,
];

/**
 * Deal ID validation
 */
const validateDealId = [
  param('dealId')
    .notEmpty()
    .withMessage('Deal ID is required')
    .isMongoId()
    .withMessage('Invalid deal ID'),
  
  handleValidationErrors,
];

/**
 * Claim validation
 */
const validateClaim = [
  body('dealId')
    .notEmpty()
    .withMessage('Deal ID is required')
    .isMongoId()
    .withMessage('Invalid deal ID'),
  
  handleValidationErrors,
];

/**
 * Query validation for deals listing
 */
const validateDealsQuery = [
  query('category')
    .optional()
    .isIn([
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
    ])
    .withMessage('Invalid category'),
  
  query('isLocked')
    .optional()
    .isBoolean()
    .withMessage('isLocked must be a boolean'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query too long'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors,
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateDealId,
  validateClaim,
  validateDealsQuery,
  handleValidationErrors,
};