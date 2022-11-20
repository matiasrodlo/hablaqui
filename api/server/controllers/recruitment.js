'use strict'

import recruitmentService from '../services/recruitment'
import { restResponse } from '../utils/responses/functions'
import { errorCallback } from '../utils/functions/errorCallback'

const recruitmentController = {
  /**
	 * @description - This function is used to register the recruitment details and profile
	 * @param {object} req - The request object (Recruitment details)
	 * @param {object} res - The response object (Response code and message)
	 * @returns {object} - The response object
	 */
  async register (req, res) {
    try {
      const { body, user } = req
      const { data, code } = await recruitmentService.register(
        user,
        body
      )
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error registrando el postulado')
    }
  },
  /**
	 * @description - This function is used to update the recruitment details of a psychologist
	 * @param {object} req - The request object (Recruitment details to update)
	 * @param {object} res - The response object (Response code and message)
	 * @returns {object} - The response object
	 */
  async update (req, res) {
    try {
      const { body } = req
      const step = req.query.step
      const { data, code } = await recruitmentService.update(body, step)
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error actualizando el psicologo')
    }
  },
  /**
	 * @description - This function is used to get the recruitment details of a psychologist by mail from params
	 * @param {object} req - The request object (Recruitment email of the profile)
	 * @param res - The response object (Response code and profile)
	 * @returns {object} - The response object
	 */
  async get (req, res) {
    try {
      const { email } = req.params
      const { data, code } = await recruitmentService.get(email)
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error obteniendo el postulante')
    }
  },
  /**
	 * @description - This function is used to get all recruitment
	 * @param {object} req - The request object (Recruitment email of the profile)
	 * @param res - The response object (Response code and profile)
	 * @returns {object} - The response object
	 */
  async getAll (req, res) {
    try {
      const { data, code } = await recruitmentService.getAll()
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error obteniendo el postulante')
    }
  },
  /**
	 * @description - This function is used to approve a specific Recruitment profile by mail
	 * @param {object} req - The request object (Recruitment email of the profile)
	 * @param res - The response object (Response code and the new Psychologist profile)
	 * @returns {object} - The response object
	 */
  async approve (req, res) {
    try {
      const { user } = req
      const { email } = req.params
      const { data, code } = await recruitmentService.approve(
        user,
        email
      )
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error aprobando el postulante')
    }
  },
  /**
	 * @description - This function is used to update oonboarding flag from recruitment
	 * @param {object} req - The request object (Recruitment id of the profile and new flags to update)
	 * @param res - The response object (Response code and the new recruitment profile)
	 * @returns {object} - The response object
	 */
  async flagOnboarding (req, res) {
    try {
      const { recruitedId } = req.params
      const { data, code } = await recruitmentService.flagOnboarding(
        recruitedId,
        req.body
      )
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error aprobando el postulante')
    }
  }
}

export default Object.freeze(recruitmentController)
