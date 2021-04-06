import { Router } from "express";
import sessionController from '../controllers/session'
import sessionSchema from '../schemas/session'
import validation from "../middleware/validation";

const sessionRouter = Router();

sessionRouter.post(
    '/session/create',
    [validation(sessionSchema.newSession, 'body')],
    sessionController.create
);

export default sessionRouter;