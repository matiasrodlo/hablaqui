'use strict';

import { Router } from 'express';
import passport from 'passport';
import dashboardController from '../controllers/dashboard';

const dashboardRouter = Router();

/**
 * @description Devuelve las sesiones que se realizaran proximamente
 * @method GET
 * @route /api/v1/retool/sessions/next
 * @return Array con las sesiones que se aproximan
 */
dashboardRouter.get(
	'/retool/sessions/next',
	dashboardController.getNextSessions
);

/**
 * @description Devuelve la paga de los psicologos dentro de un intervalo de tiempo
 * @method GET
 * @param {String} params.startDate - Fecha de inicio del intervalo
 * @param {String} params.endDate - Fecha de término del intervalo
 * @route /api/v1/retool/payments/next/:startDate/:endDate
 * @return Array con los montos a pagar por psicólogo
 */
dashboardRouter.get(
	'/retool/payments/next/:startDate/:endDate',
	dashboardController.getSessionsPayment
);

dashboardRouter.get(
	'/retool/fix/appointments',
	dashboardController.fixSpecialities
);

dashboardRouter.get(
	'/dashboard/pay-mount',
	[passport.authenticate('jwt', { session: true })],
	dashboardController.getMountToPay
);

/**
 * @description Cambia la visibilidad de un psicologo
 * @method PUT
 * @param {Boolean} params.visibility - Visibilidad del psicologo
 * @param {String} params.id - Id del psicologo
 * @route /api/v1/dashboard/specialist-visibility/:psyId/:visibility
 */
dashboardRouter.put(
	'/dashboard/specialist-visibility/:psyId/:visibility',
	[passport.authenticate('jwt', { session: true })],
	dashboardController.specialistVisibility
);
export default dashboardRouter;
