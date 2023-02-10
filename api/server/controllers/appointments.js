'use strict'
import { restResponse } from '../utils/responses/functions'
import appointmentsService from '../services/appointments'
import { errorCallback } from '../utils/functions/errorCallback'

const appointmentsController = {
  async getAll (req, res) {
    try {
      const { data, code } = await appointmentsService.getAll()
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'error consiguiendo las consultas')
    }
  }
}

export default Object.freeze(appointmentsController)
