/**
 * API Routes Configuration
 * 
 * This file serves as the central router configuration for the Hablaquí API.
 * It imports and registers all route modules under the /api/v1 prefix.
 * 
 * @module routes
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

// API version prefix for all routes
const apiVersion = '/api/v1'

/**
 * Registers all API routes with the Express application
 * 
 * @param {Express} app - The Express application instance
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

	// Health check endpoint
	app.use('/health-check', (req, res) => res.status(200).json({ status: true }));
};
