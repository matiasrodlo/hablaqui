'use strict';

import { Router } from 'express';
import matchController from '../controllers/match';

const matchRouter = Router();

/**
 * @description Guarda las respuestas de un usuario del flujo del match
 * @method POST
 * @route /api/v1/match/create-answers/:id
 * @param {Object} body.payload - Respuestas del usuario
 * @param {String} params.user - Id del usuario
 * @return Respuestas guardadas
 */
matchRouter.post('/match', matchController.createAnswers);

/**
 * @description Obtiene las respuestas de un usuario del flujo del match
 * @method GET
 * @route /api/v1/match/get-answers/:id
 * @param {String} params.user - Id del usuario
 * @return {Object} Respuestas del usuario
 */
matchRouter.get('/match', matchController.getAnswers);

/**
 * @description Actualiza las respuestas de un usuario del flujo del match
 * @method POST
 * @route /api/v1/match/update-answers/:id
 * @param {Object} body.payload - Respuestas actualizadas del usuario
 * @param {String} params.user - Id del usuario
 * @return Respuestas actualizadas
 */
matchRouter.put('/match', matchController.updateAnswers);

/**
 * @description Elimina las respuestas de un usuario del flujo del match
 * @method DELETE
 * @route /api/v1/match/delete-answers/:id
 * @param {String} params.user - Id del usuario
 * @return Respuestas eliminadas
 */
matchRouter.delete('/match', matchController.deleteAnswers);

export default matchRouter;
