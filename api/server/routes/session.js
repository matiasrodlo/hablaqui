import { Router } from "express";
import sessionController from '../controllers/session'

const sessionRouter = Router();

sessionRouter.post(
    '/session/create',
    sessionController.create
);

export default sessionRouter;