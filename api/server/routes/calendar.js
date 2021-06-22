import { Router } from 'express';
import calendarController from '../controllers/calendar';

const calendarRouter = Router();

calendarRouter.get('/calendar/get-events/:token', calendarController.getEvents);
calendarRouter.get(
	'/calendar/create-event/:token',
	calendarController.createEvent
);
calendarRouter.get('/calendar/auth-url', calendarController.getOauthUrl);
calendarRouter.get('/calendar/success', calendarController.getToken);

export default Object.freeze(calendarRouter);
