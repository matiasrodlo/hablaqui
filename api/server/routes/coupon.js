'use strict'

import { Router } from 'express'
import passport from 'passport'
import couponController from '../controllers/coupon'

const couponRouter = Router()

/**
 * @description: Crea un nuevo cupón
 * @method POST
 * @route /api/v1/coupons/new-coupon
 * @param {Object} user - Usuario logeado
 * @param {string} body.payload.code - Código del nuevo cupón
 * @param {string} body.payload.discount - Cantidad de descuento del cupón
 * @param {string} body.payload.discountType - De 2 tipos: 'static' o 'percent'; descuento en peso o porcentaje, respectivamente
 * @param {Object} body.payload.restrictions - OPCIONAL, permite añadir resctricciones de uso al cupón
 * @param {string} body.payload.expiration - Fecha de expiración otorgada al cupón
 * @access: authenticated SuperUser
 */
couponRouter.post(
  '/coupons/new-coupon',
  [passport.authenticate('jwt', { session: true })],
  couponController.newCoupon
)

/**
 * @description: Crea un nuevo cupón
 * @method POST
 * @route /api/v1/coupons/check-coupon
 * @param {Object} user - Usuario logeado
 * @param {string} body.coupon - Código del cupón
 * @returns: Objeto con el cupón encontrado
 * @access: authenticated
 */
couponRouter.post(
  '/coupons/check-coupon',
  [passport.authenticate('jwt', { session: true })],
  couponController.checkCoupon
)

export default couponRouter
