'use strict';

import { Router } from 'express';
import passport from 'passport';
import specialistsController from '../controllers/specialist';
import multer from '../middleware/multer';

const specialistsRouter = Router();

/**
 * @swagger
 * /api/v1/specialists/all:
 *   get:
 *     summary: Devuelve todos los especialistas de la base de datos con plan premium
 *     tags: [Specialists]
 *     responses:
 *       200:
 *         description: Todos los especialistas
 *
 */
/**
 * @description Devuelve todos los especialistas de la base de datos con plan premium
 * @method GET
 * @route /api/v1/specialists/all
 */
specialistsRouter.get('/specialists/all', specialistsController.getAll);

/**
 * @description Obtiene al especialista a través del username o su Id
 * @method GET
 * @route /api/v1/specialists/one/:info
 * @param {String} params.info - Parámetro por el cual se realiza la búsqueda del especialista
 * @returns Objeto con el especialista
 */
specialistsRouter.get(
	'/specialists/one/:info',
	specialistsController.getByData
);

/**
 * @description Realiza una búsqueda asociada a parámetros definidos por el usuario en la vista MatchMaking
 * @method POST
 * @route /api/v1/specialists/match
 * @param {String} body.payload.gender - Implica el género del especialista de preferencia
 * @param {String} body.payload.model -
 * @param {String} body.payload.themes -
 * @returns Objeto con las coincidencias sobre los especialistas
 * @access authenticated
 */
specialistsRouter.post('/specialists/match', specialistsController.match);

/**
 *
 * @description Cambia la hora de una session específica
 * @method POST
 * @route /api/v1/specialists/reschedule/
 * @param {String} body.newDate - Nueva fecha de la sesión
 * @param {String} params.sessionsId - Id del objeto/esquema de sessions
 * @param {String} params.id - Id de la sesión especifica
 * @returns Objeto con las sesiones actualizadas
 * @access authenticated
 */
specialistsRouter.post(
	'/dashboard/session/reschedule/',
	specialistsController.rescheduleSession
);

/**
 * change schedule specialist
 * req.body.payload = {
 * 	monday: [inicio, termino],
 * 	tuesday: [inicio, termino],
 * 	...
 * }
 * Para poner un dia libre es ['busy', 'busy']
 */
/**
 * @description Permite configurar el calendario de atención de los especialistas
 * @method PATCH
 * @route /api/v1/specialist/set-schedule
 * @param {Array} body.payload.monday...sunday - Arreglo que cotiene los horarios diarios para cada día de la semana
 * @returns Objeto con la información del especialista actualizada
 * @access authenticated
 */
specialistsRouter.patch(
	'/specialist/set-schedule',
	[passport.authenticate('jwt', { session: true })],
	specialistsController.setSchedule
);

/**
 * @description Actualiza el método de pago con el que se les paga a los especialistas
 * @method PACTH
 * @route /api/v1/specialist/update-payment-method
 * @param {String} body.payload.bank - Nombre del banco
 * @param {String} body.payload.accountType - Tipo de cuenta
 * @param {String} body.payload.accountNumber - Número de cuenta
 * @param {String} body.payload.rut - RUT del especialista
 * @param {String} body.payload.name - Nombre del especialista
 * @param {String} body.payload.email - Correo del especialista
 * @returns {Object} especialista con los datos actualizados
 * @access authenticated
 */
specialistsRouter.patch(
	'/specialist/update-payment-method',
	[passport.authenticate('jwt', { session: true })],
	specialistsController.updatePaymentMethod
);

/**
 * @swagger
 * /api/v1/specialists/update-profile:
 *  post:
 *    summary: Actualiza el perfil del especialista
 *    tags: [Specialists]
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
 * @description Actualiza el perfil del especialista
 * @method PUT
 * @route /api/v1/specialist/update-profile
 * @param {} -
 * @returns {Object} especialista con los datos actualizados
 * @access authenticated
 */
specialistsRouter.put(
	'/specialist/update-profile',
	[passport.authenticate('jwt', { session: true })],
	specialistsController.updateSpecialist
);

/**
 * @description Elimina un especialista de la BD
 * @method DELETE
 * @route /api/v1/specialist/:id
 * @param {ObjectId} params.id - Id del especialista a eliminar
 * @returns {Array} especialistas actualizados
 * @access authenticated
 */
specialistsRouter.delete(
	'/specialist/:id',
	[passport.authenticate('jwt', { session: true })],
	specialistsController.deleteOne
);

