/**
 * Authentication Router
 * 
 * This module defines the routes for user authentication and authorization in the Hablaquí API.
 * It handles user login, registration, password management, and email verification.
 * 
 * @module routes/auth
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
 */
authRouter.put(
  '/auth/user/verification/:id',
  passport.authenticate('jwt'),
  authController.changeVerifiedStatus
)

export default authRouter
