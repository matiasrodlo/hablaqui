/**
 * Transaction Model
 * 
 * This module defines the schema for financial transactions in the Hablaquí system.
 * It represents payments made to specialists and psychologists for their services.
 * 
 * @module models/transaction
 */

'use strict'

import { Schema, model } from 'mongoose'

/**
 * Transaction Schema
 * Defines the structure and validation rules for transaction documents
 * 
 * @type {Schema}
 * @property {ObjectId} specialist - Reference to the specialist who received the payment
 * @property {ObjectId} psychologist - Reference to the psychologist who received the payment
 * @property {Number} total - Total amount of the transaction
 * @property {Array} sessions - Array of sessions included in the transaction
 */
const transaction = new Schema(
  {
    specialist: {
      type: Schema.Types.ObjectId,
      ref: 'specialist',
    },
    psychologist: {
      type: Schema.Types.ObjectId,
      ref: 'psychologist',
    },
    total: { type: Number },
    sessions: { type: Array },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
)

export default model('transaction', transaction)
