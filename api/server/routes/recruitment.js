import { Router } from 'express';
import recruitmentController from '../controllers/recruitment';

const recruitmentRouter = Router();

recruitmentRouter.post(
	'/recruitment/psychologist',
	recruitmentController.registerRecruitmentPsy
)

export default recruitmentRouter;