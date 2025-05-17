/**
 * Sessions Model
 * 
 * This module defines the Session schema for the Hablaquí API.
 * It represents therapy sessions, including individual sessions and session plans,
 * along with their payment and status information.
 * 
 * @module models/sessions
 */

import { Schema, model } from 'mongoose'

/**
 * Individual Session Schema
 * Defines the structure for a single therapy session
 * @type {Schema}
 */
const session = new Schema({
  /**
   * Date and time of the session
   * @type {String}
   */
  date: {
    type: String,
  },

  /**
   * Sequential number of the session within a plan
   * @type {String}
   */
  sessionNumber: {
    type: String,
  },

  /**
   * Indicates if the specialist has been paid for this session
   * @type {Boolean}
   */
  paidToSpecialist: {
    type: Boolean,
    default: 'false',
  },

  /**
   * Payment request status
   * @type {String}
   */
  request: {
    type: String,
    default: 'none',
    enum: ['none', 'pending', 'paid'],
  },

  /**
   * Date when payment was requested
   * @type {String}
   */
  requestDate: {
    type: String,
    default: 'Por cobrar',
  },

  /**
   * Date when payment was received
   * @type {String}
   */
  paymentDate: {
    type: String,
    default: 'Por cobrar',
  },

  /**
   * Current status of the session
   * @type {String}
   */
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'upnext', 'success', 'canceled'],
  },
})

/**
 * Session Plan Schema
 * Defines the structure for a package of therapy sessions
 * @type {Schema}
 */
const plan = new Schema(
  {
    /**
     * Title of the plan
     * @type {String}
     */
    title: {
      type: String,
    },

    /**
     * Duration of the plan
     * @type {String}
     */
    period: {
      type: String,
    },

    /**
     * Total price of the plan
     * @type {Number}
     */
    totalPrice: {
      type: Number,
    },

    /**
     * Price per individual session
     * @type {Number}
     */
    sessionPrice: {
      type: Number,
    },

    /**
     * Payment status of the plan
     * @type {String}
     */
    payment: {
      type: String,
      default: 'pending',
      enum: ['pending', 'success', 'failed'],
    },

    /**
     * Date when payment was made
     * @type {String}
     */
    datePayment: {
      type: String,
    },

    /**
     * Plan expiration date
     * @type {String}
     */
    expiration: {
      type: String,
    },

    /**
     * Coupon code used for discount
     * @type {String}
     */
    usedCoupon: {
      type: String,
    },

    /**
     * Total number of sessions in the plan
     * @type {Number}
     */
    totalSessions: {
      type: Number,
    },

    /**
     * Number of sessions remaining in the plan
     * @type {Number}
     */
    remainingSessions: {
      type: Number,
    },

    /**
     * Payment token for the plan
     * @type {String}
     */
    tokenToPay: { 
      type: String, 
      default: '' 
    },

    /**
     * Array of individual sessions in the plan
     * @type {Array<session>}
     */
    session: [session],
  },
  { 
    timestamps: true // Adds createdAt and updatedAt fields
  }
)

/**
 * Main Session Schema
 * Defines the structure for the complete session document
 * @type {Schema}
 */
const sessionSchema = new Schema({
  /**
   * General observations about the sessions
   * @type {String}
   */
  observation: {
    type: String,
  },

  /**
   * Array of session plans
   * @type {Array<plan>}
   */
  plan: [plan],

  /**
   * Reference to assigned specialist
   * @type {ObjectId}
   */
  specialist: {
    type: Schema.Types.ObjectId,
    ref: 'specialist',
  },

  /**
   * Reference to assigned psychologist
   * @type {ObjectId}
   */
  psychologist: {
    type: Schema.Types.ObjectId,
    ref: 'psychologist',
  },

  /**
   * Number of successfully completed sessions
   * @type {Number}
   */
  numberSessionSuccess: {
    type: Number,
    default: 0,
  },

  /**
   * Indicates if evaluation notification has been sent
   * @type {Boolean}
   */
  evaluationNotifcation: { 
    type: Boolean, 
    default: false 
  },

  /**
   * URL for the video session room
   * @type {String}
   */
  roomsUrl: {
    type: String,
  },

  /**
   * Reference to the client user
   * @type {ObjectId}
   */
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

export default model('session', sessionSchema)
