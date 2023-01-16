'use strict';

import { Router } from 'express';
import scriptsController from '../controllers/scripts';

const scriptsRouter = Router();
/**
 * @description: Script changing the role of specialist to specialist
 * @route /api/v1/scripts/change-role
 * @method PUT
 */
scriptsRouter.put('/scripts/change-role', scriptsController.changeRole);
/**
 * @description: Script adding the profession to specialist
 * @route /api/v1/scripts/add-profesion
 * @method POST
 */
scriptsRouter.post('/scripts/add-profesion', scriptsController.addProfesion);

/**
 * @description: Script removing the profession to specialist
 * @route /api/v1/scripts/remove-profesion
 * @method PUT
 */
scriptsRouter.put(
	'/scripts/remove-profesion',
	scriptsController.removeProfesion
);

/**
 * @description: Script removing the role to specialist
 * @route /api/v1/scripts/remove-rol
 * @method DELETE
 */
scriptsRouter.delete('/scripts/remove-rol', scriptsController.removeRol);

/**
 * @description: Script migrating all the data
 * @route /api/v1/scripts/migrate-all
 * @method PUT
 */
scriptsRouter.put('/scripts/migrate-all', scriptsController.migrateAll);

/**
 * @description: Script step back to the previous version
 * @route /api/v1/scripts/step-back
 * @method PUT
 */
scriptsRouter.put('/scripts/step-back', scriptsController.stepBack);

export default scriptsRouter;
