/**
 * User Controller
 * 
 * This module handles all user-related operations in the Hablaquí API.
 * It provides endpoints for user profile management, authentication, and status updates.
 * 
 * @module controllers/users
 */

'use strict'

import userService from '../services/users'
import { errorCallback } from '../utils/functions/errorCallback'
import { restResponse } from '../utils/responses/functions'

const userController = {
  /**
   * Get User Profile
   * Retrieves the profile information of the authenticated user
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {Object} res - Express response object
   * @returns {Object} User profile data
   * @throws {Error} If user profile cannot be retrieved
   */
  async getUser(req, res) {
    try {
      const { user } = req
      const { data, code } = await userService.getProfile(user._id)
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res)
    }
  },

  /**
   * Update User Profile
   * Updates the profile information of the authenticated user
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {Object} req.body - Updated profile information
   * @param {Object} res - Express response object
   * @returns {Object} Updated user profile
   * @throws {Error} If profile update fails
   */
  async updateProfile(req, res) {
    try {
      const { user } = req
      const profile = req.body
      const { data, code } = await userService.updateProfile(user.id, profile)
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error actualizando perfil')
    }
  },

  /**
   * Update User's Specialist
   * Updates the specialist assigned to a user from the intranet
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.body - Update information
   * @param {string} req.body.user - ID of the user to update
   * @param {string} req.body.newSpecialist - ID of the new specialist
   * @param {string} req.body.oldSpecialist - ID of the previous specialist
   * @param {Object} res - Express response object
   * @returns {Object} Updated user object
   * @throws {Error} If specialist update fails
   */
  async updateSpecialist(req, res) {
    try {
      const { user, newSpecialist, oldSpecialist } = req.body
      const { data, code } = await userService.updateSpecialist(
        user,
        newSpecialist,
        oldSpecialist
      )
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error actualizando especialista')
    }
  },

  /**
   * Update User by ID
   * Updates a specific user's profile information
   * 
   * @param {Object} req - Express request object
   * @param {string} req.params.id - ID of the user to update
   * @param {Object} req.body - Updated profile information
   * @param {Object} res - Express response object
   * @returns {Object} Updated user object
   * @throws {Error} If profile update fails
   */
  async updateOne(req, res) {
    try {
      const { id } = req.params
      const profile = req.body
      const { data, code } = await userService.updateProfile(id, profile)
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error actualizando perfil')
    }
  },

  /**
   * Reset Password via Email
   * Allows a user to reset their password through email verification
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {string} req.body.password - New password
   * @param {Object} res - Express response object
   * @returns {Object} Success message
   * @throws {Error} If password reset fails
   */
  async passwordRecovery(req, res) {
    try {
      const { user } = req
      const { password } = req.body
      const { data, code } = await userService.passwordRecovery(user, password)
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error actualizando contraseña')
    }
  },

  /**
   * Update Password
   * Allows a user to change their password from their profile
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {Object} req.body - Password information
   * @param {string} req.body.oldPassword - Current password
   * @param {string} req.body.newPassword - New password
   * @param {Object} res - Express response object
   * @returns {Object} Success message
   * @throws {Error} If password update fails
   */
  async updatePassword(req, res) {
    try {
      const { user } = req
      const { oldPassword, newPassword } = req.body
      const { data, code } = await userService.updatePassword(
        user,
        oldPassword,
        newPassword
      )
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error actualizando contraseña')
    }
  },

  /**
   * Upload Profile Picture
   * Updates or uploads a user's profile picture
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.body - User information
   * @param {string} req.body._id - User ID
   * @param {string} req.body.role - User role
   * @param {string} req.body.name - User's first name
   * @param {string} req.body.lastName - User's last name
   * @param {string} req.body.idSpecialist - Specialist ID (if applicable)
   * @param {Object} req.file - Profile picture file
   * @param {Object} req.user - Authenticated user object
   * @param {Object} res - Express response object
   * @returns {Object} Updated user profile
   * @throws {Error} If file upload fails
   */
  async uploadAvatar(req, res) {
    try {
      const { body, file, user } = req
      const { data, code } = await userService.uploadAvatar({
        ...body,
        avatar: file.avatar,
        avatarThumbnail: file.avatarThumbnail,
        userLogged: {
          role: user.role,
          email: user.email,
        },
      })
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
   * Set User Online
   * Updates the user's status to online
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {Object} res - Express response object
   * @returns {Object} Updated user object
   * @throws {Error} If status update fails
   */
  async setUserOnline(req, res) {
    try {
      const { user } = req
      const { data, code } = await userService.setUserOnline(user)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error actualizando el estado')
    }
  },

  /**
   * Set User Offline
   * Updates the user's status to offline
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {Object} res - Express response object
   * @returns {Object} Updated user object
   * @throws {Error} If status update fails
   */
  async setUserOffline(req, res) {
    try {
      const { user } = req
      const { data, code } = await userService.setUserOffline(user)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error actualizando el estado')
    }
  },

  /**
   * Register User by Specialist
   * Allows a specialist to register a new client
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated specialist object
   * @param {Object} req.body - New user information
   * @param {Object} res - Express response object
   * @returns {Object} Newly created user object
   * @throws {Error} If user registration fails
   */
  async registerUser(req, res) {
    try {
      const { user, body } = req
      const { data, code } = await userService.registerUser(user, body)
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error registrando un usuario')
    }
  },

  /**
   * Change Specialist
   * Allows a user to change their assigned specialist before plan expiration
   * 
   * @param {Object} req - Express request object
   * @param {string} req.params.sessionId - ID of the active session plan
   * @param {Object} res - Express response object
   * @returns {Object} Updated session information
   * @throws {Error} If specialist change fails
   */
  async changeSpecialist(req, res) {
    try {
      const { sessionId } = req.params
      const { data, code } = await userService.changeSpecialist(sessionId)
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error añadiendo la evaluación')
    }
  },
}

export default userController
