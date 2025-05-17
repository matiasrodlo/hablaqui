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

// action: acción especifica, ej: test@test.cl actualizo su avatar, test@test.cl recupero su contraseña, test@test.cl solicito un cambio de contraseña
export const actionInfo = (email, action) => `${email} ${action}`

/**
 * Generates a simple action log message
 * Used for specific user actions that don't fit the standard format
 * 
 * @param {string} email - User's email address
 * @param {string} action - Specific action performed
 * 
 * @example
 * // Log a user updating their avatar
 * actionInfo('user@example.com', 'actualizo su avatar');
 * 
 * @example
 * // Log a password recovery request
 * actionInfo('user@example.com', 'solicito un cambio de contraseña');
 * 
 * @returns {string} Formatted action message
 */
