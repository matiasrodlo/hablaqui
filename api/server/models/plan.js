/**
 * Plan Model
 * 
 * This module defines the schema for subscription plans in the Hablaquí system.
 * It represents different subscription tiers and their associated values.
 * 
 * @module models/plan
 */

'use strict'

import { model, Schema } from 'mongoose'

/**
 * Plan Schema
 * Defines the structure for subscription plan documents
 * 
 * @type {Schema}
 * @property {String} name - The name of the subscription plan
 * @property {Number} value - The monetary value of the plan
 */
const plan = new Schema({
  name: {
    type: String,
  },
  value: {
    type: Number,
  },
})

export default model('plan', plan)
