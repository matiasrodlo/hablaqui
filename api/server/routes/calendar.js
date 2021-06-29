import { Router } from 'express';
import calendarController from '../controllers/calendar';
import passport from 'passport';

const calendarRouter = Router();

calendarRouter.get('/calendar/get-events', calendarController.getEvents);
calendarRouter.get('/calendar/create-event', calendarController.createEvent);
calendarRouter.get('/calendar/auth-url', calendarController.getOauthUrl);
calendarRouter.post(
	'/calendar/success',
	[passport.authenticate('jwt', { session: true })],
	calendarController.getToken
);

export default Object.freeze(calendarRouter);
