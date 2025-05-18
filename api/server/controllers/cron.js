/**
 * Cron Controller
 * 
 * This module handles all scheduled task operations in the Hablaquí API.
 * It provides endpoints for email scheduling, session status updates, and automated system tasks.
 * 
 * @module controllers/cron
 */

'use strict'

import cronService from '../services/cron'
import { restResponse } from '../utils/responses/functions'
import { errorCallback } from '../utils/functions/errorCallback'

const cronController = {
  /**
   * Email Schedule
   * Unifies and processes scheduled email notifications
   * 
   * @param {Object} req - Express request object
   * @param {string} req.params.authToken - Authentication token for cron job
   * @param {Object} res - Express response object
   * @returns {Object} Email processing status
   * @throws {Error} If email processing fails
   */
  async emailSchedule(req, res) {
    try {
      const token = req.params.authToken
      const { data, code } = await cronService.unifyMailing(token)
      return restResponse(data, code, res)
    } catch (err) {
      errorCallback(err, res)
    }
  },

  /**
   * Session Status
   * Updates the status of scheduled sessions
   * 
   * @param {Object} req - Express request object
   * @param {string} req.params.authToken - Authentication token for cron job
   * @param {Object} res - Express response object
   * @returns {Object} Session status update confirmation
   * @throws {Error} If status update fails
   */
  async sessionStatus(req, res) {
    try {
      const token = req.params.authToken
      const { data, code } = await cronService.sessionStatus(token)
      return restResponse(data, code, res)
    } catch (err) {
      errorCallback(err, res)
    }
  },

  /**
   * Schedule Chat Emails
   * Processes and schedules chat-related email notifications
   * 
   * @param {Object} req - Express request object
   * @param {string} req.params.authToken - Authentication token for cron job
   * @param {Object} res - Express response object
   * @returns {Object} Email scheduling status
   * @throws {Error} If email scheduling fails
   */
  async scheduleChatEmails(req, res) {
    try {
      const token = req.params.authToken
      const { data, code } = await cronService.scheduleChatEmails(token)
      return restResponse(data, code, res)
    } catch (err) {
      errorCallback(err, res)
    }
  },

  /**
   * Limit To Pay Plan
   * Processes payment plan limits and restrictions
   * 
   * @param {Object} req - Express request object
   * @param {string} req.params.authToken - Authentication token for cron job
   * @param {Object} res - Express response object
   * @returns {Object} Payment plan limit status
   * @throws {Error} If limit processing fails
   */
  async limitToPayPlan(req, res) {
    try {
      const token = req.params.authToken
      const { data, code } = await cronService.limitToPayPlan(token)
      return restResponse(data, code, res)
    } catch (err) {
      errorCallback(err, res)
    }
  },

  /**
   * Status Immediate Attention
   * Updates the status of immediate attention requests
   * 
   * @param {Object} req - Express request object
   * @param {string} req.params.authToken - Authentication token for cron job
   * @param {Object} res - Express response object
   * @returns {Object} Status update confirmation
   * @throws {Error} If status update fails
   */
  async statusInmediateAttention(req, res) {
    try {
      const token = req.params.authToken
      const { data, code } = await cronService.statusInmediateAttention(token)
      return restResponse(data, code, res)
    } catch (err) {
      errorCallback(err, res)
    }
  },
}

export default Object.freeze(cronController)
