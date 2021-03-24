import { Router } from "express";
import passport from "passport";
import grantAccess from "../middleware/strategies/rbac";

const appointmentsRouter = Router();

appointmentsRouter.get(
    '/appointments',
    [
        passport.authenticate('jwt', { session: false }),
        grantAccess('readAny', 'appointments'),
    ],
    
)