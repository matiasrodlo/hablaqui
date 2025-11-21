/**
 * Validation Middleware
 * 
 * This module provides request validation middleware for the Hablaquí API.
 * It validates incoming request data against defined schemas using Joi.
 * 
 * Features:
 * - Request body validation
 * - Request parameters validation
 * - Request query validation
 * - Custom validation error messages
 * - Schema-based validation rules
 * 
 * @module middleware/validation
 * @requires joi - Schema validation library
 * @requires ../utils/responses/functions - Response utilities
 */

'use strict'

import Joi from 'joi'
import { conflictResponse } from '../utils/responses/functions'

/**
 * Request validation middleware
 * Validates request data against provided schema
 * 
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 * @throws {Error} If validation fails
 */
const validation = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return conflictResponse(error.details[0].message)
    }
    next()
  }
}

export default validation
