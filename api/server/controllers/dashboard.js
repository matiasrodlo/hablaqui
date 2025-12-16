// Dashboard Controller
// This controller handles HTTP requests related to dashboard and admin operations, such as retrieving sessions, payments, user data, and specialist visibility.

'use strict'

import dashboardService from '../services/dashboard'
import { restResponse } from '../utils/responses/functions'
import { errorCallback } from '../utils/functions/errorCallback'

// Controller object containing dashboard-related operations
const retoolController = {
  // Get the next scheduled sessions
  async getNextSessions(req, res) {
    try {
      const { data, code } = await dashboardService.getNextSessions()
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },
  // Get payment information for sessions within a date range
  async getSessionsPayment(req, res) {
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
  // Fix specialist specialities data
  async fixSpecialities(req, res) {
    try {
      const { data, code } = await dashboardService.fixSpecialities()
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },
  // Get the amount to pay for a user (specialist)
  async getMountToPay(req, res) {
    try {
      const { user } = req
      const { data, code } = await dashboardService.getMountToPay(user)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },
  // Set specialist visibility (e.g., show/hide in listings)
  async specialistVisibility(req, res) {
    try {
      const { specId, visibility } = req.params
      const { data, code } = await dashboardService.specialistVisibility(
        specId,
        visibility
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },
  // Get all users for admin dashboard
  async getUsers(req, res) {
    try {
      const { data, code } = await dashboardService.getUsers()
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },
  // Health check endpoint for monitoring
  async heatlhCheck(req, res) {
		try {
			return restResponse('OK', 200, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
}

export default Object.freeze(retoolController)
