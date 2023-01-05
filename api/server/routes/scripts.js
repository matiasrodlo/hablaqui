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

/**
 * @description: Script removing the profession to psychologist
 * @route /api/v1/scripts/remove-profesion
 * @method PUT
 */
scriptsRouter.put(
	'/scripts/remove-profesion',
	scriptsController.removeProfesion
);

/**
 * @description: Script removing the role to psychologist
 * @route /api/v1/scripts/remove-rol
 * @method DELETE
 */
scriptsRouter.delete('/scripts/remove-rol', scriptsController.removeRol);

export default scriptsRouter;
