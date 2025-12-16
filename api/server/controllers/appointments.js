/**
 * Appointments Controller
 * 
 * This module contains the controller functions for handling appointment-related
 * operations. It acts as an intermediary between the routes and services,
 * handling HTTP requests and responses.
 * 
 * @module controllers/appointments
 */

'use strict'
import { restResponse } from '../utils/responses/functions'
import appointmentsService from '../services/appointments'
import { errorCallback } from '../utils/functions/errorCallback'

/**
 * Appointments controller object containing all appointment-related operations
 * @type {Object}
 */
const appointmentsController = {
  /**
   * Retrieves all appointments from the system
   * 
   * @async
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} Response containing appointment data and status code
   * @throws {Error} If there's an error retrieving appointments
   */
  async getAll(req, res) {
    try {
      const { data, code } = await appointmentsService.getAll()
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'error consiguiendo las consultas')
    }
  },
}

export default Object.freeze(appointmentsController)
