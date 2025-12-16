/**
 * Coupon Service
 * 
 * This module handles the business logic for coupon management in the Hablaquí system.
 * It provides functionality for creating and validating discount coupons.
 * 
 * Features:
 * - Coupon creation with validation
 * - Coupon code checking
 * - Expiration date handling
 * - User-specific restrictions
 * - Discount type support (static/percentage)
 * 
 * @module services/coupon
 * @requires ../utils/responses/functions - Response utilities
 * @requires ../models/coupons - Coupon model
 * @requires ../config/pino - Logging
 * @requires dayjs - Date handling
 */

'use strict'

import { conflictResponse, okResponse } from '../utils/responses/functions'
import Coupon from '../models/coupons'
import { logInfo } from '../config/pino'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Santiago')

/**
 * Creates a new discount coupon
 * Validates user permissions and checks for duplicate codes
 * 
 * @async
 * @param {Object} user - User object with role information
 * @param {Object} payload - Coupon creation data
 * @param {string} payload.code - Unique coupon code
 * @param {number} payload.discount - Discount amount or percentage
 * @param {string} payload.discountType - Type of discount ('static' or 'percentage')
 * @param {Object} payload.restrictions - Optional usage restrictions
 * @param {string} payload.expiration - Expiration date
 * @returns {Promise<Object>} Response with creation status
 * @throws {Error} If user lacks permissions or coupon code exists
 */
const newCoupon = async (user, payload) => {
  // Verify user permissions and check for existing coupon
  if (user.role !== 'superuser') {
    return conflictResponse('No tienes poder aqui.')
  }
  if (await Coupon.exists({ code: payload.code })) {
    return conflictResponse('Ya hay un cupon con ese codigo')
  }

  // Create coupon object
  const coupon = {
    code: payload.code,
    discount: payload.discount,
    discountType: payload.discountType,
    restrictions: payload.restrictions,
    expiration: dayjs.tz(dayjs(payload.expiration)).toISOString(),
  }

  // Save coupon to database and return success response
  await Coupon.create(coupon)
  logInfo(`${user.email} ha creado un cupon con el codigo ${payload.code}`)
  return okResponse('Cupon creado con exito')
}

/**
 * Validates a coupon code and checks its availability
 * Performs various validation checks including expiration and restrictions
 * 
 * @async
 * @param {string} code - Coupon code to validate
 * @param {Object} user - User attempting to use the coupon
 * @param {boolean} user.hasPaid - Whether user has made previous purchases
 * @param {string} user._id - User's unique identifier
 * @returns {Promise<Object>} Response with validation result and coupon data
 * @throws {Error} If coupon is invalid or restrictions are not met
 */
const checkCoupon = async (code, user) => {
  // Find coupon and perform validation checks
  const foundCoupon = await Coupon.findOne({ code })
  if (!foundCoupon) {
    return conflictResponse('No se ha encontrado un cupon con ese codigo')
  }
  if (dayjs().isAfter(dayjs(foundCoupon.expiration))) {
    return conflictResponse('Este cupon ya ha expirado')
  }
  if (foundCoupon.discountType === 'static' && foundCoupon.discount === 0) {
    return conflictResponse('Cupón con saldo 0')
  }

  // Check usage restrictions
  if (foundCoupon.restrictions) {
    if (foundCoupon.restrictions.firstTimeOnly && user.hasPaid) {
      return conflictResponse('Este usuario ya ha comprado alguna vez')
    }
    if (
      foundCoupon.restrictions.user &&
      foundCoupon.restrictions.user.toString() !== user._id.toString()
    ) {
      return conflictResponse('Usuario no habilitado para este cupón')
    }
  }

  // Return valid coupon
  logInfo('aplicado')
  return okResponse('el cupon es valido', { coupon: foundCoupon })
}

/**
 * Coupon service object containing all coupon-related business logic
 * @type {Object}
 */
const couponService = {
  newCoupon,
  checkCoupon,
}

export default Object.freeze(couponService)
