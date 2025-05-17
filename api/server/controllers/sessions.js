/**
 * Sessions Controller
 * 
 * This module handles all session-related operations in the Hablaquí API.
 * It provides endpoints for session management, scheduling, cancellation, and payment information.
 * 
 * @module controllers/sessions
 */

import sessionsService from '../services/sessions.js'
import { restResponse } from '../utils/responses/functions'
import { errorCallback } from '../utils/functions/errorCallback'

const sessionsController = {
	/**
	 * Get User Sessions
	 * Retrieves all sessions for a specific user
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} req.user - Authenticated user object
	 * @param {string} req.params.idUser - ID of the user
	 * @param {Object} res - Express response object
	 * @returns {Array} List of user sessions
	 * @throws {Error} If sessions cannot be retrieved
	 */
	async getSessions(req, res) {
		try {
			const { idUser } = req.params;
			const { user } = req;
			const { data, code } = await sessionsService.getSessions(
				user,
				idUser
			);
			return restResponse(data, code, res);
		} catch (error) {
			errorCallback(error, res, 'Error obteniendo las sesiones');
		}
	},

	/**
	 * Get Remaining Sessions
	 * Retrieves the number of remaining sessions for a specialist
	 * 
	 * @param {Object} req - Express request object
	 * @param {string} req.params.spec - Specialist ID
	 * @param {Object} res - Express response object
	 * @returns {Object} Remaining sessions count
	 * @throws {Error} If count cannot be retrieved
	 */
	async getRemainingSessions(req, res) {
		try {
			const { spec } = req.params;
			const { data, code } = await sessionsService.getRemainingSessions(
				spec
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},

	/**
	 * Cancel Session
	 * Cancels a scheduled session
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} req.user - Authenticated user object
	 * @param {Object} req.body - Session information
	 * @param {string} req.body.sessionsId - ID of the sessions collection
	 * @param {string} req.body.planId - ID of the plan
	 * @param {string} req.body.id - ID of the session to cancel
	 * @param {Object} res - Express response object
	 * @returns {Object} Cancellation confirmation
	 * @throws {Error} If cancellation fails
	 */
	async cancelSession(req, res) {
		try {
			const { user } = req;
			const { sessionsId, planId, id } = req.body;
			const { data, code } = await sessionsService.cancelSession(
				user,
				sessionsId,
				planId,
				id
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error cancelando la sesion');
		}
	},

	/**
	 * Check Plan Task
	 * Verifies the status of a plan's scheduled tasks
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 * @returns {Object} Plan task status
	 * @throws {Error} If check fails
	 */
	async checkPlanTask(req, res) {
		try {
			const { data, code } = await sessionsService.checkPlanTask();
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error');
		}
	},

	/**
	 * Create Plan
	 * Creates a new session plan
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} req.body - Plan information
	 * @param {Object} res - Express response object
	 * @returns {Object} Created plan information
	 * @throws {Error} If plan creation fails
	 */
	async createPlan(req, res) {
		try {
			const { body } = req;
			const { data, code } = await sessionsService.createPlan(body);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error creando una plan');
		}
	},

	/**
	 * Create Session
	 * Creates a new session within a plan
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} req.user - Authenticated user object
	 * @param {Object} req.body - Session information
	 * @param {string} req.params.id - Plan ID
	 * @param {string} req.params.idPlan - Plan identifier
	 * @param {Object} res - Express response object
	 * @returns {Object} Created session information
	 * @throws {Error} If session creation fails
	 */
	async createSession(req, res) {
		try {
			const { body, user } = req;
			const { id, idPlan } = req.params;
			const { data, code } = await sessionsService.createSession(
				user,
				id,
				idPlan,
				body
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error creando una sessión');
		}
	},

	/**
	 * Create Custom Session
	 * Creates a new session with custom parameters
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} req.user - Authenticated user object
	 * @param {Object} req.body - Custom session information
	 * @param {Object} res - Express response object
	 * @returns {Object} Created session information
	 * @throws {Error} If session creation fails
	 */
	async customNewSession(req, res) {
		try {
			const { user, body } = req;
			const { data, code } = await sessionsService.customNewSession(
				user,
				body
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error creando la sesion');
		}
	},

	/**
	 * Get Formatted Sessions
	 * Retrieves formatted session information for a specialist
	 * 
	 * @param {Object} req - Express request object
	 * @param {string} req.params.idSpecialist - Specialist ID
	 * @param {string} req.params.type - Session type
	 * @param {Object} res - Express response object
	 * @returns {Array} Formatted session information
	 * @throws {Error} If sessions cannot be retrieved
	 */
	async getFormattedSessions(req, res) {
		try {
			const { idSpecialist, type } = req.params;
			const { data, code } = await sessionsService.getFormattedSessions(
				idSpecialist,
				type
			);
			return restResponse(data, code, res);
		} catch (error) {
			errorCallback(
				error,
				res,
				'Error obteniendo las sesiones formateadas'
			);
		}
	},

	/**
	 * Get All Formatted Sessions
	 * Retrieves formatted information for all sessions
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 * @returns {Array} Formatted session information
	 * @throws {Error} If sessions cannot be retrieved
	 */
	async formattedSessionsAll(req, res) {
		try {
			const { data, code } = await sessionsService.formattedSessionsAll();
			return restResponse(data, code, res);
		} catch (error) {
			errorCallback(
				error,
				res,
				'Error obteniendo las sesiones formateadas'
			);
		}
	},

	/**
	 * Get Sessions by Limit
	 * Retrieves formatted sessions for specific IDs
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} req.body - Request information
	 * @param {Array} req.body.ids - Array of session IDs
	 * @param {Object} res - Express response object
	 * @returns {Array} Formatted session information
	 * @throws {Error} If sessions cannot be retrieved
	 */
	async sessionsLimit(req, res) {
		try {
			const { body } = req;
			const { data, code } = await sessionsService.formattedSessionsAll(
				body.ids
			);
			return restResponse(data, code, res);
		} catch (error) {
			errorCallback(
				error,
				res,
				'Error obteniendo las sesiones formateadas'
			);
		}
	},

	/**
	 * Get Payment Information
	 * Retrieves payment information for a user's sessions
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} req.user - Authenticated user object
	 * @param {Object} res - Express response object
	 * @returns {Object} Payment information
	 * @throws {Error} If payment information cannot be retrieved
	 */
	async paymentsInfo(req, res) {
		try {
			const { user } = req;
			const { data, code } = await sessionsService.paymentsInfo(user);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(
				e,
				res,
				'Error procesando la informacion de los pagos'
			);
		}
	},

	/**
	 * Reschedule Session
	 * Updates the date and time of a scheduled session
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} req.user - Authenticated user object
	 * @param {string} req.params.id - Session ID
	 * @param {string} req.params.sessionsId - Sessions collection ID
	 * @param {Date} req.body.newDate - New date and time
	 * @param {Object} res - Express response object
	 * @returns {Object} Updated session information
	 * @throws {Error} If rescheduling fails
	 */
	async reschedule(req, res) {
		try {
			const { id, sessionsId } = req.params;
			const { user } = req;
			const { newDate } = req.body;
			const { data, code } = await sessionsService.reschedule(
				user,
				sessionsId,
				id,
				newDate
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error actualizando la cita');
		}
	},

	/**
	 * Update Sessions
	 * Updates multiple sessions with new information
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} req.body - Updated session information
	 * @param {Object} res - Express response object
	 * @returns {Object} Update confirmation
	 * @throws {Error} If update fails
	 */
	async updateSessions(req, res) {
		try {
			const { data, code } = await sessionsService.updateSessions(
				req.body
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},

	/**
	 * Delete Commitment
	 * Removes a commitment from a plan
	 * 
	 * @param {Object} req - Express request object
	 * @param {string} req.params.specId - Specialist ID
	 * @param {string} req.params.planId - Plan ID
	 * @param {Object} res - Express response object
	 * @returns {Object} Deletion confirmation
	 * @throws {Error} If deletion fails
	 */
	async deleteCommitment(req, res) {
		try {
			const { specId, planId } = req.params;
			const { data, code } = await sessionsService.deleteCommitment(
				planId,
				specId
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},

	/**
	 * Get All Sessions
	 * Retrieves all sessions for a specialist
	 * 
	 * @param {Object} req - Express request object
	 * @param {string} req.params.spec - Specialist ID
	 * @param {Object} res - Express response object
	 * @returns {Array} List of sessions
	 * @throws {Error} If sessions cannot be retrieved
	 */
	async getAllSessions(req, res) {
		try {
			const { spec } = req.params;
			const { data, code } = await sessionsService.getAllSessions(spec);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},

	/**
	 * Get Payment Information by ID
	 * Retrieves payment information for a specific specialist
	 * 
	 * @param {Object} req - Express request object
	 * @param {string} req.params.spec - Specialist ID
	 * @param {Object} res - Express response object
	 * @returns {Object} Payment information
	 * @throws {Error} If payment information cannot be retrieved
	 */
	async paymentsInfoFromId(req, res) {
		try {
			const { spec } = req.params;
			const { data, code } = await sessionsService.paymentsInfoFromId(
				spec
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(
				e,
				res,
				'Error procesando la informacion de los pagos'
			);
		}
	},

	/**
	 * Get All Formatted Sessions
	 * Retrieves formatted information for all sessions in the system
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 * @returns {Array} Formatted session information
	 * @throws {Error} If sessions cannot be retrieved
	 */
	async getAllSessionsFormatted(req, res) {
		try {
			const {
				data,
				code,
			} = await sessionsService.getAllSessionsFormatted();
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},

	/**
	 * Cancel Session by Specialist
	 * Allows a specialist to cancel a scheduled session
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} req.body - Session information
	 * @param {string} req.body.sessionsId - Sessions collection ID
	 * @param {string} req.body.planId - Plan ID
	 * @param {string} req.body.id - Session ID
	 * @param {Object} res - Express response object
	 * @returns {Object} Cancellation confirmation
	 * @throws {Error} If cancellation fails
	 */
	async cancelSessionByEspecialist(req, res) {
		try {
			const { sessionsId, planId, id } = req.body;
			const { data, code } = await sessionsService.cancelSessionByEspecialist(
				sessionsId,
				planId,
				id
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
};

export default Object.freeze(sessionsController)
