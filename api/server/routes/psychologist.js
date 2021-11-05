'use strict';

import { Router } from 'express';
import passport from 'passport';
import psychologistsController from '../controllers/psychologist';
import multer from '../middleware/multer';

const psychologistsRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Psychologists
 */

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
psychologistsRouter.get('/psychologists/all', psychologistsController.getAll);

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
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.getSessions
);

psychologistsRouter.get(
	'/psychologists/formattedSessions/:idPsychologist',
	psychologistsController.getFormattedSessions
);

/**
 * get psychologist bt username or _id
 */
psychologistsRouter.get(
	'/psychologists/one/:info',
	psychologistsController.getByData
);

psychologistsRouter.post(
	'/psychologists/match',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.match
);

/** Register psychologist */
psychologistsRouter.post(
	'/psychologists/register',
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
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.createSessions
);

/**
 * Cambia la hora de la session con el :id
 * req.body = { newDate: string (ojala en formato ISO) }
 */
psychologistsRouter.post(
	'/psychologists/reschedule/:sessionsId/:id',
	[passport.authenticate('jwt', { session: true })],
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
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.setSchedule
);

/**
 * Cancel session
 * req.body = { sessionId: ObjectId }
 */
psychologistsRouter.delete(
	'/psychologist/cancel-session',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.cancelSession
);

/**
 * update payment method
 */
psychologistsRouter.patch(
	'/psychologist/update-payment-method',
	[passport.authenticate('jwt', { session: true })],
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
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.updatePsychologist
);

/**
 * Elimina un psicólogo - only superuser
 * req.body = { id: ObjectId }
 */
psychologistsRouter.delete(
	'/psychologist/:id',
	[passport.authenticate('jwt', { session: true })],
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
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.setPrice
);

/**
 * Add new rating
 * req.body = { newRating: number, comment: string }
 */
psychologistsRouter.post(
	'/psychologist/add-rating/:psychologist',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.addRating
);

/**
 * Consigue las calificaciones del :psychologist
 */
psychologistsRouter.get(
	'/psychologist/get-rating/:psychologist',
	psychologistsController.getRating
);
psychologistsRouter.get(
	'/psychologist/plan-task',
	psychologistsController.checkPlanTask
);
/**
 * get all clients('consultantes') the psychologist
 */
psychologistsRouter.get(
	'/psychologist/clients/:psychologist',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.getClients
);

/**
 * @description: Obtiene los clientes de un psicólogo mediante email
 * @param {string} email email de la búsqueda
 * @returns {array} usuario/s encontrados
 */
psychologistsRouter.get(
	'/psychologist/:search',
	[passport.authenticate('jwt', { session: true })],
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
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.updateFormationExperience
);

/**
 * @description: Route to upload/update psychologist's profile picture
 * @route {PATCH} /api/v1/psychologist/profile-picture
 * @access {Private}
 * @body {file} file
 */
psychologistsRouter.put('/psychologist/avatar/:id', [
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
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.customNewSession
);

/**
 * Actualiza la propiedad approveAvatar
 */
psychologistsRouter.put(
	'/psychologist/:id/approve-avatar',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.approveAvatar
);

/**
 * @description: Consigue los datos (y la tabla) de pagos del psicologo.
 */
psychologistsRouter.get(
	'/psychologist/payments',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.paymentsInfo
);

export default psychologistsRouter;
