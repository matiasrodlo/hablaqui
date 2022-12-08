'use strict';

import { Router } from 'express';
import matchController from '../controllers/match';

const matchRouter = Router();

/**
 * @description Guarda las respuestas de un usuario del flujo del match
 * @method POST
 * @route /api/v1/match/create-answers/:userid
 * @param {Object} body - Respuestas del usuario
 * @param {String} params.userId - Id del usuario
 * @return Respuestas guardadas
 */
matchRouter.post(
	'/match/create-answers/:userId',
	matchController.createAnswers
);

/**
 * @description Obtiene las respuestas de un usuario del flujo del match
 * @method GET
 * @route /api/v1/match/get-answers/:userid
 * @param {String} params.userId - Id del usuario
 * @return {Object} Respuestas del usuario
 */
matchRouter.get('/match/get-answers/:userId', matchController.getAnswers);

/**
 * @description Actualiza las respuestas de un usuario del flujo del match
 * @method PUT
 * @route /api/v1/match/update-answers/:userid
 * @param {Object} body - Respuestas actualizadas del usuario
 * @param {String} params.userId - Id del usuario
 * @return Respuestas actualizadas
 */
matchRouter.put('/match/update-answers/:userId', matchController.updateAnswers);

/**
 * @description Elimina las respuestas de un usuario del flujo del match
 * @method DELETE
 * @route /api/v1/match/delete-answers/:id
 * @param {String} params.userId - Id del usuario
 * @return Respuestas eliminadas
 */
matchRouter.delete(
	'/match/delete-answers/:userId',
	matchController.deleteAnswers
);

export default matchRouter;
