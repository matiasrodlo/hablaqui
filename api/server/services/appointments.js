/**
 * Appointments Service
 * 
 * This module contains the business logic for appointment-related operations.
 * It handles data retrieval, manipulation, and persistence for appointments
 * in the Hablaquí system.
 * 
 * @module services/appointments
 */

'use strict'

import { logInfo } from '../config/pino.js'
import Appointments from '../models/appointments.js'
import { okResponse } from '../utils/responses/functions.js'

/**
 * Retrieves all appointments from the database
 * 
 * @async
 * @function getAll
 * @returns {Promise<Object>} Object containing:
 *   - message: Success message
 *   - data: Object containing array of appointment names
 * @throws {Error} If database query fails
 */
const getAll = async () => {
  // Retrieve all appointments from the database
  logInfo('Retrieved all appointments')
  let appointments = await Appointments.find()

  // Extract only the appointment names
  appointments = appointments.map(item => item.name)
  return okResponse('Appointments retrieved successfully', { appointments })
}

/**
 * Appointments service object containing all appointment-related business logic
 * @type {Object}
 */
const appointmentsService = {
  getAll,
}

// Export a frozen version of the service to prevent modifications
export default Object.freeze(appointmentsService)
