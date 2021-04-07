import { Router } from 'express';
import passport from 'passport';
import psychologistsController from '../controllers/psychologist';
import grantAccess from '../middleware/strategies/rbac';

const psychologistsRouter = Router();

psychologistsRouter.get(
	'/psychologists/all',
	[
		passport.authenticate('jwt', { session: true }),
		grantAccess('readAny', 'psychologists'),
	],
	psychologistsController.getAll
);

export default psychologistsRouter;
