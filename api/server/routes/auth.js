/**
 * Authentication Router
 * 
 * This module defines the routes for user authentication and authorization in the Hablaquí API.
 * It handles user login, registration, password management, and email verification.
 * 
 * Key Features:
 * - User authentication with JWT
 * - Password-based login
 * - User registration
 * - Password recovery
 * - Email verification
 * - Session management
 * - Input validation
 * - Security middleware
 * 
 * Security Features:
 * - JWT token authentication
 * - Password hashing
 * - Input sanitization
 * - Rate limiting
 * - Session invalidation
 * - Email verification
 * 
 * @module routes/auth
 * @requires express - Web framework
 * @requires passport - Authentication middleware
 * @requires ../controllers/auth - Authentication controller
 * @requires ../middleware/validation - Input validation middleware
 * @requires ../schemas/auth - Authentication validation schemas
 * 
 * @example
 * // Login request
 * POST /api/v1/auth/login
 * {
 *   "email": "user@example.com",
 *   "password": "securepassword"
 * }
 * 
 * // Register request
 * POST /api/v1/auth/register
 * {
 *   "email": "newuser@example.com",
 *   "password": "securepassword"
 * }
 * 
 * @throws {401} Unauthorized - Invalid credentials
 * @throws {400} Bad Request - Invalid input
 * @throws {404} Not Found - Resource not found
 * @throws {409} Conflict - Email already exists
 * 
 * @see {@link https://jwt.io/|JWT Documentation}
 * @see {@link http://www.passportjs.org/|Passport.js Documentation}
 */

'use strict'

import { Router } from 'express'
import passport from 'passport'
import authController from '../controllers/auth'
import validation from '../middleware/validation'
import authSchema from '../schemas/auth'

// Initialize Express router
const authRouter = Router()

/**
 * User Login
 * Authenticates a user and returns a JWT token
 * 
 * @route POST /api/v1/auth/login
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @returns {Object} Response containing:
 *   - token: JWT authentication token
 *   - user: User object with sensitive data removed
 * @throws {401} If authentication fails
 * @throws {400} If validation fails
 * 
 * @example
 * // Request
 * POST /api/v1/auth/login
 * {
 *   "email": "user@example.com",
 *   "password": "securepassword"
 * }
 * 
 * // Response
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIs...",
 *   "user": {
 *     "id": "123",
 *     "email": "user@example.com",
 *     "role": "user"
 *   }
 * }
 */
authRouter.post(
  '/auth/login',
  [validation(authSchema.login, 'body'), passport.authenticate('local')],
  authController.login
)

/**
 * User Logout
 * Invalidates the current user session
 * 
 * @route POST /api/v1/auth/logout
 * @returns {Object} Success message
 * @throws {401} If not authenticated
 * 
 * @example
 * // Request
 * POST /api/v1/auth/logout
 * 
 * // Response
 * {
 *   "message": "Successfully logged out"
 * }
 */
authRouter.post('/auth/logout', authController.logout)

/**
 * User Registration
 * Creates a new user account
 * 
 * @route POST /api/v1/auth/register
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @returns {Object} Response containing:
 *   - token: JWT authentication token
 *   - user: Newly created user object
 * @throws {400} If validation fails
 * @throws {409} If email already exists
 * 
 * @example
 * // Request
 * POST /api/v1/auth/register
 * {
 *   "email": "newuser@example.com",
 *   "password": "securepassword"
 * }
 * 
 * // Response
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIs...",
 *   "user": {
 *     "id": "123",
 *     "email": "newuser@example.com",
 *     "role": "user"
 *   }
 * }
 */
authRouter.post(
  '/auth/register',
  validation(authSchema.register, 'body'),
  authController.register
)

/**
 * Password Recovery Request
 * Sends a password recovery email to the specified address
 * 
 * @route GET /api/v1/auth/send-password-recover/:email
 * @param {string} req.params.email - Email address for password recovery
 * @returns {Object} Success message
 * @throws {404} If email not found
 * 
 * @example
 * // Request
 * GET /api/v1/auth/send-password-recover/user@example.com
 * 
 * // Response
 * {
 *   "message": "Password recovery email sent"
 * }
 */
authRouter.get(
  '/auth/send-password-recover/:email',
  authController.sendPasswordRecover
)

/**
 * Change User Password
 * Updates the authenticated user's password
 * 
 * @route PUT /api/v1/auth/user/password
 * @param {Object} req.user - Authenticated user object
 * @param {string} req.body.password - New password
 * @returns {Object} Success message
 * @throws {401} If not authenticated
 * @throws {400} If validation fails
 * 
 * @example
 * // Request
 * PUT /api/v1/auth/user/password
 * {
 *   "password": "newsecurepassword"
 * }
 * 
 * // Response
 * {
 *   "message": "Password updated successfully"
 * }
 */
authRouter.put(
  '/auth/user/password',
  passport.authenticate('jwt'),
  authController.changeUserPassword
)

/**
 * Email Verification
 * Verifies a user's email address
 * 
 * @route PUT /api/v1/auth/user/verification/:id
 * @param {string} req.params.id - User ID to verify
 * @param {Object} req.user - Authenticated user object
 * @returns {Object} Updated user object
 * @throws {401} If not authenticated
 * @throws {404} If user not found
 * 
 * @example
 * // Request
 * PUT /api/v1/auth/user/verification/123
 * 
 * // Response
 * {
 *   "id": "123",
 *   "email": "user@example.com",
 *   "verified": true
 * }
 */
authRouter.put(
  '/auth/user/verification/:id',
  passport.authenticate('jwt'),
  authController.changeVerifiedStatus
)

export default authRouter
