import { Router } from 'express';
import passport from 'passport';
import grantAccess from '../middleware/strategies/rbac';
import appointmentsController from '../controllers/appointments';

const appointmentsRouter = Router();

appointmentsRouter.get(
	'/appointments/all' /*,
    [
        passport.authenticate('jwt', { session: true }),
        grantAccess('readAny', 'appointments'),
    ]*/,
	appointmentsController.getAll
);

export default appointmentsRouter;
