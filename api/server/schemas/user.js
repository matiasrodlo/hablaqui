/**
 * User Validation Schemas
 * 
 * This module defines Joi validation schemas for user-related operations.
 * It provides validation rules for user profile updates, password changes,
 * and user management operations.
 * 
 * @module schemas/user
 * @requires @hapi/joi - Schema validation library
 * @requires joi-objectid - MongoDB ObjectId validation
 */

import Joi from '@hapi/joi'
import joiObjectId from 'joi-objectid'
Joi.objectId = joiObjectId(Joi)

/**
 * User validation schemas
 * @type {Object}
 */
const userSchema = {
  /**
   * Schema for updating user profile
   * Validates fields for profile updates
   * 
   * @type {Object}
   * @property {string} _id - User ID (optional)
   * @property {string} avatar - Profile picture URL (optional)
   * @property {string} avatarThumbnail - Thumbnail URL (optional)
   * @property {string} birthDate - Date of birth (optional)
   * @property {string} direction - Address (optional)
   * @property {string} email - Email address (optional)
   * @property {string} finishedSessions - Completed sessions (optional)
   * @property {boolean} google - Google account flag (optional)
   * @property {string} googleId - Google account ID (optional)
   * @property {boolean} hasPaid - Payment status
   * @property {string} inviteCode - Invitation code (optional)
   * @property {string} lastName - Last name (optional)
   * @property {string} name - First name (optional)
   * @property {string} phone - Phone number (optional)
   * @property {Array} plan - User's subscription plan
   * @property {string} specialist - Specialist reference (optional)
   * @property {boolean} onboarding - Onboarding status
   * @property {boolean} isVerified - Email verification status
   * @property {string} role - User role (optional)
   * @property {string} rut - Chilean national ID (optional)
   * @property {Array} sessions - User's sessions
   * @property {boolean} state - Account state (optional)
   * @property {string} timeZone - User's timezone (optional)
   * @property {string} gender - Gender (optional)
   * @property {string} profession - Profession (optional)
   */
  updateProfile: Joi.object({
    _id: Joi.string().allow(''),
    avatar: Joi.string().allow(''),
    avatarThumbnail: Joi.string().allow(''),
    birthDate: Joi.string().allow(''),
    direction: Joi.string().allow(''),
    email: Joi.string().allow(''),
    finishedSessions: Joi.string().allow(''),
    google: Joi.boolean().allow(''),
    googleId: Joi.string().allow(''),
    hasPaid: Joi.boolean(),
    inviteCode: Joi.string().allow(''),
    lastName: Joi.string().allow(''),
    name: Joi.string().allow(''),
    phone: Joi.string().allow(''),
    plan: Joi.array(),
    specialist: Joi.string().allow(''),
    onboarding: Joi.boolean(),
    isVerified: Joi.boolean(),
    role: Joi.string().allow(''),
    rut: Joi.string().allow(''),
    sessions: Joi.array(),
    state: Joi.boolean().allow(''),
    timeZone: Joi.string().allow(),
    gender: Joi.string().allow(),
    profession: Joi.string().allow(),
  }).min(1),

  /**
   * Schema for updating user password
   * Validates fields for password changes
   * 
   * @type {Object}
   * @property {string} oldPassword - Current password (min 5 chars)
   * @property {string} newPassword - New password (min 5 chars)
   */
  updatePassword: Joi.object({
    oldPassword: Joi.string()
      .min(5)
      .max(100)
      .required(),
    newPassword: Joi.string()
      .min(5)
      .max(100)
      .required(),
  }),

  /**
   * Schema for updating user's subscription plan
   * 
   * @type {Object}
   * @property {string} newPlan - New plan identifier
   */
  updatePlan: Joi.object({
    newPlan: Joi.string().required(),
  }),

  /**
   * Schema for updating user's specialist
   * 
   * @type {Object}
   * @property {Object} newSpecialist - New specialist information
   */
  updateSpecialist: Joi.object({
    newSpecialist: Joi.object().required(),
  }),

  /**
   * Schema for updating user's avatar
   * 
   * @type {Object}
   * @property {string} newAvatar - New avatar URL
   */
  updateAvatar: Joi.object({
    newAvatar: Joi.string().required(),
  }),

  /**
   * Schema for person ID validation
   * 
   * @type {Object}
   * @property {ObjectId} idPerson - MongoDB ObjectId
   */
  idPerson: Joi.object({
    idPerson: Joi.objectId(),
  }),

  /**
   * Schema for sharing user information
   * 
   * @type {Object}
   * @property {string} email - Recipient's email address
   */
  share: Joi.object({
    email: Joi.string()
      .email()
      .required(),
  }),

  /**
   * Schema for creating new user by specialist
   * 
   * @type {Object}
   * @property {string} email - User's email address
   * @property {string} name - User's first name
   * @property {string} lastName - User's last name (optional)
   * @property {string} rut - Chilean national ID (optional)
   * @property {string} phone - Phone number (optional)
   * @property {ObjectId} invitedBy - Specialist's ID who invited
   */
  newUserBySpec: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    name: Joi.string().required(),
    lastName: Joi.string().allow(''),
    rut: Joi.string().allow(''),
    phone: Joi.string().allow(''),
    invitedBy: Joi.objectId(),
  }),
}

export default Object.freeze(userSchema)
