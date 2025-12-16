// Recruitment Controller
// This controller handles HTTP requests related to recruitment operations, such as registering, updating, retrieving, approving, and flagging onboarding for recruitment profiles.

'use strict'

import recruitmentService from '../services/recruitment'
import { restResponse } from '../utils/responses/functions'
import { errorCallback } from '../utils/functions/errorCallback'

// Controller object containing recruitment-related operations
const recruitmentController = {
  // Register a new recruitment profile
  async register(req, res) {
    try {
      const { body, user } = req
      const { data, code } = await recruitmentService.register(user, body)
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error registering the applicant')
    }
  },
  // Update an existing recruitment profile
  async update(req, res) {
    try {
      const { body } = req
      const step = req.query.step
      const { data, code } = await recruitmentService.update(body, step)
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error updating the specialist')
    }
  },
  // Get recruitment details by email
  async get(req, res) {
    try {
      const { email } = req.params
      const { data, code } = await recruitmentService.get(email)
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error retrieving the applicant')
    }
  },
  // Get all recruitment profiles
  async getAll(req, res) {
    try {
      const { data, code } = await recruitmentService.getAll()
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error retrieving the applicants')
    }
  },
  // Approve a recruitment profile
  async approve(req, res) {
    try {
      const { user } = req
      const { email } = req.params
      const { data, code } = await recruitmentService.approve(user, email)
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error approving the applicant')
    }
  },
  // Update onboarding flag for a recruitment profile
  async flagOnboarding(req, res) {
    try {
      const { recruitedId } = req.params
      const { data, code } = await recruitmentService.flagOnboarding(
        recruitedId,
        req.body
      )
      restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'Error updating onboarding flag for the applicant')
    }
  },
}

export default Object.freeze(recruitmentController)
