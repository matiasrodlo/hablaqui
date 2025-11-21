/**
 * Authentication Controller
 * 
 * This module handles all authentication and authorization operations in the Hablaquí API.
 * It provides endpoints for user registration, login, logout, password management,
 * and account verification.
 * 
 * Features:
 * - User registration with email/password
 * - JWT-based authentication
 * - Password recovery via email
 * - Account verification
 * - Session management
 * 
 * @module controllers/auth
 * @requires ../services/auth - Authentication service
 * @requires ../utils/responses/functions - Response utilities
 * @requires ../utils/functions/errorCallback - Error handling
 * @requires jsonwebtoken - JWT handling
 * @requires bcryptjs - Password hashing
 * @requires ../models/user - User model
 * @requires ../config/pino - Logging
 * @requires ../services/email - Email service
 * @requires ../config/config - Configuration
 */

'use strict'
import authService from '../services/auth'
import { restResponse } from '../utils/responses/functions'
import { errorCallback } from '../utils/functions/errorCallback'

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/user');
const { logError } = require('../config/pino');
const { sendEmail } = require('../services/email');
const config = require('../config/config');

/**
 * Authentication controller object containing all auth-related operations
 * @type {Object}
 */
const authController = {
  /**
   * Register a new user
   * Creates a new user account with the provided information
   * 
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - User registration data
   * @param {Object} res - Express response object
   * @returns {Object} Response with registration status
   * @throws {Error} If registration fails
   */
  async register(req, res) {
    try {
      const { body } = req
      const { data, code } = await authService.register(body, res)
      return restResponse(data, code, res)
    } catch (error) {
      errorCallback(error, res, 'Ha ocurrido un error en el registro')
    }
  },

  /**
   * Authenticate user and generate JWT
   * Validates credentials and creates a new session
   * 
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {Object} res - Express response object
   * @returns {Object} Response with JWT token
   * @throws {Error} If authentication fails
   */
  async login(req, res) {
    try {
      const { user } = req
      const { data, code } = await authService.login(user)
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res)
    }
  },

  /**
   * End user session
   * Invalidates the current session and JWT token
   * 
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {Object} res - Express response object
   * @returns {Object} Response with logout status
   * @throws {Error} If logout fails
   */
  async logout(req, res) {
    try {
      const { user } = req
      const { data, code } = await authService.logout(user)
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res)
    }
  },

  /**
   * Send password recovery email
   * Generates and sends a password reset token
   * 
   * @async
   * @param {Object} req - Express request object
   * @param {string} req.params.email - User's email address
   * @param {Object} res - Express response object
   * @returns {Object} Response with email status
   * @throws {Error} If email sending fails
   */
  async sendPasswordRecover(req, res) {
    try {
      const { email } = req.params
      const { data, code } = await authService.sendPasswordRecover(email)
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res)
    }
  },

  /**
   * Change user password
   * Updates the user's password with a new one
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {string} req.body.password - New password
   * @param {Object} res - Express response object
   * @returns {Object} Response with password change status
   * @throws {Error} If password change fails
   */
  changeUserPassword(req, res) {
    const { password } = req.body
    const user = req.user
    return authService.changeUserPassword(user, password, res)
  },

  /**
   * Change user verification status
   * Updates the user's verified status
   * 
   * @async
   * @param {Object} req - Express request object
   * @param {string} req.params.id - User ID
   * @param {Object} res - Express response object
   * @returns {Object} Response with verification status
   * @throws {Error} If verification fails
   */
  async changeVerifiedStatus(req, res) {
    try {
      const { id } = req.params
      const { data, code } = await authService.changeVerifiedStatus(id)
      return restResponse(data, code, res)
    } catch (error) {
      errorCallback(error, res, 'Ha ocurrido un error al verificar')
    }
  },
}

export default Object.freeze(authController)
