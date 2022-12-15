'use strict';

import { Router } from 'express';
import passport from 'passport';
import sessionsController from '../controllers/sessions';

const sessionsRouter = Router();

/**
 * @swagger
 * /api/v1/specialists/sessions/{id}:
 *  get:
 *    summary: Devuelve todas las sesiones del especialista
 *    tags: [Specialists]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Id del especialista
 *    responses:
 *      200:
 *        description: Las sesiones segue el id
 *      400:
 *        description: Especialista no encontrado
 */
/**
 * @description Devuelve todas las sesiones del especialista
 * @method GET
 * @route /api/v1/specialists/sessions/:idSpecialist/:idUser
 * @param {String} params.idUser - Id perteneciente al usuario/consultante o especialista según el caso
 * @returns Objeto con la información de todas las sesiones del usuario
 * @access authenticated
 */
sessionsRouter.get(
	'/specialists/sessions/:idUser',
	[passport.authenticate('jwt', { session: true })],
	sessionsController.getSessions
);

/**
 * @description Devuelve todas las sesiones faltantes de un especialista
 * @method PATCH
 * @route /api/v1/specialist/get-remaining-sessions
 * @param {String} params.spec - id del especialista
 * @returns {Array} Lista con todas las sesiones faltantes del especialista en cuestión
 */
sessionsRouter.get(
	'/specialist/get-remaining-sessions/:spec',
	sessionsController.getRemainingSessions
);

/**
 * @description Cancela una sesión específica
 * @method DELETE
 * @route /api/v1/specialist/cancel-session
 * @param {ObjectId} body.sessionId - Id del esquema de sessions
 * @param {ObjectId} body.planId - Id del plan que contiene la sesión a cancelar
 * @param {ObjectId} body.id - Id de la sesión a cancelar
 * @returns Objeto con las sesiones actualizadas
 * @access authenticated
 */
