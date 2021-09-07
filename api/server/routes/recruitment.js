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
	'/recruitment/:id',
	[passport.authenticate('jwt', { session: true })],
	recruitmentController.update
);

export default recruitmentRouter;
