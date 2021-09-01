import { Router } from 'express';
import recruitmentController from '../controllers/recruitment';

const recruitmentRouter = Router();

recruitmentRouter.post(
	'/recruitment/psychologist',
	recruitmentController.registerPsychologist
)

export default recruitmentRouter;