'use strict';

import { Router } from 'express';
import retoolController from '../controllers/retool';

const retoolRouter = Router();

retoolRouter.get('/retool/sessions/next', retoolController.getNextSessions);
export default retoolRouter;
