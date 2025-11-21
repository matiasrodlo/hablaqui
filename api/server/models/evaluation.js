/**
 * Evaluation Model
 * 
 * This module defines the schema for session evaluations in the Hablaquí system.
 * It represents feedback provided by users about their sessions with specialists and psychologists.
 * 
 * @module models/evaluation
 */

import { Schema, model } from 'mongoose'

/**
 * Individual Evaluation Schema
 * Defines the structure for a single evaluation
 * 
 * @type {Schema}
 * @property {String} approved - Approval status ('refuse', 'wait', or 'approved')
 * @property {String} comment - User's written feedback
 * @property {Number} global - Overall rating
 * @property {Number} puntuality - Rating for punctuality
 * @property {Number} attention - Rating for attention quality
 * @property {Number} internet - Rating for internet connection
 * @property {String} moderatingDate - Date when the evaluation was moderated
 * @property {String} like - What the user liked about the session
 * @property {String} improve - What the user thinks could be improved
 */
const evaluation = new Schema(
  {
    approved: {
      type: String,
      default: 'wait',
      enum: ['refuse', 'wait', 'approved'],
    },
    comment: {
      type: String,
      default: '',
    },
    global: {
      type: Number,
      default: 0,
    },
    puntuality: {
      type: Number,
      default: 0,
    },
    attention: {
      type: Number,
      default: 0,
    },
    internet: {
      type: Number,
      default: 0,
    },
    moderatingDate: {
      type: String,
    },
    like: {
      type: String,
      enum: [
        'Dedicación',
        'Explicaciones claras',
        'Eficacia del proceso',
        'Otro',
      ],
    },
    improve: {
      type: String,
      enum: [
        'Falta de empatía',
        'Comunicación',
        'Retraso en la visita',
        'Otro',
      ],
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
)

/**
 * Evaluations Schema
 * Defines the structure for collections of evaluations
 * 
 * @type {Schema}
 * @property {ObjectId} specialist - Reference to the evaluated specialist
 * @property {ObjectId} psychologist - Reference to the evaluated psychologist
 * @property {ObjectId} user - Reference to the user who provided the evaluation
 * @property {Array<evaluation>} evaluations - Array of individual evaluations
 */
const evaluations = new Schema({
  specialist: {
    type: Schema.Types.ObjectId,
    ref: 'specialist',
  },
  psychologist: {
    type: Schema.Types.ObjectId,
    ref: 'psychologist',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  evaluations: [evaluation],
})

export default model('evaluation', evaluations)
