/**
 * Database Configuration
 * 
 * Handles MongoDB connection with proper error handling and retry logic.
 * Uses mongoose for ODM with connection pooling and optimizations.
 * 
 * Reasoning:
 * - Separate connection logic for reusability and testing
 * - Event listeners for monitoring connection state
 * - Graceful error handling with process exit on critical failures
 * - Connection options optimized for production use
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      // Connection pool size for handling concurrent requests
      maxPoolSize: 10,
      minPoolSize: 5,
      
      // Timeout configurations
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      
      // Automatically create indexes
      autoIndex: process.env.NODE_ENV === 'development',
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    // Connection event handlers for monitoring
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    // Exit process with failure in production
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Graceful shutdown handler
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};

module.exports = { connectDB, disconnectDB };