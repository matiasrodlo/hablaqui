'use strict'
import { Router } from 'express'
import passport from 'passport'
import evaluationController from '../controllers/evaluation'

const evaluationRouter = Router()

/**
 * Add new rating
 * req.body = { newRating: number, comment: string }
 */
/**
 * @description Añade una nueva evaluación al perfil del especialista
 * @method POST
 * @route /api/v1/specialist/add-rating/:specialist
 * @param {ObjectId} params.specialist - Id del especialista que es referenciado en la evaluación
 * @param {String} body.newRating - Puntaje de la evaluación
 * @param {String} body.comment - Comentario de la evaluación
 * @returns {Object} especialista con los datos actualizados
 * @access authenticated
 */
evaluationRouter.post(
  '/specialist/add-rating/:specialist',
  [passport.authenticate('jwt', { session: true })],
  evaluationController.addRating
)

/**
 * @description Consigue las calificaciones de un especialista en específico
 * @method GET
 * @route /api/v1/specialist/get-rating/:specialist
 * @param {ObjectId} params.specialist - Id del especialista de quien queremos las evaluaciones o ratings
 * @returns {Number} puntuación promedio del especialista
 */
evaluationRouter.get(
  '/specialist/get-rating/:specialist',
  evaluationController.getRating
)

/**
 * @description Devuelve todas las evaluaciones del especialista logeado
 * @method GET
 * @route /api/v1/specialist/get-evaluations
 * @returns {Object} Evaluaciones hechas y sus puntajes
 * @access authenticated
 */
evaluationRouter.get(
  '/specialist/get-evaluations',
  [passport.authenticate('jwt', { session: true })],
  evaluationController.getEvaluationsSpec
)

/**
 * @description Obtiene las evaluaciones de un especialista en particular
 * @method GET
 * @route /api/v1/specialist/get-all-evaluations
 * @returns {Object} Evaluaciones hechas y sus puntajes
 */
evaluationRouter.get(
  '/evaluation/get-all-evaluations',
  [passport.authenticate('jwt', { session: true })],
  evaluationController.getAllEvaluations
)

/**
 * @description Permite aprobar una evaluación hecha por un consultante
 * @method POST
 * @route /api/v1/specialist/approve-evaluation/:evsId/:evId
 * @param {ObjectId} params.evsId - Id del esquema de evaluaciones
 * @param {ObjectId} params.evId - Id de la evaluación
 * @returns {Object} Evaluación aprobada
 */
evaluationRouter.post(
  '/specialist/approve-evaluation/:evsId/:evId',
  [passport.authenticate('jwt', { session: true })],
  evaluationController.approveEvaluation
)

/**
 * @description Permite rechazar una evaluación hecha por un consultante
 * @method POST
 * @route /api/v1/specialist/refuse-evaluation/:evsId/:evId
 * @param {ObjectId} params.evsId - Id del esquema de evaluaciones
 * @param {ObjectId} params.evId - Id de la evaluación
 * @returns {Object} Evaluación rechazada
 */
evaluationRouter.post(
  '/specialist/refuse-evaluation/:evsId/:evId',
  [passport.authenticate('jwt', { session: true })],
  evaluationController.refuseEvaluation
)

/**
 * @description Sube una evaluación de un usuario sobre un especialista
 * @method POST
 * @route /api/v1/user/evaluation/:specId
 * @param {String} params.specId - Id del especialista
 * @param {Number} body.global - puntuación goblar sobre el especialista por parte del usuario
 * @param {Number} body.puntuality - puntuación respecto a la puntualidad
 * @param {Number} body.attention - puntuación sobre la atención del especialista
 * @param {Number} body.internet - puntuación respecto a la conexión
 * @param {String} body.like - comentario sobre lo que le gusto del especialista
 * @param {String} body.improve - comentario sobre lo que el especialista debe mejorar
 * @param {String} body.comment - comentario del usuario sobre el especialista
 * @return Objeto con los datos de la evaluación recién creada
 * @access authenticated (user)
 */
evaluationRouter.post(
  '/user/evaluation/:specId',
  [passport.authenticate('jwt', { session: true })],
  evaluationController.addEvaluation
)
/**
 * @description Devuelve las evaluaciones hechas de un usuario particular
 * @method GET
 * @route /api/v1/user/get/evaluations/:userId
 * @param {String} params.userId - Id del usuario del que obtendremos las evaluaciones
 */
evaluationRouter.get(
  '/user/get/evaluations/:userId',
  evaluationController.getEvaluationsById
)

export default evaluationRouter
