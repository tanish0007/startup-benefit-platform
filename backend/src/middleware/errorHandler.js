/**
 * Global Error Handler
 * 
 * Catches all errors and sends appropriate responses.
 * 
 * Reasoning:
 * - Centralized error handling
 * - Prevents unhandled rejections from crashing server
 * - Provides consistent error responses
 * - Logs errors for debugging
 * - Hides sensitive error details in production
 */

const { AppError } = require('../utils/errors');
const { errorResponse } = require('../utils/response');

/**
 * Handle MongoDB duplicate key errors
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return {
    message: `${field} '${value}' already exists`,
    statusCode: 409,
  };
};

/**
 * Handle MongoDB validation errors
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => ({
    field: el.path,
    message: el.message,
  }));
  return {
    message: 'Validation failed',
    statusCode: 400,
    errors,
  };
};

/**
 * Handle MongoDB cast errors (invalid ObjectId)
 */
const handleCastError = (err) => {
  return {
    message: `Invalid ${err.path}: ${err.value}`,
    statusCode: 400,
  };
};

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error for debugging
  console.error('Error:', err);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const handled = handleDuplicateKeyError(err);
    return errorResponse(res, handled.message, handled.statusCode);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const handled = handleValidationError(err);
    return errorResponse(res, handled.message, handled.statusCode, handled.errors);
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    const handled = handleCastError(err);
    return errorResponse(res, handled.message, handled.statusCode);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  // Operational errors (AppError instances)
  if (err.isOperational) {
    return errorResponse(res, err.message, err.statusCode);
  }

  // Unknown errors - don't leak error details in production
  const message =
    process.env.NODE_ENV === 'development'
      ? err.message
      : 'Something went wrong';

  const statusCode = err.statusCode || 500;

  errorResponse(res, message, statusCode);
};

/**
 * Handle 404 - Not Found
 */
const notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

module.exports = {
  errorHandler,
  notFound,
};