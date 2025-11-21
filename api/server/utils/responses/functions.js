/**
 * Response Functions Utilities
 * 
 * This module provides standardized response functions for the Hablaquí API.
 * It includes functions for creating consistent success and error responses
 * with proper status codes and data formatting.
 * 
 * Features:
 * - Standardized response format
 * - HTTP status code mapping
 * - Response data formatting
 * - Success/error handling
 * - Pagination support
 * 
 * @module utils/responses/functions
 */

'use strict'

/**
 * Standard success response format
 * 
 * @typedef {Object} SuccessResponse
 * @property {boolean} status - Always true for success responses
 * @property {string} message - Success message
 * @property {*} [data] - Response data
 * @property {number} [code] - HTTP status code
 */

/**
 * Creates a standardized success response
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {*} [data] - Response data
 * @param {number} [code=200] - HTTP status code
 * @returns {SuccessResponse} Formatted success response
 * 
 * @example
 * // Send success response with data
 * successResponse(res, 'User created successfully', { id: 1 });
 */
export const successResponse = (res, message, data = null, code = 200) => {
	const response = {
		status: true,
		message,
		code
	}

	if (data !== null) {
		response.data = data
	}

	return res.status(code).json(response)
}

/**
 * Creates a paginated success response
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {Array} data - Response data array
 * @param {number} total - Total number of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {SuccessResponse} Formatted paginated response
 * 
 * @example
 * // Send paginated response
 * paginatedResponse(res, 'Users retrieved', users, 100, 1, 10);
 */
export const paginatedResponse = (res, message, data, total, page, limit) => {
	return successResponse(res, message, {
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
 * Creates a created response (201)
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {*} [data] - Response data
 * @returns {SuccessResponse} Formatted created response
 * 
 * @example
 * // Send created response
 * createdResponse(res, 'Resource created', { id: 1 });
 */
export const createdResponse = (res, message, data = null) => {
	return successResponse(res, message, data, 201)
}

/**
 * Creates a no content response (204)
 * 
 * @param {Object} res - Express response object
 * @returns {Object} Empty response with 204 status code
 * 
 * @example
 * // Send no content response
 * noContentResponse(res);
 */
export const noContentResponse = (res) => {
	return res.status(204).send()
}

/**
 * Creates a bad request response (400)
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Formatted error response
 * 
 * @example
 * // Send bad request response
 * badRequestResponse(res, 'Invalid input');
 */
export const badRequestResponse = (res, message) => {
	return res.status(400).json({
		status: false,
		message,
		code: 400
	})
}

/**
 * Creates an unauthorized response (401)
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Formatted error response
 * 
 * @example
 * // Send unauthorized response
 * unauthorizedResponse(res, 'Authentication required');
 */
export const unauthorizedResponse = (res, message) => {
	return res.status(401).json({
		status: false,
		message,
		code: 401
	})
}

/**
 * Creates a forbidden response (403)
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Formatted error response
 * 
 * @example
 * // Send forbidden response
 * forbiddenResponse(res, 'Insufficient permissions');
 */
export const forbiddenResponse = (res, message) => {
	return res.status(403).json({
		status: false,
		message,
		code: 403
	})
}

/**
 * Creates a not found response (404)
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Formatted error response
 * 
 * @example
 * // Send not found response
 * notFoundResponse(res, 'Resource not found');
 */
export const notFoundResponse = (res, message) => {
	return res.status(404).json({
		status: false,
		message,
		code: 404
	})
}

/**
 * Creates a conflict response (409)
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Formatted error response
 * 
 * @example
 * // Send conflict response
 * conflictResponse(res, 'Resource already exists');
 */
export const conflictResponse = (res, message) => {
	return res.status(409).json({
		status: false,
		message,
		code: 409
	})
}

/**
 * Creates an internal server error response (500)
 * 
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Formatted error response
 * 
 * @example
 * // Send internal server error response
 * serverErrorResponse(res, 'Internal server error');
 */
export const serverErrorResponse = (res, message) => {
	return res.status(500).json({
		status: false,
		message,
		code: 500
	})
}

module.exports = {
	successResponse,
	paginatedResponse,
	createdResponse,
	noContentResponse,
	badRequestResponse,
	unauthorizedResponse,
	forbiddenResponse,
	notFoundResponse,
	conflictResponse,
	serverErrorResponse
}
