/**
 * API Routes Configuration
 * 
 * This file serves as the central router configuration for the Hablaquí API.
 * It imports and registers all route modules under the /api/v1 prefix.
 * 
 * Key Features:
 * - Centralized route management
 * - API versioning support
 * - Health check endpoint
 * - Modular route organization
 * - Consistent route prefixing
 * 
 * Available Routes:
 * - /api/v1/appointments - Appointment management
 * - /api/v1/auth - Authentication and authorization
 * - /api/v1/specialists - Specialist management
 * - /api/v1/mercadopago - Payment processing
 * - /api/v1/users - User management
 * - /api/v1/chat - Real-time chat functionality
 * - /api/v1/coupons - Coupon management
 * - /api/v1/recruitment - Recruitment process
 * - /api/v1/cron - Scheduled tasks
 * - /api/v1/dashboard - Dashboard data
 * - /api/v1/sessions - Session management
 * - /api/v1/evaluation - Evaluation system
 * - /api/v1/transaction - Transaction history
 * - /api/v1/scripts - Utility scripts
 * 
 * @module routes
 * @requires express - Web framework
 * @requires ./appointments - Appointment routes
 * @requires ./auth - Authentication routes
 * @requires ./specialist - Specialist routes
 * @requires ./mercadopago - Payment routes
 * @requires ./user - User routes
 * @requires ./chat - Chat routes
 * @requires ./coupon - Coupon routes
 * @requires ./recruitment - Recruitment routes
 * @requires ./cron - Cron routes
 * @requires ./dashboard - Dashboard routes
 * @requires ./sessions - Session routes
 * @requires ./evaluation - Evaluation routes
 * @requires ./transaction - Transaction routes
 * @requires ./scripts - Script routes
 * 
 * @example
 * // Register routes with Express app
 * const express = require('express')
 * const app = express()
 * const routes = require('./routes')
 * routes(app)
 * 
 * @throws {Error} If route registration fails
 * @throws {Error} If required route modules are missing
 */

'use strict'

// Import all route modules
import appointmentsRouter from './appointments' // Appointment management routes
import authRoutes from './auth' // Authentication routes
import specialistsRouter from './specialist' // Specialist management routes
import mercadopagoRouter from './mercadopago' // Payment processing routes
import userRoutes from './user' // User management routes
import chatRouter from './chat' // Chat functionality routes
import couponRouter from './coupon' // Coupon management routes
import recruitmentRouter from './recruitment' // Recruitment process routes
import cronRouter from './cron' // Scheduled task routes
import dashboardRouter from './dashboard' // Dashboard data routes
import sessionsRouter from './sessions' // Session management routes
import evaluationRouter from './evaluation' // Evaluation system routes
import transactionRouter from './transaction' // Transaction history routes
import scriptsRouter from './scripts' // Utility script routes

/**
 * API version prefix for all routes
 * @constant {string}
 */
const apiVersion = '/api/v1'

/**
 * Registers all API routes with the Express application
 * 
 * @param {Express} app - The Express application instance
 * @throws {Error} If route registration fails
 * 
 * @example
 * // Register routes
 * const app = express()
 * routes(app)
 * 
 * // Access routes
 * GET /api/v1/appointments
 * POST /api/v1/auth/login
 * GET /api/v1/specialists
 */
export default app => {
	// Register all routes with the API version prefix
	app.use(apiVersion, appointmentsRouter);
	app.use(apiVersion, authRoutes);
	app.use(apiVersion, chatRouter);
	app.use(apiVersion, couponRouter);
	app.use(apiVersion, mercadopagoRouter);
	app.use(apiVersion, specialistsRouter);
	app.use(apiVersion, recruitmentRouter);
	app.use(apiVersion, userRoutes);
	app.use(apiVersion, cronRouter);
	app.use(apiVersion, dashboardRouter);
	app.use(apiVersion, sessionsRouter);
	app.use(apiVersion, evaluationRouter);
	app.use(apiVersion, transactionRouter);
	app.use(apiVersion, scriptsRouter);

	/**
	 * Health check endpoint
	 * Used for monitoring and load balancer health checks
	 * 
	 * @route GET /health-check
	 * @returns {Object} Status object indicating API health
	 * @returns {boolean} status - Always true if endpoint is reachable
	 */
	app.use('/health-check', (req, res) => res.status(200).json({ status: true }));
};
