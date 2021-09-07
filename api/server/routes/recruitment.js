import { Router } from 'express';
import recruitmentController from '../controllers/recruitment';
import passport from 'passport';

const recruitmentRouter = Router();
/**
 * @description: Route to post a new recruitment profile for psychologist
 * @route: /api/v1/recruitment/psychologist
 * @method: POST
 * @access: public
 */
recruitmentRouter.post(
	'/recruitment/register',
	[passport.authenticate('jwt', { session: true })],
	recruitmentController.register
);
recruitmentRouter.put(
	'/recruitment/update',
	[passport.authenticate('jwt', { session: true })],
	recruitmentController.update
);
recruitmentRouter.get(
	'/recruitment/:email',
	[passport.authenticate('jwt', { session: true })],
	recruitmentController.get
);
export default recruitmentRouter;
