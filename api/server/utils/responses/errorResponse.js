/**
 * Error Response Utilities
 * 
 * This module provides standardized error response functions for the Hablaquí API.
 * It includes functions for creating consistent error responses with proper status codes
 * and error message formatting.
 * 
 * Features:
 * - Standardized error response format
 * - HTTP status code mapping
 * - Error message formatting
 * - Error logging integration
 * - Custom error types
 * 
 * @module utils/responses/errorResponse
 * @requires ../config/pino - Logging configuration
 */

'use strict'

import { logError } from '../../config/pino'

/**
 * Standard error response format
 * 
 * @typedef {Object} ErrorResponse
 * @property {boolean} status - Always false for error responses
 * @property {string} message - Error message
 * @property {number} code - HTTP status code
 * @property {string} [stack] - Error stack trace (development only)
 */

/**
 * Creates a standardized error response
 * 
 * @param {Error} error - Error object
 * @param {Object} res - Express response object
 * @param {number} [statusCode=500] - HTTP status code
 * @returns {ErrorResponse} Formatted error response
 * 
 * @example
 * // Send error response
 * errorResponse(new Error('Invalid input'), res, 400);
 */
export const errorResponse = (error, res, statusCode = 500) => {
  // Log error details
  logError('Error details:', {
    message: error.message,
    stack: error.stack,
    statusCode
  })

  // Create response object
  const response = {
    status: false,
    message: error.message || 'Internal server error',
    code: statusCode
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack
  }

  return res.status(statusCode).json(response)
}

/**
 * Creates a validation error response
 * 
 * @param {Error} error - Validation error object
 * @param {Object} res - Express response object
 * @returns {ErrorResponse} Formatted validation error response
 * 
 * @example
 * // Send validation error
 * validationErrorResponse(new Error('Invalid email format'), res);
 */
export const validationErrorResponse = (error, res) => {
  return errorResponse(error, res, 400)
}

/**
 * Creates an authentication error response
 * 
 * @param {Error} error - Authentication error object
 * @param {Object} res - Express response object
 * @returns {ErrorResponse} Formatted authentication error response
 * 
 * @example
 * // Send authentication error
 * authErrorResponse(new Error('Invalid credentials'), res);
 */
export const authErrorResponse = (error, res) => {
  return errorResponse(error, res, 401)
}

/**
 * Creates an authorization error response
 * 
 * @param {Error} error - Authorization error object
 * @param {Object} res - Express response object
 * @returns {ErrorResponse} Formatted authorization error response
 * 
 * @example
 * // Send authorization error
 * forbiddenErrorResponse(new Error('Insufficient permissions'), res);
 */
export const forbiddenErrorResponse = (error, res) => {
  return errorResponse(error, res, 403)
}

/**
 * Creates a not found error response
 * 
 * @param {Error} error - Not found error object
 * @param {Object} res - Express response object
 * @returns {ErrorResponse} Formatted not found error response
 * 
 * @example
 * // Send not found error
 * notFoundErrorResponse(new Error('User not found'), res);
 */
export const notFoundErrorResponse = (error, res) => {
  return errorResponse(error, res, 404)
}

/**
 * Creates a conflict error response
 * 
 * @param {Error} error - Conflict error object
 * @param {Object} res - Express response object
 * @returns {ErrorResponse} Formatted conflict error response
 * 
 * @example
 * // Send conflict error
 * conflictErrorResponse(new Error('Resource already exists'), res);
 */
export const conflictErrorResponse = (error, res) => {
  return errorResponse(error, res, 409)
}

module.exports = {
  errorResponse,
  validationErrorResponse,
  authErrorResponse,
  forbiddenErrorResponse,
  notFoundErrorResponse,
  conflictErrorResponse
}
