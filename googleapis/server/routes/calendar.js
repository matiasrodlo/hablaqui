import { Router } from 'express';
import calendarController from '../controllers/calendar';
import passport from 'passport';

const calendarRouter = Router();

calendarRouter.get(
	'/calendar/get-events',
	[passport.authenticate('jwt', { session: true })],
	calendarController.getEvents
);
calendarRouter.get(
	'/calendar/create-event',
	[passport.authenticate('jwt', { session: true })],
	calendarController.createEvent
);
calendarRouter.get('/calendar/auth-url', calendarController.getOauthUrl);
calendarRouter.post(
	'/calendar/success',
	[passport.authenticate('jwt', { session: true })],
	calendarController.getToken
);
calendarRouter.get('/calendar/check-busy', calendarController.checkBusyTask);

export default Object.freeze(calendarRouter);
