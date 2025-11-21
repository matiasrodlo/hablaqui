/**
 * Chat Model
 * 
 * This module defines the Chat schema for the Hablaquí API.
 * It represents chat conversations between users and specialists/psychologists,
 * including messages and reports.
 * 
 * @module models/chat
 */

'use strict'

import { Schema, model } from 'mongoose'

/**
 * Message Schema
 * Defines the structure for individual chat messages
 * @type {Schema}
 */
const messageSchema = new Schema(
  {
    /**
     * Reference to the user who sent the message
     * @type {ObjectId}
     */
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    /**
     * Content of the message
     * @type {String}
     */
    message: {
      type: String,
    },

    /**
     * Indicates if the message has been read
     * @type {Boolean}
     */
    read: {
      type: Boolean,
      default: 'false',
    },
  },
  { 
    timestamps: true // Adds createdAt and updatedAt fields
  }
)

/**
 * Report Schema
 * Defines the structure for chat reports/complaints
 * @type {Schema}
 */
const reportSchema = new Schema(
  {
    /**
     * ID of the user who submitted the report
     * @type {String}
     */
    reportedBy: {
      type: String,
    },

    /**
     * Type of report
     * @type {String}
     */
    reportType: {
      type: String,
      enum: ['inappropiate', 'no-answer', 'too-late', 'other'],
    },

    /**
     * Description of the reported issue
     * @type {String}
     */
    issue: {
      type: String,
    },
  },
  { 
    timestamps: true // Adds createdAt and updatedAt fields
  }
)

/**
 * Chat Schema
 * Defines the structure for chat conversations
 * @type {Schema}
 */
const chatSchema = new Schema(
  {
    /**
     * Reference to the client user
     * @type {ObjectId}
     */
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    /**
     * Reference to the specialist
     * @type {ObjectId}
     */
    specialist: {
      type: Schema.Types.ObjectId,
      ref: 'specialist',
    },

    /**
     * Reference to the psychologist
     * @type {ObjectId}
     */
    psychologist: {
      type: Schema.Types.ObjectId,
      ref: 'psychologist',
    },

    /**
     * Indicates if the last message has been read
     * @type {Boolean}
     */
    isLastRead: {
      type: Boolean,
      default: true,
    },

    /**
     * ID of the user who sent the last message
     * @type {String}
     */
    lastMessageSendBy: {
      type: String,
      default: null,
    },

    /**
     * Array of messages in the chat
     * @type {Array<messageSchema>}
     */
    messages: [messageSchema],

    /**
     * Array of reports submitted for this chat
     * @type {Array<reportSchema>}
     */
    reports: [reportSchema],
  },
  { 
    timestamps: true // Adds createdAt and updatedAt fields
  }
)

export default model('chat', chatSchema)