sessionsRouter.delete(
	'/specialist/cancel-session',
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
sessionsRouter.get('/specialist/plan-task', sessionsController.checkPlanTask);

/**
 * @description Crea un plan
 * @method POST
 * @route /api/v1/specialists/session/create
 * @param {String} body.payload.date - Fecha de la primera sesión
 * @param {String} body.payload.title - Título del plan
 * @param {String} body.payload.paymentPeriod - Período de pago (mensual o anual)
 * @param {Number} body.payload.price - Precio de la plan
 * @param {String} payload.coupon - Cupon usado, caso contrario es ''
 * @returns Devuelve objeto con las preferencias para deribar a mercadopago
 * @access authenticated
 */
sessionsRouter.post(
	'/specialists/session/create',
	[passport.authenticate('jwt', { session: true })],
	sessionsController.createPlan
);

/**
 * Create a session
 * req.body.payload = {
 *	user: ObjectId,
	specialist: ObjectId,
	date: String,
	start: String,
 * }
 */
/**
 * @description Create a session en un plan específico
 * @method PUT
 * @route /api/v1/specialists/session/:id/plan/:idPlan
 * @param {String} params.id - Id del objeto sessions
 * @param {String} params.idPlan - Id del objeto plan
 * @param {Object} body.payload - información respecto al plan
 * @returns Objeto con las sesiones actualizadas
 * @access authenticated
 */
sessionsRouter.put(
	'/specialists/session/:id/plan/:idPlan',
	[passport.authenticate('jwt', { session: true })],
	sessionsController.createSession
);

/**
 * @description Crea una nueva sesion custom, un poco mas libre y menos estandarizada
 * @method POST
 * @route /api/v1/specialist/new-custom-session
 * @param {string} body.date - Fecha de la sesion
 * @param {string} body.type - Tipo de la sesion ['online', 'presencial', 'commitment', etc...]
 * @param {Number} body.price - Precio que se cobrara
 * @returns {Object} última sesión creada
 * @access authenticated
 */
sessionsRouter.post(
	'/specialist/new-custom-session',
	[passport.authenticate('jwt', { session: true })],
	sessionsController.customNewSession
);

/**
 * @description Obtiene la session de un especialista formateada para el selector
 * @method GET
 * @route /api/v1/specialists/formattedSessions/:idSpecialist/:type
 * @param {String} params.idSpecialist - Id del especialista
 * @param {String} params.type - será el tipo de calendario que debe mostrar (agendamiento o reagendamiento)
 * @returns Objeto listado de las sesiones del especialista
 */
sessionsRouter.get(
	'/specialists/formattedSessions/:idSpecialist/:type',
	sessionsController.getFormattedSessions
);

/**
 * obtiene las sessiones de todos los especialistas formateada para el selector
 */
/**
 * @description Obtiene las sessiones de todos los especialistas formateada para el selector
 * @method GET
 * @route /api/v1/specialists/formattedSessionsAll
 * @returns Objeto listado de todas las sesiones de cada uno de los especialistas
 */
sessionsRouter.get(
	'/specialists/formattedSessionsAll',
	sessionsController.formattedSessionsAll
);

/**
 * @description Obtiene las sessiones de todos los especialistas formateada y unicamente de los especialistas que pasemos en body.ids
 * @method POST
 * @route /api/v1/specialists/sessionsLimit
 * @returns Objeto con las sesiones formateadas
 */
sessionsRouter.post(
	'/specialists/sessionsLimit',
	sessionsController.sessionsLimit
);

/**
 * @description Consigue los datos (y la tabla) de pagos del especialista.
 * @method GET
 * @route /api/v1/specialist/payments/all
 * @returns {Object} datos de los pagos
 * @access authenticated
 */
sessionsRouter.get(
	'/specialist/payments/all',
	[passport.authenticate('jwt', { session: true })],
	sessionsController.paymentsInfo
);

/**
 * @description Cambia la hora de una session específica
 * @method POST
 * @route /api/v1/specialists/reschedule/:sessionsId/:id
 * @param {String} params.id - Id de la sesión especifica
 * @param {String} params.sessionsId - Id del objeto/esquema de sessions
 * @param {String} body.newDate - Nueva fecha de la sesión
 * @returns Objeto con las sesiones actualizadas
 * @access authenticated
 */
sessionsRouter.post(
	'/specialists/reschedule/:sessionsId/:id',
	[passport.authenticate('jwt', { session: true })],
	sessionsController.reschedule
);

/**
 * @description Actualiza una sessions (Me falta información del endpoint)
 * @method PUT
 * @route /api/v1/specialists/update/sessions
 * @param {Object} body - Contiene toda la información de una sessions
 * @access authenticated
 */
sessionsRouter.put(
	'/specialists/update/sessions',
	[passport.authenticate('jwt', { session: true })],
	sessionsController.updateSessions
);

/**
 * @description: Elimina un compromiso privado de un especialista
 * @method PATCH
 * @route /api/v1/specialist/delete-private-commitment
 * @param {String} params.specId - id del especialista
 * @param {String} params.planId - id del plan
 * @returns {Object} Objecto Session con el compromiso eliminado
 */
sessionsRouter.patch(
	'/specialist/delete-commitment/:specId/:planId',
	sessionsController.deleteCommitment
);

/**
 * @description Devuelve todas las sesiones que no hayan expirado
 * @method PATCH
 * @route /api/v1/specialist/get-sessions
 * @param {String} params.spec - id del especialista
 * @returns {Array} Lista con todas las sesiones del especialista en cuestión
 */
sessionsRouter.get(
	'/specialist/get-sessions/:spec',
	sessionsController.getAllSessions
);

/**
 * @description Consigue los datos (y la tabla) de pagos del especialista
 * @method GET
 * @route /api/v1/specialist/payments/:spec
 * @param {ObjectId} params.spec - Id del especialista
 * @returns {Object} datos de los pagos del especialista
 * @access authenticated
 */
sessionsRouter.get(
	'/specialist/payments/:spec',
	[passport.authenticate('jwt', { session: true })],
	sessionsController.paymentsInfoFromId
);

/**
<<<<<<< HEAD
<<<<<<< HEAD
 * @description Consigue sessiones e información necesaria en front, como la fecha de expiración del plan, datos del psicólogo, etc.
 * @method GET
 * @route /api/v1/sessions/get-all-sessions-formatted
 * @returns {Object} datos de los que se necesitan en front
=======
 * @description Consigue los
 * @method GET
 * @route /api/v1/sessions/get-all-sessions-formatted
 * @returns {Object} datos de los pagos del psicólogo
>>>>>>> 8344e195 (feat: getAllSessionsFormatted endpoint)
=======
 * @description Consigue sessiones e información necesaria en front, como la fecha de expiración del plan, datos del psicólogo, etc.
 * @method GET
 * @route /api/v1/sessions/get-all-sessions-formatted
 * @returns {Object} datos de los que se necesitan en front
>>>>>>> 19e42891 (doc: getAllSessionsFormatted)
 */

sessionsRouter.get(
	'/sessions/get-all-sessions-formatted',
	sessionsController.getAllSessionsFormatted
);

export default sessionsRouter;
