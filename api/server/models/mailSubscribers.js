/**
 * Mail Subscribers Model
 * 
 * This module defines the schema for email subscribers in the Hablaquí system.
 * It tracks users who have subscribed to email notifications and their preferences.
 * 
 * @module models/mailSubscribers
 */

'use strict'

import { Schema, model } from 'mongoose'

/**
 * Subscriber Schema
 * Defines the structure for email subscriber documents
 * 
 * @type {Schema}
 * @property {String} email - The subscriber's email address
 * @property {Array} preferences - Array of notification preferences, defaults to ['blog']
 */
const subscriber = new Schema(
  {
    email: { type: String },
    preferences: {
      type: Array,
      default: ['blog'],
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
)

export default model('emailSubscriber', subscriber)
