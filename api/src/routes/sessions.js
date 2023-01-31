'use strict';

import { Router } from 'express';
import passport from 'passport';
import sessionsController from '../controllers/sessions';

const sessionsRouter = Router();

/**
 * @swagger
 * /api/v1/psychologists/sessions/{id}:
 *  get:
 *    summary: Devuelve todas las sesiones del psicólogo
 *    tags: [Psychologists]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Id del psicólogo
 *    responses:
 *      200:
 *        description: Las sesiones segue el id
 *      400:
 *        description: Psicólogo no encontrado
 */
/**
 * @description Devuelve todas las sesiones del psicólogo
 * @method GET
 * @route /api/v1/psychologists/sessions/:idPsychologist/:idUser
 * @param {String} params.idUser - Id perteneciente al usuario/consultante o psicologo según el caso
 * @returns Objeto con la información de todas las sesiones del usuario
 * @access authenticated
 */
sessionsRouter.get(
	'/psychologists/sessions/:idUser',
	[passport.authenticate('jwt', { session: true })],
	sessionsController.getSessions
);

/**
 * @description Devuelve todas las sesiones faltantes de un psicólogo
 * @method PATCH
 * @route /api/v1/psychologist/get-remaining-sessions
 * @param {String} params.psy - id del psicólogo
 * @returns {Array} Lista con todas las sesiones faltantes del psicólogo en cuestión
 */
sessionsRouter.get(
	'/psychologist/get-remaining-sessions/:psy',
	sessionsController.getRemainingSessions
);

/**
 * @description Cancela una sesión específica
 * @method DELETE
 * @route /api/v1/psychologist/cancel-session
 * @param {ObjectId} body.sessionId - Id del esquema de sessions
 * @param {ObjectId} body.planId - Id del plan que contiene la sesión a cancelar
 * @param {ObjectId} body.id - Id de la sesión a cancelar
 * @returns Objeto con las sesiones actualizadas
 * @access authenticated
 */
sessionsRouter.delete(
	'/psychologist/cancel-session',
	[passport.authenticate('jwt', { session: true })],
	sessionsController.cancelSession
);

/**
 * @description Creo No usada
 * @method
 * @route /api/v1
 * @param {} -
 * @returns
 * @access
 */
sessionsRouter.get('/psychologist/plan-task', sessionsController.checkPlanTask);

/**
 * @description Crea un plan
 * @method POST
 * @route /api/v1/psychologists/session/create
 * @param {String} body.payload.date - Fecha de la primera sesión
 * @param {String} body.payload.title - Título del plan
 * @param {String} body.payload.paymentPeriod - Período de pago (mensual o anual)
 * @param {Number} body.payload.price - Precio de la plan
 * @param {String} payload.coupon - Cupon usado, caso contrario es ''
 * @returns Devuelve objeto con las preferencias para deribar a mercadopago
 * @access authenticated
 */
sessionsRouter.post(
	'/psychologists/session/create',
	[passport.authenticate('jwt', { session: true })],
	sessionsController.createPlan
);

/**
 * Create a session
 * req.body.payload = {
 *	user: ObjectId,
	psychologist: ObjectId,
	date: String,
	start: String,
 * }
 */
/**
 * @description Create a session en un plan específico
 * @method PUT
 * @route /api/v1/psychologists/session/:id/plan/:idPlan
 * @param {String} params.id - Id del objeto sessions
 * @param {String} params.idPlan - Id del objeto plan
 * @param {Object} body.payload - información respecto al plan
 * @returns Objeto con las sesiones actualizadas
 * @access authenticated
 */
sessionsRouter.put(
	'/psychologists/session/:id/plan/:idPlan',
	[passport.authenticate('jwt', { session: true })],
	sessionsController.createSession
);

/**
 * @description Crea una nueva sesion custom, un poco mas libre y menos estandarizada
 * @method POST
 * @route /api/v1/psychologist/new-custom-session
 * @param {string} body.date - Fecha de la sesion
 * @param {string} body.type - Tipo de la sesion ['online', 'presencial', 'commitment', etc...]
 * @param {Number} body.price - Precio que se cobrara
 * @returns {Object} última sesión creada
 * @access authenticated
 */
