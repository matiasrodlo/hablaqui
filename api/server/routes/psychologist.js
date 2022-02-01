'use strict';

import { Router } from 'express';
import passport from 'passport';
import psychologistsController from '../controllers/psychologist';
import multer from '../middleware/multer';
import permission from '../middleware/permission';

const psychologistsRouter = Router();
const { corsApi } = permission;
/**
 * @swagger
 * tags:
 *   name: Psychologists
 */

psychologistsRouter.get(
	'/psychologists/all/:page',
	[corsApi],
	psychologistsController.getAllPagination
);

/**
 * @swagger
 * /api/v1/psychologists/all:
 *   get:
 *     summary: Devuelve todos los psicólogos de la base de datos
 *     tags: [Psychologists]
 *     responses:
 *       200:
 *         description: Todos los psicólogos
 *
 */
psychologistsRouter.get(
	'/psychologists/all',
	[corsApi],
	psychologistsController.getAll
);

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
psychologistsRouter.get(
	'/psychologists/sessions/:idPsychologist/:idUser',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.getSessions
);

/**
 * obtiene la session de un psicologo formateada para el selector
 */
psychologistsRouter.get(
	'/psychologists/formattedSessions/:idPsychologist',
	[corsApi],
	psychologistsController.getFormattedSessions
);

/**
 * obtiene las sessiones de todos los psicologos formateada para el selector
 */
psychologistsRouter.get(
	'/psychologists/formattedSessionsAll',
	[corsApi],
	psychologistsController.formattedSessionsAll
);

/**
 * get psychologist bt username or _id
 */
psychologistsRouter.get(
	'/psychologists/one/:info',
	[corsApi],
	psychologistsController.getByData
);

psychologistsRouter.put(
	'/psychologists/update/sessions',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.updateSessions
);

psychologistsRouter.post(
	'/psychologists/match',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.match
);

/** Register psychologist */
psychologistsRouter.post(
	'/psychologists/register',
	[corsApi],
	psychologistsController.register
);

/**
 * Crea una session
 * NEED AUTHENTICATION
 * req.body.payload = {
 * 	date: string,
	user._id: ObjectId del usuario,
	title: string,
	paymentPeriod: string,
	price: Number,
 * }
 */
