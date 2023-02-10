import sessionsService from '../services/sessions.js'
import { restResponse } from '../utils/responses/functions'
import { errorCallback } from '../utils/functions/errorCallback'

const sessionsController = {
  async getSessions (req, res) {
    try {
      const { idUser } = req.params
      const { user } = req
      const { data, code } = await sessionsService.getSessions(user, idUser)
      return restResponse(data, code, res)
    } catch (error) {
      errorCallback(error, res, 'Error obteniendo las sesiones')
    }
  },
  async getRemainingSessions (req, res) {
    try {
      const { spec } = req.params
      const { data, code } = await sessionsService.getRemainingSessions(spec)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },
  async cancelSession (req, res) {
    try {
      const { user } = req
      const { sessionsId, planId, id } = req.body
      const { data, code } = await sessionsService.cancelSession(
        user,
        planId,
        sessionsId,
        id
      )
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'error cancelando la sesion')
    }
  },
  async checkPlanTask (req, res) {
    try {
      const { data, code } = await sessionsService.checkPlanTask()
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'error')
    }
  },
  async createPlan (req, res) {
    try {
      const { body } = req
      const { data, code } = await sessionsService.createPlan(body)
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'error creando una plan')
    }
  },
  async createSession (req, res) {
    try {
      const { body, user } = req
      const { id, idPlan } = req.params
      const { data, code } = await sessionsService.createSession(
        user,
        id,
        idPlan,
        body
      )
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'error creando una sessión')
    }
  },
  async customNewSession (req, res) {
    try {
      const { user, body } = req
      const { data, code } = await sessionsService.customNewSession(user, body)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error creando la sesion')
    }
  },
  async getFormattedSessions (req, res) {
    try {
      const { idSpecialist, type } = req.params
      const { data, code } = await sessionsService.getFormattedSessions(
        idSpecialist,
        type
      )
      return restResponse(data, code, res)
    } catch (error) {
      errorCallback(error, res, 'Error obteniendo las sesiones formateadas')
    }
  },
  async formattedSessionsAll (req, res) {
    try {
      const { data, code } = await sessionsService.formattedSessionsAll()
      return restResponse(data, code, res)
    } catch (error) {
      errorCallback(error, res, 'Error obteniendo las sesiones formateadas')
    }
  },
  async sessionsLimit (req, res) {
    try {
      const { body } = req
      const { data, code } = await sessionsService.formattedSessionsAll(
        body.ids
      )
      return restResponse(data, code, res)
    } catch (error) {
      errorCallback(error, res, 'Error obteniendo las sesiones formateadas')
    }
  },
  async paymentsInfo (req, res) {
    try {
      const { user } = req
      const { data, code } = await sessionsService.paymentsInfo(user)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(
        e,
        res,
        'Error procesando la informacion de los pagos'
      )
    }
  },
  async reschedule (req, res) {
    try {
      const { id, sessionsId } = req.params
      const { user } = req
      const { newDate } = req.body
      const { data, code } = await sessionsService.reschedule(
        user,
        sessionsId,
        id,
        newDate
      )
      return restResponse(data, code, res)
    } catch (e) {
      errorCallback(e, res, 'error actualizando la cita')
    }
  },
  async updateSessions (req, res) {
    try {
      const { data, code } = await sessionsService.updateSessions(req.body)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },
  async deleteCommitment (req, res) {
    try {
      const { specId, planId } = req.params
      const { data, code } = await sessionsService.deleteCommitment(
        planId,
        specId
      )
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },
  async getAllSessions (req, res) {
    try {
      const { spec } = req.params
      const { data, code } = await sessionsService.getAllSessions(spec)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(e, res, 'Error procesando la solicitud')
    }
  },
  async paymentsInfoFromId (req, res) {
    try {
      const { spec } = req.params
      const { data, code } = await sessionsService.paymentsInfoFromId(spec)
      return restResponse(data, code, res)
    } catch (e) {
      return errorCallback(
        e,
        res,
        'Error procesando la informacion de los pagos'
      )
    }
  }
}

export default Object.freeze(sessionsController)
