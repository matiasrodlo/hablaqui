import { Router } from 'express';
import passport from 'passport';
import multer from '../middleware/multer';
import storage from '../middleware/storage';
import psychologistsController from '../controllers/psychologist';

const psychologistsRouter = Router();

psychologistsRouter.get('/psychologists/all', psychologistsController.getAll);
psychologistsRouter.post(
	'/psychologists/match',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.match
);
psychologistsRouter.put(
	'/psychologist/update/:id/avatar',
	[
		passport.authenticate('jwt', { session: true }),
		multer.single('avatar'),
		storage,
	],
	psychologistsController.updateAvatar
);

export default psychologistsRouter;
