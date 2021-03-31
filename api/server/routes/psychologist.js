import { Router } from 'express';
import passport from 'passport';
import psychologistsController from '../controllers/psychologist';
import grantAccess from '../middleware/strategies/rbac';

const psychologistsRouter = Router();

psychologistsRouter.get(
    '/psychologists/all',
    [
        passport.authenticate('jwt', { session: false }),
        grantAccess('readAny', 'psychologists')
    ],
    psychologistsController.getAll
);

export default psychologistsRouter;