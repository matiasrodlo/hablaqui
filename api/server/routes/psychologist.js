'use strict';

import { Router } from 'express';
import passport from 'passport';
import psychologistsController from '../controllers/psychologist';
import multer from '../middleware/multer';

const psychologistsRouter = Router();

/**
 * No se usa
 * @swagger
 * tags:
 *   name: Psychologists
 */

psychologistsRouter.get(
	'/psychologists/all/:page',
	psychologistsController.getAllPagination
);

/**
 * @swagger
 * /api/v1/psychologists/all:
 *   get:
 *     summary: Devuelve todos los psicólogos de la base de datos con plan premium
 *     tags: [Psychologists]
 *     responses:
 *       200:
 *         description: Todos los psicólogos
 *
 */
/**
 * @description Devuelve todos los psicólogos de la base de datos con plan premium
 * @method GET
 * @route /api/v1/psychologists/all
 */
psychologistsRouter.get('/psychologists/all', psychologistsController.getAll);

/**
 * @description Obtiene al psicólogo a través del username o su Id
 * @method GET
 * @route /api/v1/psychologists/one/:info
 * @param {String} params.info - Parámetro por el cual se realiza la búsqueda del psicólogo
 * @returns Objeto con el psicólogo
 */
psychologistsRouter.get(
	'/psychologists/one/:info',
	psychologistsController.getByData
);

/**
 * @description Realiza una búsqueda asociada a parámetros definidos por el usuario en la vista MatchMaking
 * @method POST
 * @route /api/v1/psychologists/match
 * @param {String} body.payload.gender - Implica el género del psicólogo de preferencia
 * @param {String} body.payload.model -
 * @param {String} body.payload.themes -
 * @returns Objeto con las coincidencias sobre los psicólogos
 * @access authenticated
 */
psychologistsRouter.post(
	'/psychologists/match',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.match
);

/**
 * No se usa
 * @description Registra un psicólogo
 * @method POST
 * @route /api/v1/psychologists/register
 * @param {} - Me falta info sobre los parametros
 */
