/**
 * Activities Controller
 * 
 * This module handles all activity-related operations in the Hablaquí API.
 * It provides endpoints for retrieving, creating, and deleting user activities.
 * 
 * @module controllers/activities
 */

'use strict'
import activitiesService from '../services/activities'

/**
 * Activities controller object containing all activity-related operations
 * @type {Object}
 */
const activitiesController = {
  /**
   * Get All Activities
   * Retrieves all activities for the current user
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {Object} res - Express response object
   * @returns {Array} List of user activities
   * @throws {Error} If activities cannot be retrieved
   */
  getAll(req, res) {
    const { user } = req
    activitiesService.getAll(user, res)
  },

  /**
   * Create Activity
   * Creates a new activity for the current user
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {Object} req.body - Activity information
   * @param {Object} res - Express response object
   * @returns {Object} Created activity information
   * @throws {Error} If activity creation fails
   */
  create(req, res) {
    const { user } = req
    const place = req.body
    activitiesService.createOne(user, place, res)
  },

  /**
   * Delete All Activities
   * Removes all activities for the current user
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {Object} res - Express response object
   * @returns {Object} Deletion confirmation
   * @throws {Error} If deletion fails
   */
  deleteAll(req, res) {
    const { user } = req
    activitiesService.deleteAll(user, res)
  },
}

export default Object.freeze(activitiesController)
