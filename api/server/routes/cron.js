'use strict';

import { Router } from 'express';
import cronController from '../controllers/cron';

const cronRouter = Router();

/**
 * @description: Calendariza correos para próximas sesiones
 * @param {string} params.authToken - Token de autorización
 */
cronRouter.post(
	'/cron/email-schedule/:authToken',
	cronController.scheduleEmails
);

/**
 * @description: Verifica y actualiza el estado de las sesiones
 * @param {string} params.authToken - Token de autorización
 */
cronRouter.post(
	'/cron/session-status/:authToken',
	cronController.sessionStatus
);

/**
 * @description: Calendariza los correos de chat para ser enviados
 * @param {string} params.authToken - Token de autorización
 */
cronRouter.post(
	'/cron/email-chat/:authToken',
	cronController.scheduleChatEmails
);

/**
 * @description: Verifica el límite de tiempo para pagar un plan pendiente de un consultante
 * @param {string} params.authToken - Token de autorización
 */
cronRouter.post('/cron/limit-to-pay/:authToken', cronController.limitToPayPlan);

/**
 * @description: --------
 * @param {string} params.authToken - Token de autorización
 */
cronRouter.post(
	'/cron/status/attention/:authToken',
	cronController.statusInmediateAttention
);
export default cronRouter;
