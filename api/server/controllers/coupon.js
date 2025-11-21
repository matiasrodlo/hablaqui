/**
 * Coupon Controller
 * 
 * This module handles all coupon-related operations in the Hablaquí API.
 * It provides endpoints for creating and validating discount coupons.
 * 
 * @module controllers/coupon
 */

'use strict'

import couponService from '../services/coupon'
import { errorCallback } from '../utils/functions/errorCallback'
import { restResponse } from '../utils/responses/functions'

/**
 * Coupon controller object containing all coupon-related operations
 * @type {Object}
 */
const couponController = {
  /**
   * Create Coupon
   * Creates a new discount coupon
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {Object} req.body.payload - Coupon information
   * @param {Object} res - Express response object
   * @returns {Object} Created coupon information
   * @throws {Error} If coupon creation fails
   */
  async newCoupon(req, res) {
    try {
      const { user } = req
      const { payload } = req.body
      const { data, code } = await couponService.newCoupon(user, payload)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res)
    }
  },

  /**
   * Check Coupon
   * Validates a coupon code and checks its availability
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {string} req.body.coupon - Coupon code to validate
   * @param {Object} res - Express response object
   * @returns {Object} Coupon validation result
   * @throws {Error} If validation fails
   */
  async checkCoupon(req, res) {
    try {
      const { coupon } = req.body
      const { user } = req
      const { data, code } = await couponService.checkCoupon(coupon, user)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res)
    }
  },
}

export default Object.freeze(couponController)
