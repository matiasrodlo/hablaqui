/**
 * Specialist Router
 * 
 * This module defines the routes for specialist management in the Hablaquí API.
 * It handles specialist profiles, scheduling, payments, and session management.
 * 
 * @module routes/specialist
 */

'use strict'

import { Router } from 'express'
import passport from 'passport'
import specialistsController from '../controllers/specialist'
import multer from '../middleware/multer'

// Initialize Express router
const specialistsRouter = Router()

/**
 * Get All Specialists
 * Retrieves all specialists with premium plans from the database
 * 
 * @route GET /api/v1/specialists/all
 * @returns {Object[]} Array of specialist objects
 */
specialistsRouter.get('/specialists/all', specialistsController.getAll)

/**
 * Get Specialist by Username or ID
 * Retrieves a specific specialist's information
 * 
 * @route GET /api/v1/specialists/one/:info
 * @param {string} req.params.info - Username or ID of the specialist
 * @returns {Object} Specialist object
 * @throws {404} If specialist not found
 */
specialistsRouter.get('/specialists/one/:info', specialistsController.getByData)

/**
 * Match Specialists
 * Searches for specialists based on user-defined criteria
 * 
 * @route POST /api/v1/specialists/match
 * @param {Object} req.body.payload - Search criteria
 * @param {string} req.body.payload.gender - Preferred specialist gender
 * @param {string} req.body.payload.model - Preferred therapy model
 * @param {string} req.body.payload.themes - Preferred therapy themes
 * @returns {Object[]} Array of matching specialists
 * @throws {401} If not authenticated
 */
specialistsRouter.post('/specialists/match', specialistsController.match)

/**
 * Reschedule Session
 * Changes the time of a specific session
 * 
 * @route POST /api/v1/specialists/reschedule/
 * @param {string} req.body.newDate - New session date
 * @param {string} req.params.sessionsId - Session object ID
 * @param {string} req.params.id - Specific session ID
 * @returns {Object} Updated sessions object
 * @throws {401} If not authenticated
 * @throws {404} If session not found
 */
specialistsRouter.post(
  '/dashboard/session/reschedule/',
  specialistsController.rescheduleSession
)

/**
 * Set Specialist Schedule
 * Configures the specialist's weekly availability schedule
 * 
 * @route PATCH /api/v1/specialist/set-schedule
 * @param {Object} req.body.payload - Schedule configuration
 * @param {Array} req.body.payload.monday - Monday schedule [start, end]
 * @param {Array} req.body.payload.tuesday - Tuesday schedule [start, end]
 * @param {Array} req.body.payload.wednesday - Wednesday schedule [start, end]
 * @param {Array} req.body.payload.thursday - Thursday schedule [start, end]
 * @param {Array} req.body.payload.friday - Friday schedule [start, end]
 * @param {Array} req.body.payload.saturday - Saturday schedule [start, end]
 * @param {Array} req.body.payload.sunday - Sunday schedule [start, end]
 * @returns {Object} Updated specialist object
 * @throws {401} If not authenticated
 * @throws {400} If schedule format is invalid
 */
specialistsRouter.patch(
  '/specialist/set-schedule',
  [passport.authenticate('jwt', { session: true })],
  specialistsController.setSchedule
)

/**
 * Update Payment Method
 * Updates the specialist's payment information
 * 
 * @route PATCH /api/v1/specialist/update-payment-method
 * @param {Object} req.body.payload - Payment information
 * @param {string} req.body.payload.bank - Bank name
 * @param {string} req.body.payload.accountType - Account type
 * @param {string} req.body.payload.accountNumber - Account number
 * @param {string} req.body.payload.rut - Specialist's RUT
 * @param {string} req.body.payload.name - Specialist's name
 * @param {string} req.body.payload.email - Specialist's email
 * @returns {Object} Updated specialist object
 * @throws {401} If not authenticated
 * @throws {400} If payment information is invalid
 */
specialistsRouter.patch(
  '/specialist/update-payment-method',
  [passport.authenticate('jwt', { session: true })],
  specialistsController.updatePaymentMethod
)

/**
 * Update Specialist Profile
 * Updates the specialist's profile information
 * 
 * @route PUT /api/v1/specialist/update-profile
 * @param {Object} req.body - Profile information
 * @param {string} req.body.email - Email address
 * @param {string} req.body.username - Username
 * @param {string[]} req.body.languages - Languages spoken
 * @param {Object[]} req.body.experience - Work experience
 * @param {string[]} req.body.specialties - Specialties
 * @param {Object[]} req.body.formation - Education
 * @param {string} req.body.personalDescription - Personal description
 * @param {string} req.body.professionalDescription - Professional description
 * @param {string[]} req.body.models - Therapy models
 * @param {string} req.body.country - Country
 * @param {string} req.body.region - Region
 * @param {Object} req.body.preferences - Work preferences
 * @returns {Object} Updated specialist object
 * @throws {401} If not authenticated
 * @throws {400} If profile information is invalid
 */
specialistsRouter.put(
  '/specialist/update-profile',
  [passport.authenticate('jwt', { session: true })],
  specialistsController.updateSpecialist
)

/**
 * Delete Specialist
 * Removes a specialist from the database
 * 
 * @route DELETE /api/v1/specialist/:id
 * @param {string} req.params.id - Specialist ID
 * @returns {Object[]} Updated list of specialists
 * @throws {401} If not authenticated
 * @throws {404} If specialist not found
 */
specialistsRouter.delete(
  '/specialist/:id',
  [passport.authenticate('jwt', { session: true })],
  specialistsController.deleteOne
)

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
)

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
)

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
)
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
)

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
)

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
])

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
)

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
)

export default specialistsRouter
