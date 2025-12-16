/**
 * Appointment Model
 * 
 * This module defines the Mongoose schema and model for appointments in the Hablaquí system.
 * It specifies the structure and validation rules for appointment documents in MongoDB.
 * 
 * @module models/appointments
 */

'use strict'

import { Schema, model } from 'mongoose'

/**
 * Appointment Schema
 * Defines the structure and validation rules for appointment documents
 * 
 * @type {Schema}
 * @property {String} name - The name or title of the appointment
 */
const appointment = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
  versionKey: false // Disable the __v field
})

// Create and export the Appointment model
export default model('appointment', appointment)
