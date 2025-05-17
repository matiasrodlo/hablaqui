/**
 * Response Utility Functions
 * 
 * This module provides standardized response functions for the API.
 * It includes functions for creating consistent HTTP responses with proper status codes
 * and data structures.
 * 
 * @module utils/responses/functions
 */

/**
 * Creates a standardized REST API response
 * 
 * @param {Object} data - Response data to be sent
 * @param {number} code - HTTP status code
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with status, API version, and base URL
 * 
 * @example
 * // Send a successful response
 * restResponse({ user: userData }, 200, res);
 */
export const restResponse = (data, code, res) =>
	res.status(code).json({
		...data,
		status: true,
		apiVersion: 'v1',
		baseUrl: process.env.API_URL,
	});

/**
 * Creates a conflict response (409)
 * Used when there's a conflict with the current state of the resource
 * 
 * @param {string} message - Conflict message
 * @returns {Object} Response object with 409 status code
 * 
 * @example
 * // Return conflict response
 * return conflictResponse('User already exists');
 */
export const conflictResponse = message => ({ code: 409, data: { message } })

/**
 * Creates an error response (400)
 * Used in catch blocks to handle errors
 * 
 * @param {Error} e - Error object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with error details
 * 
 * @example
 * // Handle error in catch block
 * catch (error) {
 *   errorResponse(error, res);
 * }
 */
export const errorResponse = (e, res) =>
  res
    .status(400)
    .json({ status: false, error: e.message, description: e.description })

/**
 * Creates a created response (201)
 * Used when a new resource is successfully created
 * 
 * @param {string} message - Success message
 * @param {Object} [data={}] - Additional response data
 * @returns {Object} Response object with 201 status code
 * 
 * @example
 * // Return created response
 * return createdResponse('User created successfully', { userId: newUser.id });
 */
export const createdResponse = (message, data = {}) => ({
  code: 201,
  data: { message, ...data },
})

/**
 * Creates an OK response (200)
 * Used for successful operations
 * 
 * @param {string} message - Success message
 * @param {Object} [data={}] - Additional response data
 * @returns {Object} Response object with 200 status code
 * 
 * @example
 * // Return OK response
 * return okResponse('Operation successful', { result: data });
 */
export const okResponse = (message, data = {}) => ({
  code: 200,
  data: { message, ...data },
})

/**
 * Creates a no content response (204)
 * Used when the operation was successful but there's no content to return
 * 
 * @param {string} message - Success message
 * @param {Object} [data={}] - Additional response data
 * @returns {Object} Response object with 204 status code
 * 
 * @example
 * // Return no content response
 * return noContentResponse('Resource deleted successfully');
 */
export const noContentResponse = (message, data = {}) => ({
  code: 204,
  data: { message, ...data },
})

/**
 * Creates a not found response (404)
 * Used when the requested resource is not found
 * 
 * @param {string} message - Not found message
 * @returns {Object} Response object with 404 status code
 * 
 * @example
 * // Return not found response
 * return notFoundResponse('User not found');
 */
export const notFoundResponse = message => ({ code: 404, data: { message } })
