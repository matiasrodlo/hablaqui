import { Router } from 'express';
import cronController from '../controllers/cron';

const cronRouter = Router();

//cronRouter.post('/emailscheduling/schedule', cronController.scheduleEmails);

export default cronRouter;
