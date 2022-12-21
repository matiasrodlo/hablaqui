'use strict';

import { Router } from 'express';
import scriptsController from '../controllers/scripts';

const scriptsRouter = Router();
/**
 * @description: Script changing the role of psychologist to specialist
 * @route /api/v1/scripts/change-role
 * @method PUT
 */
scriptsRouter.put('/scripts/change-role', scriptsController.changeRole);

export default scriptsRouter;
