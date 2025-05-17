/**
 * Specialist Controller
 * 
 * This module handles all specialist-related operations in the Hablaquí API.
 * It provides endpoints for specialist management, scheduling, client matching, and profile updates.
 * 
 * @module controllers/specialist
 */

'use strict'

import specialistsService from '../services/specialist'
import { restResponse } from '../utils/responses/functions'
import { errorCallback } from '../utils/functions/errorCallback'

const specialistsController = {
  /**
   * Get All Specialists
   * Retrieves a list of all registered specialists
   * 
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Array} List of specialist objects
   * @throws {Error} If specialists cannot be retrieved
   */
  async getAll(req, res) {
    try {
      const { data, code } = await specialistsService.getAll()
      return restResponse(data, code, res)
    } catch (error) {
      errorCallback(error, res, 'Error obteniendo los especialistas')
    }
  },

  /**
   * Match Specialist
   * Matches a client with the most suitable specialist based on criteria
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.body - Matching criteria
   * @param {Object} res - Express response object
   * @returns {Object} Matched specialist information
   * @throws {Error} If matching process fails
   */
  async match(req, res) {
    try {
      const { body } = req
      const { data, code } = await specialistsService.match(body)
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error haciendo match')
    }
  },

  /**
   * Reschedule Session
   * Updates the date and time of a scheduled session
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.body - Session information
   * @param {string} req.body.sessionsId - ID of the sessions collection
   * @param {string} req.body.planId - ID of the plan
   * @param {string} req.body.sessionId - ID of the specific session
   * @param {Date} req.body.newDate - New date and time for the session
   * @param {Object} res - Express response object
   * @returns {Object} Updated session information
   * @throws {Error} If rescheduling fails
   */
  async rescheduleSession(req, res) {
    try {
      const { sessionsId, planId, sessionId, newDate } = req.body
      const { data, code } = await specialistsService.rescheduleSession(
        sessionsId,
        planId,
        sessionId,
        newDate
      )
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'error actualizando la cita')
    }
  },

  /**
   * Get Specialist by Username
   * Retrieves a specialist's profile by their username
   * 
   * @param {Object} req - Express request object
   * @param {string} req.params.username - Specialist's username
   * @param {Object} res - Express response object
   * @returns {Object} Specialist profile information
   * @throws {Error} If specialist cannot be found
   */
  async getByUsername(req, res) {
    try {
      const { username } = req.params
      const { data, code } = await specialistsService.getByUsername(username)
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'error consiguiendo el especialista')
    }
  },

  /**
   * Set Specialist Schedule
   * Updates a specialist's availability schedule
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated specialist object
   * @param {Object} req.body.payload - Schedule information
   * @param {Object} res - Express response object
   * @returns {Object} Updated schedule information
   * @throws {Error} If schedule update fails
   */
  async setSchedule(req, res) {
    try {
      const { user } = req
      const { payload } = req.body
      const { data, code } = await specialistsService.setSchedule(user, payload)
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'error actualizando tus horarios')
    }
  },

  /**
   * Update Payment Method
   * Updates a specialist's payment method information
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated specialist object
   * @param {Object} req.body.payload - Payment method information
   * @param {Object} res - Express response object
   * @returns {Object} Updated payment method information
   * @throws {Error} If payment method update fails
   */
  async updatePaymentMethod(req, res) {
    try {
      const { user } = req
      const { payload } = req.body
      const { data, code } = await specialistsService.updatePaymentMethod(
        user,
        payload
      )
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'error actualizando el metodo de pago')
    }
  },

  /**
   * Update Specialist Profile
   * Updates a specialist's profile information
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated specialist object
   * @param {Object} req.body.profile - Updated profile information
   * @param {Object} res - Express response object
   * @returns {Object} Updated specialist profile
   * @throws {Error} If profile update fails
   */
  async updateSpecialist(req, res) {
    try {
      const { user } = req
      const { profile } = req.body
      const { data, code } = await specialistsService.updateSpecialist(
        user,
        profile
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'error actualizando el especialista')
    }
  },

  /**
   * Delete Specialist
   * Removes a specialist from the system
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {string} req.params.id - ID of the specialist to delete
   * @param {Object} res - Express response object
   * @returns {Object} Deletion confirmation
   * @throws {Error} If deletion fails
   */
  async deleteOne(req, res) {
    try {
      const { user } = req
      const { id } = req.params
      const { data, code } = await specialistsService.deleteOne(user, id)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'error eliminando el especialista')
    }
  },

  /**
   * Set Session Price
   * Updates a specialist's session price
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated specialist object
   * @param {number} req.body.newPrice - New session price
   * @param {Object} res - Express response object
   * @returns {Object} Updated price information
   * @throws {Error} If price update fails
   */
  async setPrice(req, res) {
    try {
      const { user } = req
      const { newPrice } = req.body
      const { data, code } = await specialistsService.setPrice(user, newPrice)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'error actualizando el precio')
    }
  },

  /**
   * Get Specialist by Data
   * Searches for specialists based on provided information
   * 
   * @param {Object} req - Express request object
   * @param {string} req.params.info - Search criteria
   * @param {Object} res - Express response object
   * @returns {Array} List of matching specialists
   * @throws {Error} If search fails
   */
  async getByData(req, res) {
    try {
      const { info } = req.params
      const { data, code } = await specialistsService.getByData(info)
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'error consiguiendo el especialista')
    }
  },

  /**
   * Get Specialist's Clients
   * Retrieves all clients assigned to a specialist
   * 
   * @param {Object} req - Express request object
   * @param {string} req.params.specialist - Specialist ID
   * @param {Object} res - Express response object
   * @returns {Array} List of client objects
   * @throws {Error} If clients cannot be retrieved
   */
  async getClients(req, res) {
    try {
      const { specialist } = req.params
      const { data, code } = await specialistsService.getClients(specialist)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'error consiguiendo los clientes')
    }
  },

  /**
   * Search Clients
   * Searches for clients based on provided criteria
   * 
   * @param {Object} req - Express request object
   * @param {string} req.params.search - Search criteria
   * @param {Object} res - Express response object
   * @returns {Array} List of matching clients
   * @throws {Error} If search fails
   */
  async searchClients(req, res) {
    try {
      const { search } = req.params
      const { data, code } = await specialistsService.searchClients(search)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },

  /**
   * Check Username Availability
   * Verifies if a username is available for registration
   * 
   * @param {Object} req - Express request object
   * @param {string} req.body.username - Username to check
   * @param {Object} res - Express response object
   * @returns {Object} Availability status
   * @throws {Error} If check fails
   */
  async usernameAvailable(req, res) {
    try {
      const { username } = req.body
      const { data, code } = await specialistsService.usernameAvailable(
        username
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },

  /**
   * Update Formation and Experience
   * Updates a specialist's professional formation and experience
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated specialist object
   * @param {Object} req.body.payload - Updated formation and experience information
   * @param {Object} res - Express response object
   * @returns {Object} Updated specialist profile
   * @throws {Error} If update fails
   */
  async updateFormationExperience(req, res) {
    try {
      const { payload } = req.body
      const { user } = req
      const { data, code } = await specialistsService.updateFormationExperience(
        user,
        payload
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error actualizando')
    }
  },

  /**
   * Approve Avatar
   * Approves a specialist's profile picture
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {string} req.params.id - ID of the specialist
   * @param {Object} res - Express response object
   * @returns {Object} Approval confirmation
   * @throws {Error} If approval fails
   */
  async approveAvatar(req, res) {
    try {
      const { user } = req
      const { id } = req.params
      const { data, code } = await specialistsService.approveAvatar(user, id)
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error aprobando el avatar')
    }
  },

  /**
   * Upload Profile Picture
   * Updates a specialist's profile picture
   * 
   * @param {Object} req - Express request object
   * @param {string} req.params.id - Specialist ID
   * @param {Object} req.file - Profile picture file
   * @param {Object} res - Express response object
   * @returns {Object} Updated specialist profile
   * @throws {Error} If upload fails
   */
  async uploadProfilePicture(req, res) {
    try {
      const id = req.params.id
      const { file } = req
      const { data, code } = await specialistsService.uploadProfilePicture(
        id,
        file
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(
        e,
        res,
        'Error actualizando/subiendo imágen de perfil'
      )
    }
  },

  /**
   * Change to Immediate Attention
   * Updates a specialist's status to accept immediate attention requests
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated specialist object
   * @param {Object} res - Express response object
   * @returns {Object} Updated specialist status
   * @throws {Error} If status update fails
   */
  async changeToInmediateAttention(req, res) {
    try {
      const { user } = req
      const {
        data,
        code,
      } = await specialistsService.changeToInmediateAttention(user.specialist)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },
}

export default Object.freeze(specialistsController)
