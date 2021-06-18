import { Router } from 'express';
import calendarController from '../controllers/calendar';

const calendarRouter = Router();

calendarRouter.get('/calendar/get-events', calendarController.getEvents);
calendarRouter.get('/calendar/create-event', calendarController.createEvent);

export default Object.freeze(calendarRouter);
