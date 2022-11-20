'use strict'

import evaluationService from '../services/evaluation'
import { restResponse } from '../utils/responses/functions'
import { errorCallback } from '../utils/functions/errorCallback'

const evaluationController = {
  async addRating (req, res) {
    try {
      const { user } = req
      const { newRating, comment } = req.body
      const { psychologist } = req.params
      const { data, code } = await evaluationService.addRating(
        user,
        Number(newRating),
        comment,
        psychologist
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'error actualizando el rating')
    }
  },
  async getRating (req, res) {
    try {
      const { psychologist } = req.params
      const { data, code } = await evaluationService.getRating(
        psychologist
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'error consiguiendo el rating')
    }
  },
  async getEvaluationsPsy (req, res) {
    try {
      const { user } = req
      const { data, code } = await evaluationService.getEvaluationsPsy(
        user
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error devolviendo las evaluaciones')
    }
  },
  async getAllEvaluations (req, res) {
    try {
      const { psy } = req.params
      const { data, code } = await evaluationService.getAllEvaluations(
        psy
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(
        e,
        res,
        'Error devolviendo todas las evaluaciones'
      )
    }
  },
  async approveEvaluation (req, res) {
    try {
      const { evsId, evId } = req.params
      const { data, code } = await evaluationService.approveEvaluation(
        evsId,
        evId
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error aprobando la evaluación')
    }
  },
  async refuseEvaluation (req, res) {
    try {
      const { evsId, evId } = req.params
      const { data, code } = await evaluationService.refuseEvaluation(
        evsId,
        evId
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error rechazando la evaluación')
    }
  },
  async addEvaluation (req, res) {
    try {
      const { psyId } = req.params
      const { user, body } = req
      const { data, code } = await evaluationService.addEvaluation(
        user,
        psyId,
        body
      )
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error añadiendo la evaluación')
    }
  },
  async getEvaluationsById (req, res) {
    try {
      const { userId } = req.params
      const { data, code } = await evaluationService.getEvaluationsById(
        userId
      )
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error añadiendo la evaluación')
    }
  }
}

export default Object.freeze(evaluationController)
