import { Router } from 'express';
import passport from 'passport';
import multer from '../middleware/multer';
import storage from '../middleware/storage';
import psychologistsController from '../controllers/psychologist';

const psychologistsRouter = Router();

psychologistsRouter.get('/psychologists/all', psychologistsController.getAll);
psychologistsRouter.get(
	'/psychologists/:username',
	psychologistsController.getByUsername
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
export default psychologistsRouter;
