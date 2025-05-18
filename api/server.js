/**
 * Hablaquí API Server Entry Point
 * 
 * This file serves as the main entry point for the Hablaquí API server.
 * It configures the ESM (ECMAScript Modules) loader to enable ES6 module syntax
 * and exports the main server application from server/index.js.
 * 
 * Key Features:
 * - ESM configuration for ES6 module support
 * - Environment-based configuration options
 * - Modular server architecture
 * - Cross-platform compatibility
 * - Development and production mode support
 * 
 * Configuration Options:
 * The ESM loader can be configured through:
 * 1. Direct parameter in require('esm')(module, options)
 * 2. Environment variable ESM_OPTIONS
 * 3. .esmrc file in the project root
 * 
 * @module server
 * @requires esm - ECMAScript Modules loader
 * @requires ./server/index.js - Main server application
 * 
 * @example
 * // Start the server
 * const server = require('./server.js')
 * server.listen(3000, () => {
 *   console.log('Server running on port 3000')
 * })
 * 
 * @throws {Error} If ESM module fails to load
 * @throws {Error} If server/index.js is not found
 * 
 * @see {@link https://github.com/standard-things/esm|ESM Documentation}
 */

// Express.js Server Configuration
// This file sets up the main server for the Hablaqui API

// Import required modules
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const logger = require('./server/utils/logger');

// Import environment configuration
require('dotenv').config();

// Create Express application
const app = express();

// Security middleware
app.use(helmet());  // Set security-related HTTP headers
app.use(cors());    // Enable CORS for all routes

// Request parsing middleware
app.use(express.json());      // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies

// Logging middleware
app.use(morgan('dev'));  // HTTP request logger

// Compression middleware
app.use(compression());  // Compress response bodies

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100  // Limit each IP to 100 requests per windowMs
});
app.use(limiter);  // Apply rate limiting to all routes

// Import route handlers
const authRoutes = require('./server/routes/auth');
const userRoutes = require('./server/routes/users');
const chatRoutes = require('./server/routes/chat');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
