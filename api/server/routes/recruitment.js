import { Router } from 'express';
import recruitmentController from '../controllers/recruitment';

const recruitmentRouter = Router();
/**
 * @description: Route to post a new recruitment profile for psychologist
 * @route: /api/v1/recruitment/psychologist
 * @method: POST
 * @access: public
 */
recruitmentRouter.post(
	'/recruitment/psychologist',
	recruitmentController.registerRecruitmentPsy
);
recruitmentRouter.put(
	'/recruitment/psychologist/:id',
	recruitmentController.updateRecruitmentPsy
);

export default recruitmentRouter;
