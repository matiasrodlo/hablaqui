'use strict';

import { Router } from 'express';
import cronController from '../controllers/cron';

const cronRouter = Router();

cronRouter.post(
	'/cron/email-schedule/:authToken',
	cronController.scheduleEmails
);

cronRouter.post(
	'/cron/session-status/:authToken',
	cronController.sessionStatus
);

cronRouter.post(
	'/cron/email-chat/:authToken',
	cronController.scheduleChatEmails
);

cronRouter.post('/cron/limit-to-pay/:authToken', cronController.limitToPayPlan);

export default cronRouter;
