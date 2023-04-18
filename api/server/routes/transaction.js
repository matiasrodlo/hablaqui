'use strict'

import { Router } from 'express'
import passport from 'passport'
import transactionController from '../controllers/transaction'

const transactionRouter = Router()

/**
 * @description Completa las solicitudes de retiro de dinero
 * @method PATCH
 * @route /api/v1/specialist/complete-request
 * @param {String} params.spec - id del especialista
 * @returns {Object} Lista con todas las sesiones con solicitudes completadas y el monto total retirado
 */
transactionRouter.post(
  '/specialist/complete-payments/:spec',
  transactionController.completePaymentsRequest
)

/**
 * @description Crea una solicitud de retiro de dinero
 * @method PACTH
 * @route /api/v1/specialist/payment-request
 * @returns {Object} Lista con todas las sesiones que se quieren retirar y el monto total a retirar
 * @access authenticated
 */
transactionRouter.post(
  '/specialist/payment-request',
  [passport.authenticate('jwt', { session: true })],
  transactionController.createPaymentsRequest
)

/**
 * @description Devuelve todas las transacciones del especialista logeado
 * @method GET
 * @route /api/v1/specialist/transactions/all
 * @returns {Object} Lista con todas las transacciones
 * @access authenticated
 */
transactionRouter.get(
  '/specialist/transactions/all',
  [passport.authenticate('jwt', { session: true })],
  transactionController.getTransactions
)

transactionRouter.post(
  '/transaction/generate',
  [passport.authenticate('jwt', { session: true })],
  transactionController.generateTransaction
)

transactionRouter.get(
  '/transaction/get/all',
  [passport.authenticate('jwt', { session: true })],
  transactionController.getAllTransactions
)
export default transactionRouter
