// Mercadopago Controller
// This controller handles HTTP requests related to Mercadopago payment operations, such as processing successful payments, creating payment preferences, and handling specialist and custom session payments.

'use strict'

import mercadopagoService from '../services/mercadopago'
import { errorCallback } from '../utils/functions/errorCallback'
import { restResponse } from '../utils/responses/functions'
import { landing_url } from '../config/dotenv'

// Controller object containing Mercadopago-related operations
const mercadopagoController = {
  // Process a successful payment
  async successPay(req, res) {
    try {
      const { params } = req
      const { data, code } = await mercadopagoService.successPay(params)
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error al aprobar pago.')
    }
  },
  // Create a payment preference for a specialist
  async createSpecialistPreference(req, res) {
    try {
      const { body } = req
      const {
        data,
        code,
      } = await mercadopagoService.createSpecialistPreference(body)
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'error procesando el servicio')
    }
  },
  // Process a specialist payment
  async specialistPay(req, res) {
    try {
      const { params, query } = req
      await mercadopagoService.specialistPay(params, query)
      return res.redirect(`${process.env.VUE_APP_LANDING}dashboard/perfil`)
    } catch (e) {
      errorCallback(e, res, 'Error al aprobar pago.')
    }
  },
  // Process a payment for a recruited specialist
  async recruitedPay(req, res) {
    try {
      const { params, query } = req
      await mercadopagoService.recruitedPay(params, query)
      return res.redirect(`${process.env.VUE_APP_LANDING}dashboard/perfil`)
    } catch (e) {
      errorCallback(e, res, 'Error al aprobar pago.')
    }
  },
  // Create a payment preference for a custom session
  async createCustomSessionPreference(req, res) {
    try {
      const { userId, specId, planId } = req.params
      const {
        data,
        code,
      } = await mercadopagoService.createCustomSessionPreference(
        userId,
        specId,
        planId
      )
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'error procesando el servicio')
    }
  },
  // Process a payment for a custom session
  async customSessionPay(req, res) {
    try {
      const { params } = req
      await mercadopagoService.customSessionPay(params)
      return res.redirect(`${landing_url}dashboard/chat`)
    } catch (e) {
      errorCallback(e, res, 'Error al aprobar pago.')
    }
  },
}

export default Object.freeze(mercadopagoController)
