import { Router } from 'express';
import passport from 'passport';
import multer from '../middleware/multer';
import storage from '../middleware/storage';
import psychologistsController from '../controllers/psychologist';

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
 *     summary: Devuelve todos los psicologos de la base de datos
 *     tags: [Psychologists]
 *     responses:
 *       200:
 *         description: Todos los psicologos
 *
 */
psychologistsRouter.get('/psychologists/all', psychologistsController.getAll);

/**
 * @swagger
 * /api/v1/psychologists/sesssions/{id}:
 *  get:
 *    summary: Devuelve todas las sesiones del psicologo
 *    tags: [Psychologists]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        descritpion: Id del psicologo
 *    repsonses:
 *      200:
 *        despcription: Las sesiones segun el id
 *      400:
 *        description: Psicologo no encontrado
 */
psychologistsRouter.get(
	'/psychologists/sessions/:idPsychologist',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.getSessions
);

psychologistsRouter.get(
	'/psychologists/formattedSessions/:idPsychologist',
	psychologistsController.getFormattedSessions
);

psychologistsRouter.get(
	'/psychologists/one/:info',
	psychologistsController.getByData
);
psychologistsRouter.post(
	'/psychologists/match',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.match
);
psychologistsRouter.post(
	'/psychologists/register',
	[multer.single('avatar'), storage],
	psychologistsController.register
);
psychologistsRouter.post(
	'/psychologists/session/create',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.createSession
);
psychologistsRouter.post(
	'/psychologists/reschedule/:id',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.reschedule
);
psychologistsRouter.patch(
	'/psychologist/set-schedule',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.setSchedule
);
psychologistsRouter.delete(
	'/psychologist/cancel-session',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.cancelSession
);
psychologistsRouter.patch(
	'/psychologist/update-payment-method',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.updatePaymentMethod
);

psychologistsRouter.patch(
	'/psychologist/update-profile',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.updatePsychologist
);

psychologistsRouter.delete(
	'/psychologist/delete-one',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.deleteOne
);

psychologistsRouter.post(
	'/psychologist/update-prices',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.setPrice
);

psychologistsRouter.post(
	'/psychologist/add-rating/:psychologist',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.addRating
);
psychologistsRouter.get(
	'/psychologist/get-rating/:psychologist',
	psychologistsController.getRating
);
psychologistsRouter.get(
	'/psychologist/plan-task',
	psychologistsController.checkPlanTask
);
psychologistsRouter.get(
	'/psychologist/clients/:psychologist',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.getClients
);

/**
 * @swagger
 * /api/v1/psychologist/check-username:
 *  post:
 *    summary: Revisa disponibilidad de nombre
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

export default psychologistsRouter;
