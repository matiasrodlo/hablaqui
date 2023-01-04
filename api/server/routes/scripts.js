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
/**
 * @description: Script adding the profession to psychologist
 * @route /api/v1/scripts/add-profesion
 * @method POST
 */
scriptsRouter.post('/scripts/add-profesion', scriptsController.addProfesion);

scriptsRouter.post(
	'/scripts/remove-profesion',
	scriptsController.removeProfesion
);

scriptsRouter.post('/scripts/remove-rol', scriptsController.removeRol);

export default scriptsRouter;