sessionsRouter.post(
	'/psychologist/new-custom-session',
	[passport.authenticate('jwt', { session: true })],
	sessionsController.customNewSession
);

/**
 * @description Obtiene la session de un psicologo formateada para el selector
 * @method GET
 * @route /api/v1/psychologists/formattedSessions/:idPsychologist/:type
 * @param {String} params.idPsychologist - Id del psicólogo
 * @param {String} params.type - será el tipo de calendario que debe mostrar (agendamiento o reagendamiento)
 * @returns Objeto listado de las sesiones del psicólogo
 */
sessionsRouter.get(
	'/psychologists/formattedSessions/:idPsychologist/:type',
	sessionsController.getFormattedSessions
);

/**
 * obtiene las sessiones de todos los psicologos formateada para el selector
 */
/**
 * @description Obtiene las sessiones de todos los psicologos formateada para el selector
 * @method GET
 * @route /api/v1/psychologists/formattedSessionsAll
 * @returns Objeto listado de todas las sesiones de cada uno de los psicólogos
 */
sessionsRouter.get(
	'/psychologists/formattedSessionsAll',
	sessionsController.formattedSessionsAll
);

/**
 * @description Obtiene las sessiones de todos los psicologos formateada y unicamente de los psicologos que pasemos en body.ids
 * @method POST
 * @route /api/v1/psychologists/sessionsLimit
 * @returns Objeto con las sesiones formateadas
 */
sessionsRouter.post(
	'/psychologists/sessionsLimit',
	sessionsController.sessionsLimit
);

/**
 * @description Consigue los datos (y la tabla) de pagos del psicologo.
 * @method GET
 * @route /api/v1/psychologist/payments/all
 * @returns {Object} datos de los pagos
 * @access authenticated
 */
sessionsRouter.get(
	'/psychologist/payments/all',
	[passport.authenticate('jwt', { session: true })],
	sessionsController.paymentsInfo
);

/**
 * @description Cambia la hora de una session específica
 * @method POST
 * @route /api/v1/psychologists/reschedule/:sessionsId/:id
 * @param {String} params.id - Id de la sesión especifica
 * @param {String} params.sessionsId - Id del objeto/esquema de sessions
 * @param {String} body.newDate - Nueva fecha de la sesión
 * @returns Objeto con las sesiones actualizadas
 * @access authenticated
 */
sessionsRouter.post(
	'/psychologists/reschedule/:sessionsId/:id',
	[passport.authenticate('jwt', { session: true })],
	sessionsController.reschedule
);

/**
 * @description Actualiza una sessions (Me falta información del endpoint)
 * @method PUT
 * @route /api/v1/psychologists/update/sessions
 * @param {Object} body - Contiene toda la información de una sessions
 * @access authenticated
 */
sessionsRouter.put(
	'/psychologists/update/sessions',
	[passport.authenticate('jwt', { session: true })],
	sessionsController.updateSessions
);

/**
 * @description: Elimina un compromiso privado de un psicologo
 * @method PATCH
 * @route /api/v1/psychologist/delete-private-commitment
 * @param {String} params.psyId - id del psicólogo
 * @param {String} params.planId - id del plan
 * @returns {Object} Objecto Session con el compromiso eliminado
 */
sessionsRouter.patch(
	'/psychologist/delete-commitment/:psyId/:planId',
	sessionsController.deleteCommitment
);

/**
 * @description Devuelve todas las sesiones que no hayan expirado
 * @method PATCH
 * @route /api/v1/psychologist/get-sessions
 * @param {String} params.psy - id del psicólogo
 * @returns {Array} Lista con todas las sesiones del psicólogo en cuestión
 */
sessionsRouter.get(
	'/psychologist/get-sessions/:psy',
	sessionsController.getAllSessions
);

/**
 * @description Consigue los datos (y la tabla) de pagos del psicologo
 * @method GET
 * @route /api/v1/psychologist/payments/:psy
 * @param {ObjectId} params.psy - Id del psicólogo
 * @returns {Object} datos de los pagos del psicólogo
 * @access authenticated
 */
sessionsRouter.get(
	'/psychologist/payments/:psy',
	[passport.authenticate('jwt', { session: true })],
	sessionsController.paymentsInfoFromId
);
export default sessionsRouter;
