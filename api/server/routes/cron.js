import { Router } from 'express';
import passport from 'passport';
import cronController from '../controllers/cron';

const cronRouter = Router();

cronRouter.post(
	'/emailscheduling/schedule',
	[passport.authenticate('jwt', { session: true })],
	cronController.scheduleEmails
);
