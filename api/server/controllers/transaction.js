/**
 * Transaction Controller
 * 
 * This module handles all transaction-related operations in the Hablaquí API.
 * It provides endpoints for payment requests, transaction management, and payment processing.
 * 
 * @module controllers/transaction
 */

'use strict'

import transactionService from '../services/transaction'
import { restResponse } from '../utils/responses/functions'
import { errorCallback } from '../utils/functions/errorCallback'

const transactionController = {
  /**
   * Complete Payments Request
   * Processes and completes a pending payment request for a specialist
   * 
   * @param {Object} req - Express request object
   * @param {string} req.params.spec - Specialist ID
   * @param {Object} res - Express response object
   * @returns {Object} Payment request completion status
   * @throws {Error} If payment request cannot be completed
   */
  async completePaymentsRequest(req, res) {
    try {
      const { spec } = req.params
      const { data, code } = await transactionService.completePaymentsRequest(
        spec
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },

  /**
   * Create Payments Request
   * Creates a new payment request for a specialist
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated specialist object
   * @param {Object} res - Express response object
   * @returns {Object} Created payment request information
   * @throws {Error} If payment request cannot be created
   */
  async createPaymentsRequest(req, res) {
    try {
      const { user } = req
      const { data, code } = await transactionService.createPaymentsRequest(
        user
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },

  /**
   * Get Transactions
   * Retrieves all transactions for a specific user
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {Object} res - Express response object
   * @returns {Array} List of user transactions
   * @throws {Error} If transactions cannot be retrieved
   */
  async getTransactions(req, res) {
    try {
      const { user } = req
      const { data, code } = await transactionService.getTransactions(user)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },

  /**
   * Generate Transaction
   * Creates a new transaction for a session
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {Object} req.body - Transaction information
   * @param {number} req.body.total - Transaction amount
   * @param {string} req.body.session - Session ID
   * @param {string} req.body.idSpec - Specialist ID
   * @param {Object} res - Express response object
   * @returns {Object} Generated transaction information
   * @throws {Error} If transaction cannot be generated
   */
  async generateTransaction(req, res) {
    try {
      const { user } = req
      const { total, session, idSpec } = req.body
      const { data, code } = await transactionService.generateTransaction(
        user,
        total,
        session,
        idSpec
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },

  /**
   * Get All Transactions
   * Retrieves all transactions in the system
   * 
   * @param {Object} req - Express request object
   * @param {Object} req.user - Authenticated user object
   * @param {Object} res - Express response object
   * @returns {Array} List of all transactions
   * @throws {Error} If transactions cannot be retrieved
   */
  async getAllTransactions(req, res) {
    try {
      const { user } = req
      const { data, code } = await transactionService.getAllTransactions(user)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },
}

export default Object.freeze(transactionController)
