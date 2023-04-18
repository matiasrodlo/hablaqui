'use strict'

import { Router } from 'express'
import appointmentsController from '../controllers/appointments'

const appointmentsRouter = Router()

appointmentsRouter.get(
  '/appointments/all' /*,
    [
        passport.authenticate('jwt', { session: true }),
        grantAccess('readAny', 'appointments'),
    ] */,
  appointmentsController.getAll
)

export default appointmentsRouter
