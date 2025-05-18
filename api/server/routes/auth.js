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

// Authentication Routes
// This file defines all authentication-related routes for the API

/**
 * @route POST /auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post(
  '/auth/register',
  validation(authSchema.register, 'body'),
  authController.register
)

/**
 * @route POST /auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
authRouter.post(
  '/auth/login',
  [validation(authSchema.login, 'body'), passport.authenticate('local')],
  authController.login
)

/**
 * @route POST /auth/refresh-token
 * @desc Get a new access token using refresh token
 * @access Public
 */
authRouter.post('/auth/refresh-token', validation(authSchema.refreshToken, 'body'), authController.refreshToken)

/**
 * @route POST /auth/forgot-password
 * @desc Send password reset email
 * @access Public
 */
authRouter.post('/auth/forgot-password', validation(authSchema.forgotPassword, 'body'), authController.forgotPassword)

/**
 * @route POST /auth/reset-password
 * @desc Reset password using token
 * @access Public
 */
authRouter.post('/auth/reset-password', validation(authSchema.resetPassword, 'body'), authController.resetPassword)

/**
 * @route GET /auth/verify-email/:token
 * @desc Verify user's email address
 * @access Public
 */
authRouter.get('/auth/verify-email/:token', authController.verifyEmail)

/**
 * @route POST /auth/logout
 * @desc Logout user and invalidate tokens
 * @access Private
 */
authRouter.post('/auth/logout', authController.logout)

export default authRouter
