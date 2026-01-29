/**
 * Express Application Configuration
 * 
 * Central app configuration with middleware setup.
 * 
 * Middleware Order (Important):
 * 1. Security headers (helmet)
 * 2. CORS
 * 3. Body parsing
 * 4. Rate limiting
 * 5. Routes
 * 6. Error handlers (404, global error handler)
 * 
 * Reasoning:
 * - Helmet adds security headers
 * - CORS allows frontend to access API
 * - Rate limiting prevents abuse
 * - Cookie parser for future cookie-based auth
 * - Centralized error handling
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const dealRoutes = require('./routes/dealRoutes');
const claimRoutes = require('./routes/claimRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/claims', claimRoutes);

// 404 handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;