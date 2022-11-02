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
 * @description Devuelve la paga de los psicologos dentro de un intervalo de tiempo
 * @method GET
 * @param {String} params.startDate - Fecha de inicio del intervalo
 * @param {String} params.endDate - Fecha de término del intervalo
 * @route /api/v1/retool/payments/next/:startDate/:endDate
 * @return Array con los montos a pagar por psicólogo
 */
retoolRouter.get(
	'/retool/payments/next/:startDate/:endDate',
	retoolController.getSessionsPayment
);

retoolRouter.get('/retool/fix/appointments', retoolController.fixSpecialities);
export default retoolRouter;
