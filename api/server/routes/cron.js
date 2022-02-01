'use strict';

import { Router } from 'express';
import cronController from '../controllers/cron';
import permission from '../middleware/permission';

const { corsCron } = permission;

const cronRouter = Router();

cronRouter.post(
	'/cron/email-schedule/:authToken',
	[corsCron],
	cronController.scheduleEmails
);

cronRouter.post(
	'/cron/session-status/:authToken',
	[corsCron],
	cronController.sessionStatus
);

cronRouter.post(
	'/cron/email-chat/:authToken',
	[corsCron],
	cronController.scheduleChatEmails
);

export default cronRouter;
