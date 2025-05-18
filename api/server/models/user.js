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
      required: [true, 'Name is required'],
      trim: true
    },

    /**
     * User's last name
     * @type {String}
     */
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },

    /**
     * User's RUT (Chilean national ID)
     * @type {String}
     */
    rut: {
      type: String,
      unique: true,
      sparse: true
    },

    /**
     * User's email address
     * Stored in lowercase and trimmed
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true
    },

    /**
     * User's hashed password
     * @type {String}
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long']
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
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
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
      default: null 
    },

    /**
     * URL to user's profile picture thumbnail
     * @type {String}
     */
    avatarThumbnail: {
      type: String,
      default: null
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
      default: false,
    },

    /**
     * Array of completed session IDs
     * @type {Array}
     */
    finishedSessions: {
      type: Number,
      default: 0
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
      enum: ['user', 'specialist', 'superuser'],
      default: 'user'
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
      type: Date,
    },

    /**
     * User's specialties
     * @type {Array}
     */
    specialties: [{
      type: String
    }],

    /**
     * User's languages
     * @type {Array}
     */
    languages: [{
      type: String
    }],

    /**
     * User's availability
     * @type {Object}
     */
    availability: {
      monday: [String],
      tuesday: [String],
      wednesday: [String],
      thursday: [String],
      friday: [String],
      saturday: [String],
      sunday: [String]
    },

    /**
     * User's plan
     * @type {String}
     */
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free'
    },

    /**
     * User's isInvited status
     * @type {Boolean}
     */
    isInvited: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
)

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ rut: 1 });
userSchema.index({ role: 1 });
userSchema.index({ state: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.name} ${this.lastName}`;
});

// Methods
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;  // Remove password from JSON response
  return user;
};

export default model('User', userSchema)
