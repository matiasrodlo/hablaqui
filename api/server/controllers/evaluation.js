// Evaluation Controller
// This controller handles HTTP requests related to evaluation operations, such as adding ratings, retrieving evaluations, and approving or refusing evaluations.

'use strict'

import evaluationService from '../services/evaluation'
import { restResponse } from '../utils/responses/functions'
import { errorCallback } from '../utils/functions/errorCallback'

// Controller object containing evaluation-related operations
const evaluationController = {
  // Add a new rating for a specialist
  async addRating(req, res) {
    try {
      const { user } = req
      const { newRating, comment } = req.body
      const { specialist } = req.params
      const { data, code } = await evaluationService.addRating(
        user,
        Number(newRating),
        comment,
        specialist
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'error actualizando el rating')
    }
  },
  // Get the rating for a specialist
  async getRating(req, res) {
    try {
      const { specialist } = req.params
      const { data, code } = await evaluationService.getRating(specialist)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'error consiguiendo el rating')
    }
  },
  // Get evaluations for a specialist
  async getEvaluationsSpec(req, res) {
    try {
      const { user } = req
      const { data, code } = await evaluationService.getEvaluationsSpec(user)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error devolviendo las evaluaciones')
    }
  },
  // Get all evaluations for a user
  async getAllEvaluations(req, res) {
    try {
      const { user } = req
      const { data, code } = await evaluationService.getAllEvaluations(user)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error devolviendo todas las evaluaciones')
    }
  },
  // Approve an evaluation
  async approveEvaluation(req, res) {
    try {
      const { user } = req
      const { evsId, evId } = req.params
      const { data, code } = await evaluationService.approveEvaluation(
        user,
        evsId,
        evId
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error aprobando la evaluación')
    }
  },
  // Refuse an evaluation
  async refuseEvaluation(req, res) {
    try {
      const { user } = req
      const { evsId, evId } = req.params
      const { data, code } = await evaluationService.refuseEvaluation(
        user,
        evsId,
        evId
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error rechazando la evaluación')
    }
  },
  // Add a new evaluation for a specialist
  async addEvaluation(req, res) {
    try {
      const { specId } = req.params
      const { user, body } = req
      const { data, code } = await evaluationService.addEvaluation(
        user,
        specId,
        body
      )
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error añadiendo la evaluación')
    }
  },
  // Get evaluations by user ID
  async getEvaluationsById(req, res) {
    try {
      const { userId } = req.params
      const { data, code } = await evaluationService.getEvaluationsById(userId)
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error añadiendo la evaluación')
    }
  },
}

export default Object.freeze(evaluationController)
