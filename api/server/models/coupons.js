/**
 * Coupons Model
 * 
 * This module defines the schema for discount coupons in the Hablaquí system.
 * It represents promotional codes that can be applied to reduce session prices.
 * 
 * @module models/coupons
 */

'use strict'

import { Schema, model } from 'mongoose'

/**
 * Example of possible restrictions for coupons:
 * - firstTimeOnly: boolean - Only valid for first-time users
 * - maxUses: number - Maximum number of times the coupon can be used
 */

/**
 * Coupon Schema
 * Defines the structure and validation rules for coupon documents
 * 
 * @type {Schema}
 * @property {String} code - The unique coupon code
 * @property {Number} discount - The discount amount or percentage
 * @property {String} discountType - Type of discount ('percentage' or 'static')
 * @property {Object} restrictions - Additional restrictions for coupon usage
 * @property {String} expiration - Expiration date of the coupon
 */
const coupon = new Schema({
  code: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'static'],
    required: true,
  },
  restrictions: {
    type: Object,
  },
  expiration: {
    type: String,
  },
})

export default model('coupon', coupon)
