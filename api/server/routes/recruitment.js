import { Router } from 'express';
import recruitmentController from '../controllers/recruitment';
import passport from 'passport';

const recruitmentRouter = Router();

recruitmentRouter.post(
	'/recruitment/register',
	[passport.authenticate('jwt', { session: true })],
	recruitmentController.register
);

export default recruitmentRouter;
