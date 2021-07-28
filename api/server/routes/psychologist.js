import { Router } from 'express';
import passport from 'passport';
import multer from '../middleware/multer';
import storage from '../middleware/storage';
import psychologistsController from '../controllers/psychologist';

const psychologistsRouter = Router();

psychologistsRouter.get('/psychologists/all', psychologistsController.getAll);
psychologistsRouter.get(
	'/psychologists/one/:info',
	psychologistsController.getByData
);
psychologistsRouter.post(
	'/psychologists/match',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.match
);
psychologistsRouter.post(
	'/psychologists/register',
	[multer.single('avatar'), storage],
	psychologistsController.register
);
psychologistsRouter.post(
	'/psychologists/session/create',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.createSession
);
psychologistsRouter.post(
	'/psychologists/reschedule/:id',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.reschedule
);
psychologistsRouter.patch(
	'/psychologist/set-schedule',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.setSchedule
);
psychologistsRouter.delete(
	'/psychologist/cancel-session',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.cancelSession
);
psychologistsRouter.patch(
	'/psychologist/update-payment-method',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.updatePaymentMethod
);

psychologistsRouter.patch(
	'/psychologist/update-profile',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.updatePsychologist
);

psychologistsRouter.delete(
	'/psychologist/delete-one',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.deleteOne
);

psychologistsRouter.post(
	'/psychologist/update-prices',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.setPrice
);

psychologistsRouter.post(
	'/psychologist/add-rating/:psychologist',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.addRating
);
psychologistsRouter.get(
	'/psychologist/get-rating/:psychologist',
	psychologistsController.getRating
);
psychologistsRouter.get(
	'/psychologist/plan-task',
	psychologistsController.checkPlanTask
);

export default psychologistsRouter;
