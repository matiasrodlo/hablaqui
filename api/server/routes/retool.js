'use strict';

import { Router } from 'express';
import retoolController from '../controllers/retool';

const retoolRouter = Router();

/**
 * @description Devuelve las sesiones que se realizaran proximamente
 * @method GET
 * @route /api/v1/retool/sessions/next
 * @return Array con las sesiones que se aproximan
 */
retoolRouter.get('/retool/sessions/next', retoolController.getNextSessions);

/**
 * @description Devuelve la paga de los psicologos en la semana actual
 * @method GET
 * @route /api/v1/retool/payments/next
 * @return Array con los montos a pagar por psicólogo
 */
retoolRouter.get('/retool/payments/next', retoolController.getSessionsPayment);
export default retoolRouter;
