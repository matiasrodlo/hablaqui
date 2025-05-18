/**
 * Error Message Evaluator
 * 
 * This module provides a function to extract meaningful error messages from various error response formats.
 * It handles different error response structures and falls back to the error message if no structured response is found.
 * 
 * @module utils/errors/evaluateErrorReturn
 */

/**
 * Evaluates an error object and returns the most appropriate error message
 * 
 * @param {Error} err - Error object to evaluate
 * @returns {string} Extracted error message
 * 
 * @example
 * // Get error message from API response
 * const message = evaluateErrorReturn(error);
 * // Returns: "Invalid input" or "Server error" etc.
 */
export default (err) => {
  if (err.response && err.response.data.message) {
    return err.response.data.message
  } else if (err.response && err.response.data.description) {
    return err.response.data.description
  } else if (err.response && err.response.data.error) {
    return err.response.data.error
  } else {
    return err.message
  }
}
