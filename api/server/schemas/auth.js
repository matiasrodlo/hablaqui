/**
 * Authentication Validation Schemas
 * 
 * This module defines Joi validation schemas for authentication-related operations.
 * It provides validation rules for user registration, login, and temporary registration.
 * 
 * @module schemas/auth
 * @requires @hapi/joi - Schema validation library
 */

import Joi from '@hapi/joi'

/**
 * Authentication validation schemas
 * @type {Object}
 */
const authSchema = {
  /**
   * Schema for user registration
   * Validates required fields for new user registration
   * 
   * @type {Object}
   * @property {string} name - User's first name (3-100 chars)
   * @property {string} lastName - User's last name (3-100 chars)
   * @property {string} role - User's role (optional)
   * @property {string} profession - User's profession (optional)
   * @property {string} rut - Chilean national ID (optional)
   * @property {string} email - Valid email address
   * @property {string} password - Password (min 5 chars)
   * @property {string} inviteCode - Registration invite code (optional)
   * @property {string} phone - Phone number (optional)
   */
  register: Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .required(),
    lastName: Joi.string()
      .min(3)
      .max(100)
      .required(),
    role: Joi.string()
      .min(3)
      .max(100)
      .allow(''),
    profession: Joi.string().allow(''),
    rut: Joi.string()
      .min(3)
      .max(100)
      .allow(''),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(5)
      .max(100)
      .required(),
    inviteCode: Joi.string().allow(''),
    phone: Joi.string().allow(''),
  }),

  /**
   * Schema for user login
   * Validates required fields for user authentication
   * 
   * @type {Object}
   * @property {string} email - Valid email address
   * @property {string} password - Password (min 5 chars)
   */
  login: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(5)
      .max(100)
      .required(),
  }),

  /**
   * Schema for temporary user registration
   * Used for quick registration with minimal information
   * 
   * @type {Object}
   * @property {string} name - User's first name (3-100 chars)
   * @property {string} email - Valid email address
   * @property {string} password - Password (min 5 chars)
   * @property {number} phone - Phone number
   * @property {string} role - User's role
   * @property {boolean} analyst - Analyst status flag
   * @property {string} idPerson - Person ID reference
   * @property {string} company - Company name (optional)
   */
  registerTemp: Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(5)
      .max(100)
      .required(),
    phone: Joi.number().required(),
    role: Joi.string().required(),
    analyst: Joi.boolean(),
    idPerson: Joi.string(),
    company: Joi.string()
      .optional()
      .allow(''),
  }),
}

export default Object.freeze(authSchema)
