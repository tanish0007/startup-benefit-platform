/**
 * Authentication Middleware
 * 
 * Protects routes requiring authentication.
 * Verifies JWT tokens and attaches user to request.
 * 
 * Reasoning:
 * - Extracts token from Authorization header
 * - Verifies token signature and expiration
 * - Loads user from database and attaches to req.user
 * - Provides clear error messages for different failure cases
 * - Separate middleware for verified users (locked deals)
 */

const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const { AuthenticationError, AuthorizationError } = require('../utils/errors');

/**
 * Authenticate user via JWT
 */
const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyAccessToken(token);

    // Load user from database
    const user = await User.findById(decoded.userId).select('-password -refreshToken');

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return next(error);
    }
    next(new AuthenticationError('Invalid token'));
  }
};

/**
 * Require verified user
 * Use this middleware for locked deals or premium features
 */
const requireVerified = (req, res, next) => {
  if (!req.user) {
    return next(new AuthenticationError('Authentication required'));
  }

  if (!req.user.isVerified) {
    return next(
      new AuthorizationError(
        'This feature requires account verification. Please verify your account to continue.'
      )
    );
  }

  next();
};

/**
 * Optional authentication
 * Attaches user if token is valid, but doesn't fail if not authenticated
 * Useful for endpoints that change behavior based on auth status
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId).select('-password -refreshToken');
      
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Silently fail - user will be undefined
  }
  next();
};

module.exports = {
  authenticate,
  requireVerified,
  optionalAuth,
};