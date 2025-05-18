/**
 * Sessions Controller
 * 
 * This module handles all session-related operations in the Hablaquí API.
 * It provides endpoints for session management, scheduling, cancellation, and payment information.
 * 
 * @module controllers/sessions
 */

'use strict'

import sessionsService from '../services/sessions.js'
import { restResponse } from '../utils/responses/functions'
import { errorCallback } from '../utils/functions/errorCallback'

// Controller object containing session-related operations
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
	 * Get Formatted Sessions All
	 * Retrieves all formatted session information for a specialist
	 * 
	 * @param {Object} req - Express request object
	 * @param {string} req.params.idSpecialist - Specialist ID
	 * @param {Object} res - Express response object
	 * @returns {Array} Formatted session information
	 * @throws {Error} If sessions cannot be retrieved
	 */
	async formattedSessionsAll(req, res) {
		try {
			const { idSpecialist } = req.params;
			const { data, code } = await sessionsService.formattedSessionsAll(idSpecialist);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error retrieving formatted sessions');
		}
	},

	/**
	 * Get Sessions Limit
	 * Retrieves the session limit for a specialist
	 * 
	 * @param {Object} req - Express request object
	 * @param {string} req.params.idSpecialist - Specialist ID
	 * @param {Object} res - Express response object
	 * @returns {Object} Session limit information
	 * @throws {Error} If limit cannot be retrieved
	 */
	async sessionsLimit(req, res) {
		try {
			const { idSpecialist } = req.params;
			const { data, code } = await sessionsService.sessionsLimit(idSpecialist);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error retrieving session limit');
		}
	},

	/**
	 * Get Payments Info
	 * Retrieves payment information for a specialist
	 * 
	 * @param {Object} req - Express request object
	 * @param {string} req.params.idSpecialist - Specialist ID
	 * @param {Object} res - Express response object
	 * @returns {Object} Payment information
	 * @throws {Error} If payment info cannot be retrieved
	 */
	async paymentsInfo(req, res) {
		try {
			const { idSpecialist } = req.params;
			const { data, code } = await sessionsService.paymentsInfo(idSpecialist);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error retrieving payment information');
		}
	},

	/**
	 * Reschedule Session
	 * Reschedules a session to a new time
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} req.user - Authenticated user object
	 * @param {Object} req.body - Rescheduling information
	 * @param {Object} res - Express response object
	 * @returns {Object} Rescheduling confirmation
	 * @throws {Error} If rescheduling fails
	 */
	async reschedule(req, res) {
		try {
			const { user } = req;
			const { sessionsId, planId, id } = req.body;
			const { data, code } = await sessionsService.reschedule(
				user,
				sessionsId,
				planId,
				id
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error rescheduling session');
		}
	},

	/**
	 * Update Sessions
	 * Updates session information
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} req.body - Session update information
	 * @param {Object} res - Express response object
	 * @returns {Object} Updated session information
	 * @throws {Error} If update fails
	 */
	async updateSessions(req, res) {
		try {
			const { user } = req;
			const { sessionsId, planId, id } = req.body;
			const { data, code } = await sessionsService.updateSessions(
				user,
				sessionsId,
				planId,
				id
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error updating sessions');
		}
	},

	/**
	 * Delete Commitment
	 * Deletes a commitment for a session
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} req.body - Commitment information
	 * @param {Object} res - Express response object
	 * @returns {Object} Deletion confirmation
	 * @throws {Error} If deletion fails
	 */
	async deleteCommitment(req, res) {
		try {
			const { user } = req;
			const { sessionsId, planId, id } = req.body;
			const { data, code } = await sessionsService.deleteCommitment(
				user,
				sessionsId,
				planId,
				id
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error deleting commitment');
		}
	},

	/**
	 * Get All Sessions
	 * Retrieves all sessions
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 * @returns {Array} List of all sessions
	 * @throws {Error} If sessions cannot be retrieved
	 */
	async getAllSessions(req, res) {
		try {
			const { data, code } = await sessionsService.getAllSessions();
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error retrieving all sessions');
		}
	},

	/**
	 * Get Payments Info From ID
	 * Retrieves payment information for a session by ID
	 * 
	 * @param {Object} req - Express request object
	 * @param {string} req.params.id - Session ID
	 * @param {Object} res - Express response object
	 * @returns {Object} Payment information
	 * @throws {Error} If payment info cannot be retrieved
	 */
	async paymentsInfoFromId(req, res) {
		try {
			const { id } = req.params;
			const { data, code } = await sessionsService.paymentsInfoFromId(id);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error retrieving payment information from ID');
		}
	},

	/**
	 * Get All Sessions Formatted
	 * Retrieves all sessions in a formatted manner
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 * @returns {Array} Formatted session information
	 * @throws {Error} If sessions cannot be retrieved
	 */
	async getAllSessionsFormatted(req, res) {
		try {
			const { data, code } = await sessionsService.getAllSessionsFormatted();
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error retrieving all formatted sessions');
		}
	},

	/**
	 * Cancel Session By Specialist
	 * Cancels a session by a specialist
	 * 
	 * @param {Object} req - Express request object
	 * @param {Object} req.user - Authenticated user object
	 * @param {Object} req.body - Session information
	 * @param {Object} res - Express response object
	 * @returns {Object} Cancellation confirmation
	 * @throws {Error} If cancellation fails
	 */
	async cancelSessionByEspecialist(req, res) {
		try {
			const { user } = req;
			const { sessionsId, planId, id } = req.body;
			const { data, code } = await sessionsService.cancelSessionByEspecialist(
				user,
				sessionsId,
				planId,
				id
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error canceling session by specialist');
		}
	},
};

export default Object.freeze(sessionsController)
