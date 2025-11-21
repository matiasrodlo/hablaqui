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

// Initialize Express router
const appointmentsRouter = Router()

/**
 * GET /api/v1/appointments/all
 * 
 * Retrieves all appointments in the system.
 * Note: Authentication and authorization middleware are currently commented out
 * but should be implemented for production use.
 * 
 * @route GET /appointments/all
 * @returns {Object[]} List of appointments
 */
appointmentsRouter.get(
  '/appointments/all' /*,
    [
        passport.authenticate('jwt', { session: true }),
        grantAccess('readAny', 'appointments'),
    ] */,
  appointmentsController.getAll
)

export default appointmentsRouter