/**
 * @swagger
 * /api/v1/specialist/update-prices:
 *  post:
 *    summary: Actualiza los precios de las sesiones
 *    tags: [Specialists]
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
 * @route /api/v1/specialist/update-prices
 * @param {Number} body.newPrice - Nuevo precio de las sesiones del especialista
 * @returns {Object} especialista con los datos actualizados
 * @access authenticated
 */
specialistsRouter.post(
	'/specialist/update-prices',
	[passport.authenticate('jwt', { session: true })],
	specialistsController.setPrice
);

/**
 * get all clients('consultantes') the specialist
 */
/**
 * @description Devuelve todos los consultantes de un especialista
 * @method GET
 * @route /api/v1/specialist/clients/:specialist
 * @param {ObjectId} params.specialist - Id del especialista de quien queremos sus consultantes
 * @returns Objeto con todos sus consultantes
 * @access authenticated
 */
specialistsRouter.get(
	'/specialist/clients/:specialist',
	[passport.authenticate('jwt', { session: true })],
	specialistsController.getClients
);

/**
 * @description Obtiene los clientes de un especialista mediante email
 * @param {String} params.search - Email o nombre de la búsqueda
 * @returns {Array} usuario/s encontrados
 * @access authenticated
 */
specialistsRouter.get(
	'/specialist/:search',
	[passport.authenticate('jwt', { session: true })],
	specialistsController.searchClients
);
/**
 * @swagger
 * /api/v1/specialist/check-username:
 *  post:
 *    summary: Revisa disponibilidad de nombre. El especialista debe estar lodged (se modifica el user lodged)
 *    tags: [Specialists]
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
 * @description Revisa disponibilidad de nombre. El especialista debe estar lodged (se modifica el user lodged)
 * @method POST
 * @route /api/v1/specialist/check-username
 * @param {String} body.username - Nombre de usuario del especialista
 * @returns {Boolean} si nombre de usuario existe o no
 */
specialistsRouter.post(
	'/specialist/check-username',
	specialistsController.usernameAvailable
);

/**
 * @swagger
 * /api/v1/specialist/update-experience:
 *  post:
 *    summary: Actualiza formation, experiencia, modelos, especialidades e idiomas.
 *    tags: [Specialists]
 *    consumes:
 *      - application/x-www-form-urlencoded
 *    parameters:
 *      - in: formData
 *        name: payload
 *        type: object
 *        description: Contenido a actualizar
 *    responses:
 *      200:
 *        description: Especialista actualizado
 *      401:
 *        description: No hay ninguno usuario logged
 *      409:
 *        description: No eres un especialista
 */
/**
 * @description Actualiza formation, experiencia, modelos, especialidades e idiomas.
 * @method POST
 * @route /api/v1/specialist/update-experience
 * @param {Object} body.payload - Contenido a actualizar
 * @returns {Object} especialista con los datos actualizados
 * @access authenticated
 */
specialistsRouter.post(
	'/specialist/update-experience',
	[passport.authenticate('jwt', { session: true })],
	specialistsController.updateFormationExperience
);

/**
 * @description Carga/actualiza la imagen de perfil del un especialista
 * @method PUT
 * @route /api/v1/specialist/avatar/:id
 * @param {ObjectId} params.id - Id de especialista
 * @param {file} body.file - Archivo con la nueva imagen
 * @returns {Object} Imagenes de perfil
 * @access authenticated
 */
specialistsRouter.put('/specialist/avatar/:id', [
	passport.authenticate('jwt', { session: true }),
	multer.single('avatar'),
	specialistsController.uploadProfilePicture,
]);

/**
 * @description Actualiza la propiedad approveAvatar
 * @method PUT
 * @route /api/v1/specialist/:id/approve-avatar
 * @param {ObjectId} params.id - Id del usuario
 * @returns {Object} especialista con los datos actualizados
 * @access authenticated
 */
specialistsRouter.put(
	'/specialist/:id/approve-avatar',
	[passport.authenticate('jwt', { session: true })],
	specialistsController.approveAvatar
);

/**
 * @description Cambia el estado de atención inmediata
 * @method POST
 * @route /api/v1/specialist/status/inmediate-attention
 * @returns {Object} especialista actualizado
 * @access authenticated
 */
specialistsRouter.post(
	'/specialist/status/inmediate-attention',
	[passport.authenticate('jwt', { session: true })],
	specialistsController.changeToInmediateAttention
);

export default specialistsRouter;
