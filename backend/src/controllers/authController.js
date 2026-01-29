/**
 * Authentication Controller
 * 
 * Handles user registration, login, token refresh, and profile.
 * 
 * Flow:
 * 1. Register: Create user, hash password, return tokens
 * 2. Login: Verify credentials, return tokens
 * 3. Refresh: Generate new access token from refresh token
 * 4. Profile: Get current user details
 * 
 * Reasoning:
 * - Separates auth logic from routes
 * - Handles token generation and storage
 * - Validates user input (done in middleware)
 * - Returns consistent responses
 */

const User = require('../models/User');
const { generateTokenPair, verifyRefreshToken } = require('../utils/jwt');
const { successResponse } = require('../utils/response');
const { ConflictError, AuthenticationError, ValidationError } = require('../utils/errors');

/**
 * Register new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, company, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      company,
      role,
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user._id);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // Return response
    successResponse(
      res,
      {
        user: user.getPublicProfile(),
        accessToken,
        refreshToken,
      },
      'Registration successful',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Return response
    successResponse(res, {
      user: user.getPublicProfile(),
      accessToken,
      refreshToken,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user and verify refresh token matches
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      throw new AuthenticationError('Invalid refresh token');
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(user._id);

    // Update refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    successResponse(res, {
      accessToken,
      refreshToken: newRefreshToken,
    }, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * GET /api/auth/profile
 * Protected route
 */
const getProfile = async (req, res, next) => {
  try {
    // User is already attached by auth middleware
    successResponse(res, {
      user: req.user,
    }, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 * Protected route
 */
const logout = async (req, res, next) => {
  try {
    // Clear refresh token
    req.user.refreshToken = null;
    await req.user.save();

    successResponse(res, null, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refresh,
  getProfile,
  logout,
};