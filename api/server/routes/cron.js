'use strict';

import { Router } from 'express';
import cronController from '../controllers/cron';

const cronRouter = Router();

/**
 * @description: Calendariza correos para próximas sesiones
 * @method POST
 * @route /api/v1/cron/email-schedule/:authToken
 * @param {string} params.authToken - Token de autorización
 */
cronRouter.post(
	'/cron/email-schedule/:authToken',
	cronController.scheduleEmails
);

/**
 * @description: Verifica y actualiza el estado de las sesiones
 * @method POST
 * @route /api/v1/cron/session-status/:authToken
 * @param {string} params.authToken - Token de autorización
 */
cronRouter.post(
	'/cron/session-status/:authToken',
	cronController.sessionStatus
);

/**
 * @description: Calendariza los correos de chat para ser enviados
 * @method POST
 * @route /api/v1/cron/email-chat/:authToken
 * @param {string} params.authToken - Token de autorización
 */
cronRouter.post(
	'/cron/email-chat/:authToken',
	cronController.scheduleChatEmails
);

/**
 * @description: Verifica el límite de tiempo para pagar un plan pendiente de un consultante
 * @method POST
 * @route /api/v1/cron/limit-to-pay/:authToken
 * @param {string} params.authToken - Token de autorización
 */
cronRouter.post('/cron/limit-to-pay/:authToken', cronController.limitToPayPlan);

/**
 * @description: --------
 * @method POST
 * @route /api/v1/cron/status/attention/:authToken
 * @param {string} params.authToken - Token de autorización
 */
cronRouter.post(
	'/cron/status/attention/:authToken',
	cronController.statusInmediateAttention
);
export default cronRouter;
