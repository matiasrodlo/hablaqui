/**
 * Email Model
 * 
 * This module defines the MongoDB schema for email notifications and reminders.
 * It handles email scheduling, delivery status, and notification types.
 * 
 * Features:
 * - Email scheduling and queuing
 * - Multiple notification types
 * - Delivery status tracking
 * - User and specialist references
 * - Session reminders
 * - Payment notifications
 * 
 * @module models/email
 * @requires mongoose - MongoDB ODM
 * @requires dayjs - Date handling
 */

'use strict'

import mongoose from 'mongoose'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/**
 * Email Schema
 * Defines the structure for email documents in MongoDB
 * 
 * @type {mongoose.Schema}
 */
const emailSchema = new mongoose.Schema(
  {
    /**
     * Type of email notification
     * @type {string}
     */
    type: {
      type: String,
      required: true,
      enum: [
        'reminder-user-day',
        'reminder-user-hour',
        'reminder-spec-day',
        'reminder-spec-hour',
        'reminder-payment-day',
        'reminder-payment-hour',
        'promocional-incentive-week'
      ]
    },

    /**
     * Whether the email has been scheduled
     * @type {boolean}
     */
    wasScheduled: {
      type: Boolean,
      default: false
    },

    /**
     * When the email was queued
     * @type {Date}
     */
    queuedAt: {
      type: Date,
      default: null
    },

    /**
     * When the email is scheduled to be sent
     * @type {Date}
     */
    scheduledAt: {
      type: Date,
      default: null
    },

    /**
     * Reference to the user
     * @type {mongoose.Schema.Types.ObjectId}
     */
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    /**
     * Reference to the specialist
     * @type {mongoose.Schema.Types.ObjectId}
     */
    specRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialist',
      required: true
    },

    /**
     * Reference to the session
     * @type {mongoose.Schema.Types.ObjectId}
     */
    sessionRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
      required: true
    },

    /**
     * URL for the session room
     * @type {string}
     */
    url: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

/**
 * Email Model
 * @type {mongoose.Model}
 */
const Email = mongoose.model('Email', emailSchema)

export default Email
