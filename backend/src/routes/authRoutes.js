/**
 * Authentication Routes
 * 
 * Defines all auth-related endpoints.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh', authController.refresh);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.post('/logout', authenticate, authController.logout);

module.exports = router;