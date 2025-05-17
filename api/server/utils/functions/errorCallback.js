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
 * Handles errors by logging them and sending an error response
 * 
 * @param {Error} err - The error object to handle
 * @param {Object} res - Express response object
 * 
 * @example
 * // Use in catch block
 * try {
 *   // Some operation
 * } catch (error) {
 *   errorCallback(error, res);
 * }
 * 
 * @example
 * // Use in Promise catch
 * someAsyncOperation()
 *   .catch(error => errorCallback(error, res));
 * 
 * @returns {void} Sends error response to client
 */
export const errorCallback = (err, res) => {
  logError(err)
  errorResponse(err, res)
}