psychologistsRouter.post(
	'/psychologists/register',
	psychologistsController.register
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
/**
 * @description Permite configurar el calendario de atención de los psicólogos
 * @method PATCH
 * @route /api/v1/psychologist/set-schedule
 * @param {Array} body.payload.monday...sunday - Arreglo que cotiene los horarios diarios para cada día de la semana
 * @returns Objeto con la información del psicólogo actualizada
 * @access authenticated
 */
psychologistsRouter.patch(
	'/psychologist/set-schedule',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.setSchedule
);

/**
 * @description Actualiza el método de pago con el que se les paga a los psicólogos
 * @method PACTH
 * @route /api/v1/psychologist/update-payment-method
 * @param {String} body.payload.bank - Nombre del banco
 * @param {String} body.payload.accountType - Tipo de cuenta
 * @param {String} body.payload.accountNumber - Número de cuenta
 * @param {String} body.payload.rut - RUT del psicólogo
 * @param {String} body.payload.name - Nombre del psicólogo
 * @param {String} body.payload.email - Correo del psicólogo
 * @returns {Object} psicólogo con los datos actualizados
 * @access authenticated
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
/**
 * @description Actualiza el perfil del psicólogo
 * @method PUT
 * @route /api/v1/psychologist/update-profile
 * @param {} -
 * @returns {Object} psicólogo con los datos actualizados
 * @access authenticated
 */
psychologistsRouter.put(
	'/psychologist/update-profile',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.updatePsychologist
);

/**
 * @description Elimina un psicólog de la BD
 * @method DELETE
 * @route /api/v1/psychologist/:id
 * @param {ObjectId} params.id - Id del psicólogo a eliminar
 * @returns {Array} psicólogos actualizados
 * @access authenticated
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
/**
 * @description Actualiza los precios de las sesiones
 * @method POST
 * @route /api/v1/psychologist/update-prices
 * @param {Number} body.newPrice - Nuevo precio de las sesiones del psicólogo
 * @returns {Object} psicólogo con los datos actualizados
 * @access authenticated
 */
psychologistsRouter.post(
	'/psychologist/update-prices',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.setPrice
);

/**
 * get all clients('consultantes') the psychologist
 */
/**
 * @description Devuelve todos los consultantes de un psicólogo
 * @method GET
 * @route /api/v1/psychologist/clients/:psychologist
 * @param {ObjectId} params.psychologist - Id del psicólogo de quien queremos sus consultantes
 * @returns Objeto con todos sus consultantes
 * @access authenticated
 */
psychologistsRouter.get(
	'/psychologist/clients/:psychologist',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.getClients
);

/**
 * @description Obtiene los clientes de un psicólogo mediante email
 * @param {String} params.search - Email o nombre de la búsqueda
 * @returns {Array} usuario/s encontrados
 * @access authenticated
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
/**
 * @description Revisa disponibilidad de nombre. El psicólogo debe estar lodged (se modifica el user lodged)
 * @method POST
 * @route /api/v1/psychologist/check-username
 * @param {String} body.username - Nombre de usuario del psicólogo
 * @returns {Boolean} si nombre de usuario existe o no
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
/**
 * @description Actualiza formation, experiencia, modelos, especialidades e idiomas.
 * @method POST
 * @route /api/v1/psychologist/update-experience
 * @param {Object} body.payload - Contenido a actualizar
 * @returns {Object} psicólogo con los datos actualizados
 * @access authenticated
 */
psychologistsRouter.post(
	'/psychologist/update-experience',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.updateFormationExperience
);

/**
 * @description Carga/actualiza la imagen de perfil del un psicólogo
 * @method PUT
 * @route /api/v1/psychologist/avatar/:id
 * @param {ObjectId} params.id - Id de psicólogo
 * @param {file} body.file - Archivo con la nueva imagen
 * @returns {Object} Imagenes de perfil
 * @access authenticated
 */
psychologistsRouter.put('/psychologist/avatar/:id', [
	passport.authenticate('jwt', { session: true }),
	multer.single('avatar'),
	psychologistsController.uploadProfilePicture,
]);

/**
 * @description Actualiza la propiedad approveAvatar
 * @method PUT
 * @route /api/v1/psychologist/:id/approve-avatar
 * @param {ObjectId} params.id - Id del usuario
 * @returns {Object} psicólogo con los datos actualizados
 * @access authenticated
 */
psychologistsRouter.put(
	'/psychologist/:id/approve-avatar',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.approveAvatar
);

/**
 * @description Crea una solicitud de retiro de dinero
 * @method PACTH
 * @route /api/v1/psychologist/payment-request
 * @returns {Object} Lista con todas las sesiones que se quieren retirar y el monto total a retirar
 * @access authenticated
 */
psychologistsRouter.post(
	'/psychologist/payment-request',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.createPaymentsRequest
);

/**
 * @description Completa las solicitudes de retiro de dinero
 * @method PATCH
 * @route /api/v1/psychologist/complete-request
 * @param {String} params.psy - id del psicólogo
 * @returns {Object} Lista con todas las sesiones con solicitudes completadas y el monto total retirado
 */
psychologistsRouter.post(
	'/psychologist/complete-payments/:psy',
	psychologistsController.completePaymentsRequest
);

/**
 * @description Devuelve todas las transacciones del psicólogo logeado
 * @method GET
 * @route /api/v1/psychologist/transactions/all
 * @returns {Object} Lista con todas las transacciones
 * @access authenticated
 */
psychologistsRouter.get(
	'/psychologist/transactions/all',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.getTransactions
);

/**
 * @description Cambia el estado de atención inmediata
 * @method POST
 * @route /api/v1/psychologist/status/inmediate-attention
 * @returns {Object} psicólogo actualizado
 * @access authenticated
 */
psychologistsRouter.post(
	'/psychologist/status/inmediate-attention',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.changeToInmediateAttention
);

export default psychologistsRouter;
