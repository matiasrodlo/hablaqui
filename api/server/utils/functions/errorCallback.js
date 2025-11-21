/**
 * Error Callback Utility
 * 
 * This module provides a standardized error handling function that logs errors
 * and sends appropriate error responses to the client.
 * 
 * @module utils/functions/errorCallback
 */

import { logError } from '../../config/pino'
import { errorResponse } from '../responses/errorResponse'

/**
 * Standard Error Callback
 * Handles errors and sends appropriate response
 * 
 * @param {Error} error - Error object
 * @param {Object} res - Express response object
 * @param {string} [customMessage] - Optional custom error message
 * @returns {Object} Error response
 * 
 * @example
 * // Handle error in catch block
 * catch (error) {
 *   errorCallback(error, res);
 * }
 * 
 * @example
 * // Handle error with custom message
 * catch (error) {
 *   errorCallback(error, res, 'Failed to process request');
 * }
 */
const errorCallback = (error, res, customMessage) => {
  // Log error details
  logError('Error details:', {
    message: error.message,
    stack: error.stack,
    customMessage
  });

  // Determine error status code
  const statusCode = error.statusCode || 500;

  // Send error response
  res.status(statusCode).json({
    status: 'error',
    message: customMessage || error.message || 'Internal server error',
    code: statusCode
  });
};

/**
 * Validation Error Callback
 * Handles validation errors specifically
 * 
 * @param {Error} error - Validation error object
 * @param {Object} res - Express response object
 * @returns {Object} Validation error response
 * 
 * @example
 * // Handle validation error
 * catch (error) {
 *   if (error.name === 'ValidationError') {
 *     validationErrorCallback(error, res);
 *   }
 * }
 */
const validationErrorCallback = (error, res) => {
  // Log validation error
  logError('Validation error:', {
    message: error.message,
    details: error.details
  });

  // Send validation error response
  res.status(400).json({
    status: 'error',
    message: 'Validation failed',
    errors: error.details || error.message,
    code: 400
  });
};

/**
 * Authentication Error Callback
 * Handles authentication errors specifically
 * 
 * @param {Error} error - Authentication error object
 * @param {Object} res - Express response object
 * @returns {Object} Authentication error response
 * 
 * @example
 * // Handle authentication error
 * catch (error) {
 *   if (error.name === 'AuthenticationError') {
 *     authErrorCallback(error, res);
 *   }
 * }
 */
const authErrorCallback = (error, res) => {
  // Log authentication error
  logError('Authentication error:', {
    message: error.message
  });

  // Send authentication error response
  res.status(401).json({
    status: 'error',
    message: 'Authentication failed',
    code: 401
  });
};

module.exports = {
  errorCallback,
  validationErrorCallback,
  authErrorCallback
};
