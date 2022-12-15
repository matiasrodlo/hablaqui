'use strict';

import { Router } from 'express';
import cronController from '../controllers/cron';

const cronRouter = Router();

/**
 * @description: Calendariza correos para próximas sesiones una hora antes de la sesión y un día antes de la sesión
 * @method POST
 * @route /api/v1/cron/email-schedule/:authToken
 * @param {string} params.authToken - Token de autorización
 */
cronRouter.post(
	'/cron/email-schedule/:authToken',
	cronController.emailSchedule
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

/**
 * @description: Envia el correo de recordatorio de pago al usuario
 * @method POST
 * @route /api/v1/cron/reminder-payment/:authToken
 * @param {string} params.authToken - Token de autorización
 */
cronRouter.post(
	'/cron/reminder-payment/:authToken',
	cronController.reminderPayment
);

/**
 * @description: Envia el correo de recordatorio de renovación al usuario
 * @method POST
 * @route /api/v1/cron/reminder-renewal-email/:authToken
 * @param {string} params.authToken - Token de autorización
 */

cronRouter.post(
	'/cron/reminder-renewal-email/:authToken',
	cronController.reminderRenewal
);

export default cronRouter;
