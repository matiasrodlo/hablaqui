'use strict';

import { Router } from 'express';
import cronController from '../controllers/cron';
import permission from '../middleware/permission';
import cors from 'cors';

const { corsCron } = permission;

const cronRouter = Router();

cronRouter.post(
	'/cron/email-schedule/:authToken',
	[cors(corsCron)],
	cronController.scheduleEmails
);

cronRouter.post(
	'/cron/session-status/:authToken',
	[cors(corsCron)],
	cronController.sessionStatus
);

cronRouter.post(
	'/cron/email-chat/:authToken',
	[cors(corsCron)],
	cronController.scheduleChatEmails
);

export default cronRouter;
