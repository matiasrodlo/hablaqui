/**
 * Appointments Router
 * 
 * This module defines the routes for appointment management in the Hablaquí API.
 * It handles appointment-related operations such as retrieving, creating,
 * updating, and deleting appointments.
 * 
 * @module routes/appointments
 */

'use strict'

import { Router } from 'express'
import appointmentsController from '../controllers/appointments'

const appointmentsRouter = Router()

/**
 * GET /api/v1/appointments/all
 * 
 * Retrieves all appointments in the system.
 * 
 * @route GET /appointments/all
 * @returns {Object[]} List of appointments
 * @todo Add authentication and authorization middleware for production use
 */
appointmentsRouter.get(
  '/appointments/all',
  appointmentsController.getAll
)

export default appointmentsRouter
