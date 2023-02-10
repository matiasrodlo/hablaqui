'use strict'

import dashboardService from '../services/dashboard'
import { restResponse } from '../utils/responses/functions'
import { errorCallback } from '../utils/functions/errorCallback'

const retoolController = {
  async getNextSessions (req, res) {
    try {
      const { data, code } = await dashboardService.getNextSessions()
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },
  async getSessionsPayment (req, res) {
    try {
      const { startDate, endDate } = req.params
      const { data, code } = await dashboardService.getSessionsPayment(
        startDate,
        endDate
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },
  async fixSpecialities (req, res) {
    try {
      const { data, code } = await dashboardService.fixSpecialities()
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },
  async getMountToPay (req, res) {
    try {
      const { user } = req
      const { data, code } = await dashboardService.getMountToPay(user)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  }
}

export default Object.freeze(retoolController)
