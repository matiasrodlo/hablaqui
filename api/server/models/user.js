/**
 * User Model
 * 
 * This module defines the User schema for the Hablaquí API.
 * It represents user accounts in the system, including both clients and specialists.
 * 
 * @module models/user
 */

'use strict'
import { Schema, model } from 'mongoose'

/**
 * User Schema
 * Defines the structure and validation rules for user documents
 * 
 * @type {Schema}
 */
const userSchema = new Schema(
  {
    /**
     * User's first name
     * @type {String}
     */
    name: {
      type: String,
    },

    /**
     * User's last name
     * @type {String}
     */
    lastName: {
      type: String,
    },

    /**
     * User's RUT (Chilean national ID)
     * @type {String}
     */
    rut: {
      type: String,
    },

    /**
     * User's email address
     * Stored in lowercase and trimmed
     * @type {String}
     */
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    /**
     * User's hashed password
     * @type {String}
     */
    password: {
      type: String,
    },

    /**
     * Invitation code for user registration
     * @type {String}
     */
    inviteCode: {
      type: String,
    },

    /**
     * Google OAuth ID for users who sign in with Google
     * @type {String}
     */
    googleId: {
      type: String,
    },

    /**
     * User's phone number
     * Optional field, trimmed
     * @type {String}
     */
    phone: {
      type: String,
      trim: true,
      required: false,
    },

    /**
     * User's timezone
     * Defaults to Santiago, Chile
     * @type {String}
     */
    timeZone: {
      type: String,
      default: 'America/Santiago',
    },

    /**
     * User's active status
     * @type {Boolean}
     */
    state: {
      type: Boolean,
      default: true,
    },

    /**
     * Email verification status
     * @type {Boolean}
     */
    isVerified: {
      type: Boolean,
      default: false,
    },

    /**
     * URL to user's profile picture
     * @type {String}
     */
    avatar: { 
      type: String, 
      default: '' 
    },

    /**
     * URL to user's profile picture thumbnail
     * @type {String}
     */
    avatarThumbnail: {
      type: String,
    },

    /**
     * Indicates if user signed up with Google
     * @type {Boolean}
     */
    google: {
      type: Boolean,
      default: false,
    },

    /**
     * Indicates if user completed onboarding process
     * @type {Boolean}
     */
    onboarding: {
      type: Boolean,
      default: false,
    },

    /**
     * Indicates if user has made any payments
     * @type {Boolean}
     */
    hasPaid: {
      type: Boolean,
      default: 'false',
    },

    /**
     * Array of completed session IDs
     * @type {Array}
     */
    finishedSessions: {
      type: Array,
      required: false,
    },

    /**
     * Reference to assigned specialist
     * @type {ObjectId}
     */
    specialist: {
      type: Schema.Types.ObjectId,
      ref: 'specialist',
      required: false,
    },

    /**
     * Reference to assigned psychologist
     * @type {ObjectId}
     */
    psychologist: {
      type: Schema.Types.ObjectId,
      ref: 'psychologist',
      required: false,
    },

    /**
     * User's role in the system
     * Can be 'user', 'specialist', or 'superuser'
     * @type {String}
     */
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'specialist', 'superuser'],
    },

    /**
     * User's professional qualification
     * Can be 'none', 'psychologist', 'nutritionist', or 'specchopedagogue'
     * @type {String}
     */
    profession: {
      type: String,
      default: 'none',
      enum: ['none', 'psychologist', 'nutritionist', 'specchopedagogue'],
    },

    /**
     * User's gender
     * @type {String}
     */
    gender: {
      type: String,
    },

    /**
     * User's address
     * @type {String}
     */
    direction: {
      type: String,
    },

    /**
     * User's date of birth
     * @type {String}
     */
    birthDate: {
      type: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
)

export default model('User', userSchema)
