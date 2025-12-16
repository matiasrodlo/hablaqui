/**
 * Creates a standardized response for successful resource creation (201)
 * 
 * @param {string} keyName - Key name for the response data
 * @param {*} data - Data to be included in the response
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with 201 status code
 * 
 * @example
 * // Send created response
 * createdResponse('user', userData, res);
 */
/* Keyname must be a string */
export const createdResponse = (keyName, data, res) =>
  res.status(201).json({ status: true, [keyName]: data })
