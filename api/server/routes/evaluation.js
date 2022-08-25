'use strict';
import { Router } from 'express';
import passport from 'passport';
import evaluationController from '../controllers/evaluation';

const evaluationRouter = Router();

/**
 * Add new rating
 * req.body = { newRating: number, comment: string }
 */
/**
 * @description Añade una nueva evaluación al perfil del psicólogo
 * @method POST
 * @route /api/v1/psychologist/add-rating/:psychologist
 * @param {ObjectId} params.psychologist - Id del psicólogo que es referenciado en la evaluación
 * @param {String} body.newRating - Puntaje de la evaluación
 * @param {String} body.comment - Comentario de la evaluación
 * @returns {Object} psicólogo con los datos actualizados
 * @access authenticated
 */
evaluationRouter.post(
	'/psychologist/add-rating/:psychologist',
	[passport.authenticate('jwt', { session: true })],
	evaluationController.addRating
);

/**
 * @description Consigue las calificaciones de un psicólogo en específico
 * @method GET
 * @route /api/v1/psychologist/get-rating/:psychologist
 * @param {ObjectId} params.psychologist - Id del psicólogo de quien queremos las evaluaciones o ratings
 * @returns {Number} puntuación promedio del psicólogo
 */
evaluationRouter.get(
	'/psychologist/get-rating/:psychologist',
	evaluationController.getRating
);

/**
 * @description Devuelve todas las evaluaciones del psicólogo logeado
 * @method GET
 * @route /api/v1/psychologist/get-evaluations
 * @returns {Object} Evaluaciones hechas y sus puntajes
 * @access authenticated
 */
evaluationRouter.get(
	'/psychologist/get-evaluations',
	[passport.authenticate('jwt', { session: true })],
	evaluationController.getEvaluationsPsy
);

/**
 * @description Obtiene las evaluaciones de un psicólogo en particular
 * @method GET
 * @route /api/v1/psychologist/get-all-evaluations/:psy
 * @param {ObjectId} params.psy - Id del psicólogo
 * @returns {Object} Evaluaciones hechas y sus puntajes
 */
evaluationRouter.get(
	'/psychologist/get-all-evaluations/:psy',
	evaluationController.getAllEvaluations
);

/**
 * @description Permite aprobar una evaluación hecha por un consultante
 * @method POST
 * @route /api/v1/psychologist/approve-evaluation/:evsId/:evId
 * @param {ObjectId} params.evsId - Id del esquema de evaluaciones
 * @param {ObjectId} params.evId - Id de la evaluación
 * @returns {Object} Evaluación aprobada
 */
evaluationRouter.post(
	'/psychologist/approve-evaluation/:evsId/:evId',
	evaluationController.approveEvaluation
);

/**
 * @description Permite rechazar una evaluación hecha por un consultante
 * @method POST
 * @route /api/v1/psychologist/refuse-evaluation/:evsId/:evId
 * @param {ObjectId} params.evsId - Id del esquema de evaluaciones
 * @param {ObjectId} params.evId - Id de la evaluación
 * @returns {Object} Evaluación rechazada
 */
evaluationRouter.post(
	'/psychologist/refuse-evaluation/:evsId/:evId',
	evaluationController.refuseEvaluation
);

/**
 * @description Sube una evaluación de un usuario sobre un psicólogo
 * @method POST
 * @route /api/v1/user/evaluation/:psyId
 * @param {String} params.psyId - Id del psicólogo
 * @param {Number} body.global - puntuación goblar sobre el psicólogo por parte del usuario
 * @param {Number} body.puntuality - puntuación respecto a la puntualidad
 * @param {Number} body.attention - puntuación sobre la atención del psicólogo
 * @param {Number} body.internet - puntuación respecto a la conexión
 * @param {String} body.like - comentario sobre lo que le gusto del psicólogo
 * @param {String} body.improve - comentario sobre lo que el psicólogo debe mejorar
 * @param {String} body.comment - comentario del usuario sobre el psicólogo
 * @return Objeto con los datos de la evaluación recién creada
 * @access authenticated (user)
 */
evaluationRouter.post(
	'/user/evaluation/:psyId',
	[passport.authenticate('jwt', { session: true })],
	evaluationController.addEvaluation
);
/**
 * @description Devuelve las evaluaciones hechas de un usuario particular
 * @method GET
 * @route /api/v1/user/get/evaluations/:userId
 * @param {String} params.userId - Id del usuario del que obtendremos las evaluaciones
 */
evaluationRouter.get(
	'/user/get/evaluations/:userId',
	evaluationController.getEvaluationsById
);

export default evaluationRouter;
