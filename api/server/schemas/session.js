/**
 * Session Validation Schemas
 * 
 * This module defines Joi validation schemas for session-related operations.
 * It provides validation rules for creating and managing therapy sessions.
 * 
 * @module schemas/session
 * @requires @hapi/joi - Schema validation library
 */

import Joi from '@hapi/joi'

/**
 * Session validation schemas
 * @type {Object}
 */
const sessionSchema = {
  /**
   * Schema for creating a new session
   * Validates required fields for session creation
   * 
   * @type {Object}
   * @property {Date} date - Session date and time
   * @property {string} title - Session title or description
   * @property {string} specialist - Specialist ID
   * @property {string} client - Client ID
   */
  newSession: Joi.object({
    date: Joi.date().required(),
    title: Joi.string().required(),
    specialist: Joi.string().required(),
    client: Joi.string().required(),
  }),
}

export default Object.freeze(sessionSchema)