psychologistsRouter.post(
	'/psychologists/session/create',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.createPlan
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
psychologistsRouter.put(
	'/psychologists/session/:id/plan/:idPlan',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.createSession
);
/**
 * Cambia la hora de la session con el :id
 * req.body = { newDate: string (ojala en formato ISO) }
 */
psychologistsRouter.post(
	'/psychologists/reschedule/:sessionsId/:id',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.reschedule
);

/**
 * change schedule psychologist
 * req.body.payload = {
 * 	monday: [inicio, termino],
 * 	tuesday: [inicio, termino],
 * 	...
 * }
 * Para poner un dia libre es ['busy', 'busy']
 */
psychologistsRouter.patch(
	'/psychologist/set-schedule',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.setSchedule
);

/**
 * Cancel session
 * req.body = { sessionId: ObjectId }
 */
psychologistsRouter.delete(
	'/psychologist/cancel-session',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.cancelSession
);

/**
 * update payment method
 */
psychologistsRouter.patch(
	'/psychologist/update-payment-method',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.updatePaymentMethod
);

/**
 * @swagger
 * /api/v1/psychologists/update-profile:
 *  post:
 *    summary: Actualiza el perfil del psicólogo
 *    tags: [Psychologists]
 *    consumes:
 *      - application/x-www-form-urlencoded
 *    parameters:
 *      - in: formData
 *        name: profile
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          username:
 *            type: string
 *          languages:
 *            type: array
 *          experience:
 *            type: array
 *          specialties:
 *            type: array
 *          formation:
 *            type: array
 *          personalDescription:
 *            type: string
 *          professionalDescription:
 *            type: string
 *          models:
 *            type: array
 *          country:
 *            type: string
 *          region:
 *            type: string
 *          preferences:
 *            type: object
 *            properties:
 *              marketplaceVisibility:
 *                type: boolean
 *              minimumNewSession:
 *                type: integer
 *              minimumRescheduleSession:
 *                type: integer
 *              corporativeSessions:
 *                type: boolean
 *        description: Objeto con la information a actualizar (funciona igual que el user)
 *    responses:
 *      200: Actualizado correctamente
 */
psychologistsRouter.put(
	'/psychologist/update-profile',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.updatePsychologist
);

/**
 * Elimina un psicólogo - only superuser
 * req.body = { id: ObjectId }
 */
psychologistsRouter.delete(
	'/psychologist/:id',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.deleteOne
);

/**
 * @swagger
 * /api/v1/psychologist/update-prices:
 *  post:
 *    summary: Actualiza los precios de las sesiones
 *    tags: [Psychologists]
 *    consumes:
 *      - application/x-www-form-urlencoded
 *    parameters:
 *      - in: formData
 *        name: newPrice
 *        type: integer
 *        required: true
 *        description: El nuevo precio
 *    responses:
 *      200:
 *        description: Actualizado correctamente
 */
psychologistsRouter.post(
	'/psychologist/update-prices',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.setPrice
);

/**
 * Add new rating
 * req.body = { newRating: number, comment: string }
 */
psychologistsRouter.post(
	'/psychologist/add-rating/:psychologist',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.addRating
);

/**
 * Consigue las calificaciones del :psychologist
 */
psychologistsRouter.get(
	'/psychologist/get-rating/:psychologist',
	[corsApi],
	psychologistsController.getRating
);
psychologistsRouter.get(
	'/psychologist/plan-task',
	[corsApi],
	psychologistsController.checkPlanTask
);
/**
 * get all clients('consultantes') the psychologist
 */
psychologistsRouter.get(
	'/psychologist/clients/:psychologist',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.getClients
);

/**
 * @description: Obtiene los clientes de un psicólogo mediante email
 * @param {string} email email de la búsqueda
 * @returns {array} usuario/s encontrados
 */
psychologistsRouter.get(
	'/psychologist/:search',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.searchClients
);
/**
 * @swagger
 * /api/v1/psychologist/check-username:
 *  post:
 *    summary: Revisa disponibilidad de nombre. El psicólogo debe estar lodged (se modifica el user lodged)
 *    tags: [Psychologists]
 *    consumes:
 *      - application/x-www-form-urlencoded
 *    parameters:
 *      - in: formData
 *        name: username
 *        type: string
 *        description: username a verificar
 *    responses:
 *      200:
 *        description: Usuario disponible
 *      409:
 *        description: Usuario no disponible
 */
psychologistsRouter.post(
	'/psychologist/check-username',
	[corsApi],
	psychologistsController.usernameAvailable
);

/**
 * @swagger
 * /api/v1/psychologist/update-experience:
 *  post:
 *    summary: Actualiza formation, experiencia, modelos, especialidades e idiomas.
 *    tags: [Psychologists]
 *    consumes:
 *      - application/x-www-form-urlencoded
 *    parameters:
 *      - in: formData
 *        name: payload
 *        type: object
 *        description: Contenido a actualizar
 *    responses:
 *      200:
 *        description: Psicólogo actualizado
 *      401:
 *        description: No hay ninguno usuario logged
 *      409:
 *        description: No eres un psicólogo
 */
psychologistsRouter.post(
	'/psychologist/update-experience',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.updateFormationExperience
);

/**
 * @description: Route to upload/update psychologist's profile picture
 * @route {PATCH} /api/v1/psychologist/profile-picture
 * @access {Private}
 * @body {file} file
 */
psychologistsRouter.put('/psychologist/avatar/:id', [
	corsApi,
	passport.authenticate('jwt', { session: true }),
	multer.single('avatar'),
	psychologistsController.uploadProfilePicture,
]);

/**
 * Crea una nueva sesion custom, un poco mas libre y menos estandarizada.
 * req.body.payload = {
 * 		type: string,
 * 		date: ISO,
 * 		user: ObjectId,
 * 		price: integer,
 * }
 */
psychologistsRouter.post(
	'/psychologist/new-custom-session',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.customNewSession
);

/**
 * Actualiza la propiedad approveAvatar
 */
psychologistsRouter.put(
	'/psychologist/:id/approve-avatar',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.approveAvatar
);

/**
 * @description: Consigue los datos (y la tabla) de pagos del psicologo.
 */
psychologistsRouter.get(
	'/psychologist/payments/all',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.paymentsInfo
);

/**
 * @description: Elimina un compromiso privado de un psicologo
 * @route {PATCH} /api/v1/psychologist/delete-private-commitment
 * @param {String} psyId id del compromiso y planId es el id del plan
 * @returns {Object} Objecto Session con el compromiso eliminado
 */
psychologistsRouter.patch(
	'/psychologist/delete-commitment/:psyId/:planId',
	[corsApi],
	psychologistsController.deleteCommitment
);

/**
 * @description Devuelve todas las sesiones que no hayan expirado
 * @route {PATCH} /api/v1/psychologist/get-sessions
 * @param {String} psy id del psicólogo
 * @returns {Array} Lista con todas las sesiones del psicólogo en cuestión
 */
psychologistsRouter.get(
	'/psychologist/get-sessions/:psy',
	[corsApi],
	psychologistsController.getAllSessions
);

/**
 * @description Devuelve todas las sesiones faltantes de un psicólogo
 * @route {PATCH} /api/v1/psychologist/get-remaining-sessions
 * @param {String} psy id del psicólogo
 * @returns {Array} Lista con todas las sesiones faltantes del psicólogo en cuestión
 */
psychologistsRouter.get(
	'/psychologist/get-remaining-sessions/:psy',
	[corsApi],
	psychologistsController.getRemainingSessions
);

psychologistsRouter.get(
	'/psychologist/get-evaluations',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.getEvaluations
);

psychologistsRouter.get(
	'/psychologist/get-all-evaluations/:psy',
	[corsApi],
	psychologistsController.getAllEvaluations
);

psychologistsRouter.post(
	'/psychologist/approve-evaluation/:evsId/:evId',
	[corsApi],
	psychologistsController.approveEvaluation
);
psychologistsRouter.post(
	'/psychologist/refuse-evaluation/:evsId/:evId',
	[corsApi],
	psychologistsController.refuseEvaluation
);

/**
 * @description Crea una solicitud de retiro de dinero
 * @route {PATCH} /api/v1/psychologist/payment-request
 * @returns {Object} Lista con todas las sesiones que se quieren retirar y el monto total a retirar
 */
psychologistsRouter.post(
	'/psychologist/payment-request',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.createPaymentsRequest
);

/**
 * @description Completa las solicitudes de retiro de dinero
 * @route {PATCH} /api/v1/psychologist/complete-request
 * @param {String} psy id del psicólogo
 * @returns {Object} Lista con todas las sesiones con solicitudes completadas y el monto total retirado
 */
psychologistsRouter.post(
	'/psychologist/complete-payments/:psy',
	[corsApi],
	psychologistsController.completePaymentsRequest
);

psychologistsRouter.get(
	'/psychologist/transactions/all',
	[corsApi, passport.authenticate('jwt', { session: true })],
	psychologistsController.getTransactions
);

export default psychologistsRouter;
