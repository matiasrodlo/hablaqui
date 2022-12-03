'use strict';

import { Router } from 'express';
import matchController from '../controllers/match';

const matchRouter = Router();

/**
 * @description Guarda las respuestas de un usuario del flujo del match
 * @method POST
 * @route /api/v1/match/create-answers/:userid
 * @param {Object} body.payload - Respuestas del usuario
 * @param {String} params.user - Id del usuario
 * @return Respuestas guardadas
 */
matchRouter.post(
	'/match/create-answers/:userid',
	matchController.createAnswers
);

/**
 * @description Obtiene las respuestas de un usuario del flujo del match
 * @method GET
 * @route /api/v1/match/get-answers/:userid
 * @param {String} params.userid - Id del usuario
 * @return {Object} Respuestas del usuario
 */
matchRouter.get('/match/get-answers/:userid', matchController.getAnswers);

/**
 * @description Actualiza las respuestas de un usuario del flujo del match
 * @method POST
 * @route /api/v1/match/update-answers/:userid
 * @param {Object} body.payload - Respuestas actualizadas del usuario
 * @param {String} params.userid - Id del usuario
 * @return Respuestas actualizadas
 */
matchRouter.put('/match/update-answers/:userid', matchController.updateAnswers);

/**
 * @description Elimina las respuestas de un usuario del flujo del match
 * @method DELETE
 * @route /api/v1/match/delete-answers/:id
 * @param {String} params.userid - Id del usuario
 * @return Respuestas eliminadas
 */
matchRouter.delete(
	'/match/delete-answers/:userid',
	matchController.deleteAnswers
);

export default matchRouter;
