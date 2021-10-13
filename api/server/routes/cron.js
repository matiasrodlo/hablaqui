'use strict';

import { Router } from 'express';
import cronController from '../controllers/cron';

const cronRouter = Router();

cronRouter.post('/emails/schedule', cronController.scheduleEmails);

export default cronRouter;
