/**
 * Logger Message Utilities
 * 
 * This module provides functions for generating standardized log messages
 * for different types of user actions and system events.
 * 
 * @module utils/logger/infoMessages
 */

// actions: actualizo,elimino,obtuvo, registro
// pluralization: un,todos los
// model: el modelo que estamos usando en esa funcion
// data: el objeto que manipulamos, poner undefined en caso de no usar este parametro
// filter: sirve para especificar que se realizo una accion con un filtro o variable adicional
// ej: test@test.cl obtuvo todos los lodging con placeId
// con 'variable'
export const infoMessages = (
  email,
  action,
  pluralization,
  model,
  data,
  filter
) => {
  // inforMessages es un objeto que contiene funciones que retornan strings
  if (filter && data) {
    return `${email} ${action} ${pluralization} ${model} ${JSON.stringify(
      data
    )} ${filter}`
  } else if (data) {
    return `${email} ${action} ${pluralization} ${model} ${JSON.stringify(
      data
    )}`
  } else if (filter) {
    return `${email} ${action} ${pluralization} ${model} ${filter}`
  } else {
    return `${email} ${action} ${pluralization} ${model}`
  }
}

/**
 * Generates a structured log message for user actions
 * 
 * @param {string} email - User's email address
 * @param {string} action - Action performed (e.g., 'actualizo', 'elimino', 'obtuvo', 'registro')
 * @param {string} pluralization - Article for pluralization (e.g., 'un', 'todos los')
 * @param {string} model - Model or resource being acted upon
 * @param {Object} [data] - Optional data object related to the action
 * @param {string} [filter] - Optional filter or additional context
 * 
 * @example
 * // Log a user retrieving all sessions
 * infoMessages('user@example.com', 'obtuvo', 'todos los', 'sessions');
 * 
 * @example
 * // Log a user updating a specific session with data
 * infoMessages('user@example.com', 'actualizo', 'un', 'session', { id: 123 }, 'with status completed');
 * 
 * @returns {string} Formatted log message
 */

// Logger Info Messages
// This file provides standardized message templates for logging

/**
 * Action Info Message Generator
 * Creates a standardized message for user actions
 * 
 * @param {string} email - User's email address
 * @param {string} action - Action performed by the user
 * @returns {string} Formatted action message
 * 
 * @example
 * // Log user registration
 * const message = actionInfo('user@example.com', 'registered a new account');
 * // Returns: "user@example.com registered a new account"
 */
export const actionInfo = (email, action) => `${email} ${action}`;

/**
 * Error Info Message Generator
 * Creates a standardized message for error events
 * 
 * @param {string} email - User's email address
 * @param {string} error - Error description
 * @returns {string} Formatted error message
 * 
 * @example
 * // Log authentication error
 * const message = errorInfo('user@example.com', 'failed to authenticate');
 * // Returns: "user@example.com failed to authenticate"
 */
export const errorInfo = (email, error) => `${email} ${error}`;

/**
 * System Info Message Generator
 * Creates a standardized message for system events
 * 
 * @param {string} component - System component name
 * @param {string} event - System event description
 * @returns {string} Formatted system message
 * 
 * @example
 * // Log database connection
 * const message = systemInfo('Database', 'connected successfully');
 * // Returns: "Database connected successfully"
 */
export const systemInfo = (component, event) => `${component} ${event}`;

/**
 * Security Info Message Generator
 * Creates a standardized message for security events
 * 
 * @param {string} email - User's email address
 * @param {string} event - Security event description
 * @returns {string} Formatted security message
 * 
 * @example
 * // Log password change
 * const message = securityInfo('user@example.com', 'changed password');
 * // Returns: "user@example.com changed password"
 */
export const securityInfo = (email, event) => `${email} ${event}`;

/**
 * Performance Info Message Generator
 * Creates a standardized message for performance metrics
 * 
 * @param {string} component - System component name
 * @param {string} metric - Performance metric description
 * @param {number} value - Metric value
 * @param {string} unit - Unit of measurement
 * @returns {string} Formatted performance message
 * 
 * @example
 * // Log API response time
 * const message = performanceInfo('API', 'response time', 150, 'ms');
 * // Returns: "API response time: 150ms"
 */
export const performanceInfo = (component, metric, value, unit) =>
  `${component} ${metric}: ${value}${unit}`;

/**
 * Database Info Message Generator
 * Creates a standardized message for database operations
 * 
 * @param {string} operation - Database operation type
 * @param {string} collection - Collection name
 * @param {string} details - Operation details
 * @returns {string} Formatted database message
 * 
 * @example
 * // Log document creation
 * const message = databaseInfo('create', 'users', 'new user document');
 * // Returns: "Database create operation on users: new user document"
 */
export const databaseInfo = (operation, collection, details) =>
  `Database ${operation} operation on ${collection}: ${details}`;

/**
 * API Info Message Generator
 * Creates a standardized message for API requests
 * 
 * @param {string} method - HTTP method
 * @param {string} endpoint - API endpoint
 * @param {string} status - Response status
 * @returns {string} Formatted API message
 * 
 * @example
 * // Log API request
 * const message = apiInfo('GET', '/users', '200');
 * // Returns: "API GET /users: 200"
 */
export const apiInfo = (method, endpoint, status) =>
  `API ${method} ${endpoint}: ${status}`;

module.exports = {
  actionInfo,
  errorInfo,
  systemInfo,
  securityInfo,
  performanceInfo,
  databaseInfo,
  apiInfo
};
