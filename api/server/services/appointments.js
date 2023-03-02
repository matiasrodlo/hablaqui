'use strict'

import { logInfo } from '../config/pino.js'
import Appointments from '../models/appointments.js'
import { okResponse } from '../utils/responses/functions.js'

const getAll = async () => {
  // Busca todas las consultas
  logInfo('obtuvo todas las consultas')
  let appointments = await Appointments.find()

  // Retorna solo el nombre de las consultas
  appointments = appointments.map(item => item.name)
  return okResponse('consultas obtenidas', { appointments })
}

const appointmentsService = {
  getAll,
}

export default Object.freeze(appointmentsService)
