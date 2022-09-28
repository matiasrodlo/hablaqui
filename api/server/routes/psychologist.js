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
 * @param {String} params.idPsychologist - Id pertenciente al psicólogo
 * @param {String} params.idUser - Id perteneciente al usuario/consultante
 * @returns Objeto con la información de todas las sesiones del usuario
 * @access authenticated
 */
psychologistsRouter.get(
	'/psychologists/sessions/:idPsychologist/:idUser',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.getSessions
);

/**
 * @description Obtiene la session de un psicologo formateada para el selector
 * @method GET
 * @route /api/v1/psychologists/formattedSessions/:idPsychologist/:type
 * @param {String} params.idPsychologist - Id del psicólogo
 * @param {String} params.type - será el tipo de calendario que debe mostrar (agendamiento o reagendamiento)
 * @returns Objeto listado de las sesiones del psicólogo
 */
psychologistsRouter.get(
	'/psychologists/formattedSessions/:idPsychologist/:type',
	psychologistsController.getFormattedSessions
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
psychologistsRouter.get(
	'/psychologists/formattedSessionsAll',
	psychologistsController.formattedSessionsAll
);

/**
 * @description Obtiene las sessiones de todos los psicologos formateada y unicamente de los psicologos que pasemos en body.ids
 * @method POST
 * @route /api/v1/psychologists/sessionsLimit
 * @returns Objeto con las sesiones formateadas
 */
psychologistsRouter.post(
	'/psychologists/sessionsLimit',
	psychologistsController.sessionsLimit
);

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
 * @description Actualiza una sessions (Me falta información del endpoint)
 * @method PUT
 * @route /api/v1/psychologists/update/sessions
 * @param {Object} body - Contiene toda la información de una sessions
 * @access authenticated
 */
psychologistsRouter.put(
	'/psychologists/update/sessions',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.updateSessions
);

/**
 * @description Realiza una búsqueda asociada a parámetros definidos por el usuario en la vista MatchMaking
 * @method POST
 * @route /api/v1/psychologists/match
 * @param {String} body.payload.gender - Implica el género del psicólogo de preferencia
 * @param {String} body.payload.model - Implica el módelo de atención del psicólogo de preferencia
 * @param {Array} body.payload.themes - Implica los temas de interés del psicólogo de preferencia
 * @param {String} body.payload.schedule - Implica el horario de atención del psicólogo de preferencia (mañana, tarde, noche)
 * @returns Objeto con las coincidencias sobre los psicólogos
 * @access authenticated
 */
psychologistsRouter.post(
	'/psychologists/match',
	//[passport.authenticate('jwt', { session: true })],
	psychologistsController.match
);

/**
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
psychologistsRouter.post(
	'/psychologists/session/create',
	[passport.authenticate('jwt', { session: true })],
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
psychologistsRouter.put(
	'/psychologists/session/:id/plan/:idPlan',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.createSession
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
 * @description Cancela una sesión específica
 * @method DELETE
 * @route /api/v1/psychologist/cancel-session
 * @param {ObjectId} body.sessionId - Id del esquema de sessions
 * @param {ObjectId} body.planId - Id del plan que contiene la sesión a cancelar
 * @param {ObjectId} body.id - Id de la sesión a cancelar
 * @returns Objeto con las sesiones actualizadas
 * @access authenticated
 */
psychologistsRouter.delete(
	'/psychologist/cancel-session',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.cancelSession
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
psychologistsRouter.post(
	'/psychologist/add-rating/:psychologist',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.addRating
);

/**
 * @description Consigue las calificaciones de un psicólogo en específico
 * @method GET
 * @route /api/v1/psychologist/get-rating/:psychologist
 * @param {ObjectId} params.psychologist - Id del psicólogo de quien queremos las evaluaciones o ratings
 * @returns {Number} puntuación promedio del psicólogo
 */
psychologistsRouter.get(
	'/psychologist/get-rating/:psychologist',
	psychologistsController.getRating
);

/**
 * @description Creo No usada
 * @method
 * @route /api/v1
 * @param {} -
 * @returns
 * @access
 */
psychologistsRouter.get(
	'/psychologist/plan-task',
	psychologistsController.checkPlanTask
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
 * @description Crea una nueva sesion custom, un poco mas libre y menos estandarizada
 * @method POST
 * @route /api/v1/psychologist/new-custom-session
 * @param {string} body.date - Fecha de la sesion
 * @param {string} body.type - Tipo de la sesion ['online', 'presencial', 'commitment', etc...]
 * @param {Number} body.price - Precio que se cobrara
 * @returns {Object} última sesión creada
 * @access authenticated
 */
psychologistsRouter.post(
	'/psychologist/new-custom-session',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.customNewSession
);

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
 * @description Consigue los datos (y la tabla) de pagos del psicologo.
 * @method GET
 * @route /api/v1/psychologist/payments/all
 * @returns {Object} datos de los pagos
 * @access authenticated
 */
psychologistsRouter.get(
	'/psychologist/payments/all',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.paymentsInfo
);

/**
 * @description Consigue los datos (y la tabla) de pagos del psicologo
 * @method GET
 * @route /api/v1/psychologist/payments/:psy
 * @param {ObjectId} params.psy - Id del psicólogo
 * @returns {Object} datos de los pagos del psicólogo
 * @access authenticated
 */
psychologistsRouter.get(
	'/psychologist/payments/:psy',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.paymentsInfoFromId
);

/**
 * @description: Elimina un compromiso privado de un psicologo
 * @method PATCH
 * @route /api/v1/psychologist/delete-private-commitment
 * @param {String} params.psyId - id del psicólogo
 * @param {String} params.planId - id del plan
 * @returns {Object} Objecto Session con el compromiso eliminado
 */
psychologistsRouter.patch(
	'/psychologist/delete-commitment/:psyId/:planId',
	psychologistsController.deleteCommitment
);

/**
 * @description Devuelve todas las sesiones que no hayan expirado
 * @method PATCH
 * @route /api/v1/psychologist/get-sessions
 * @param {String} params.psy - id del psicólogo
 * @returns {Array} Lista con todas las sesiones del psicólogo en cuestión
 */
psychologistsRouter.get(
	'/psychologist/get-sessions/:psy',
	psychologistsController.getAllSessions
);

/**
 * @description Devuelve todas las sesiones faltantes de un psicólogo
 * @method PATCH
 * @route /api/v1/psychologist/get-remaining-sessions
 * @param {String} params.psy - id del psicólogo
 * @returns {Array} Lista con todas las sesiones faltantes del psicólogo en cuestión
 */
psychologistsRouter.get(
	'/psychologist/get-remaining-sessions/:psy',
	psychologistsController.getRemainingSessions
);

/**
 * @description Devuelve todas las evaluaciones del psic´logo logeado
 * @method GET
 * @route /api/v1/psychologist/get-evaluations
 * @returns {Object} Evaluaciones hechas y sus puntajes
 * @access authenticated
 */
psychologistsRouter.get(
	'/psychologist/get-evaluations',
	[passport.authenticate('jwt', { session: true })],
	psychologistsController.getEvaluations
);

/**
 * @description Obtiene las evaluaciones de un psicólogo en particular
 * @method GET
 * @route /api/v1/psychologist/get-all-evaluations/:psy
 * @param {ObjectId} params.psy - Id del psicólogo
 * @returns {Object} Evaluaciones hechas y sus puntajes
 */
psychologistsRouter.get(
	'/psychologist/get-all-evaluations/:psy',
	psychologistsController.getAllEvaluations
);

/**
 * @description Permite aprobar una evaluación hecha por un consultante
 * @method POST
 * @route /api/v1/psychologist/approve-evaluation/:evsId/:evId
 * @param {ObjectId} params.evsId - Id del esquema de evaluaciones
 * @param {ObjectId} params.evId - Id de la evaluación
 * @returns {Object} Evaluación aprobada
 */
psychologistsRouter.post(
	'/psychologist/approve-evaluation/:evsId/:evId',
	psychologistsController.approveEvaluation
);

/**
 * @description Permite rechazar una evaluación hecha por un consultante
 * @method POST
 * @route /api/v1/psychologist/refuse-evaluation/:evsId/:evId
 * @param {ObjectId} params.evsId - Id del esquema de evaluaciones
 * @param {ObjectId} params.evId - Id de la evaluación
 * @returns {Object} Evaluación rechazada
 */
psychologistsRouter.post(
	'/psychologist/refuse-evaluation/:evsId/:evId',
	psychologistsController.refuseEvaluation
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
