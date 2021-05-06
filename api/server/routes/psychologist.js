import { Router } from 'express';
import passport from 'passport';
import psychologistsController from '../controllers/psychologist';

const psychologistsRouter = Router();

psychologistsRouter.get('/psychologists/all', psychologistsController.getAll);
psychologistsRouter.post(
	'/psychologists/match',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.match
);

export default psychologistsRouter;
