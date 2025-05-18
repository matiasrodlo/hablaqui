/**
 * GET Response Utilities
 * 
 * This module provides standardized GET response functions for the Hablaquí API.
 * It includes functions for creating consistent responses for GET requests
 * with proper status codes and data formatting.
 * 
 * Features:
 * - Standardized GET response format
 * - HTTP status code mapping
 * - Response data formatting
 * - Success/error handling
 * - Pagination support
 * 
 * @module utils/responses/getResponse
 */

'use strict'

/**
 * Standard GET response format
 * 
 * @typedef {Object} GetResponse
 * @property {boolean} status - Always true for success responses
 * @property {string} message - Success message
 * @property {*} [data] - Response data
 * @property {number} [code] - HTTP status code
 */

/**
 * Creates a standardized GET response
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {*} [data] - Response data
 * @returns {GetResponse} Formatted GET response
 * 
 * @example
 * // Send GET response with data
 * getResponse(res, 'Data retrieved successfully', { items: [] });
 */
export const getResponse = (res, message, data = null) => {
  const response = {
    status: true,
    message,
    code: 200
  }

  if (data !== null) {
    response.data = data
  }

  return res.status(200).json(response)
}

/**
 * Creates a paginated GET response
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Array} data - Response data array
 * @param {number} total - Total number of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {GetResponse} Formatted paginated GET response
 * 
 * @example
 * // Send paginated GET response
 * getPaginatedResponse(res, 'Items retrieved', items, 100, 1, 10);
 */
export const getPaginatedResponse = (res, message, data, total, page, limit) => {
  return getResponse(res, message, {
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  })
}

/**
 * Creates a not found GET response
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Formatted error response
 * 
 * @example
 * // Send not found GET response
 * getNotFoundResponse(res, 'Resource not found');
 */
export const getNotFoundResponse = (res, message) => {
  return res.status(404).json({
    status: false,
    message,
    code: 404
  })
}

/**
 * Creates a bad request GET response
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Formatted error response
 * 
 * @example
 * // Send bad request GET response
 * getBadRequestResponse(res, 'Invalid query parameters');
 */
export const getBadRequestResponse = (res, message) => {
  return res.status(400).json({
    status: false,
    message,
    code: 400
  })
}

/**
 * Creates an unauthorized GET response
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Formatted error response
 * 
 * @example
 * // Send unauthorized GET response
 * getUnauthorizedResponse(res, 'Authentication required');
 */
export const getUnauthorizedResponse = (res, message) => {
  return res.status(401).json({
    status: false,
    message,
    code: 401
  })
}

/**
 * Creates a forbidden GET response
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Formatted error response
 * 
 * @example
 * // Send forbidden GET response
 * getForbiddenResponse(res, 'Insufficient permissions');
 */
export const getForbiddenResponse = (res, message) => {
  return res.status(403).json({
    status: false,
    message,
    code: 403
  })
}

/**
 * Creates an internal server error GET response
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Formatted error response
 * 
 * @example
 * // Send internal server error GET response
 * getServerErrorResponse(res, 'Internal server error');
 */
export const getServerErrorResponse = (res, message) => {
  return res.status(500).json({
    status: false,
    message,
    code: 500
  })
}

module.exports = {
  getResponse,
  getPaginatedResponse,
  getNotFoundResponse,
  getBadRequestResponse,
  getUnauthorizedResponse,
  getForbiddenResponse,
  getServerErrorResponse
}
