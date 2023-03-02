'use strict';

import specialistsService from '../services/specialist';
import { restResponse } from '../utils/responses/functions';
import { errorCallback } from '../utils/functions/errorCallback';

const specialistsController = {
	async getAll(req, res) {
		try {
			const { data, code } = await specialistsService.getAll();
			return restResponse(data, code, res);
		} catch (error) {
			errorCallback(error, res, 'Error obteniendo los especialistas');
		}
	},
	async bestMatch(req, res) {
		try {
			const { body } = req;
			const { data, code } = await specialistsService.bestMatch(body);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error haciendo match');
		}
	},
	async economicMatch(req, res) {
		try {
			const { body } = req;
			const { data, code } = await specialistsService.economicMatch(
				body
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error haciendo match');
		}
	},
	async availityMatch(req, res) {
		try {
			const { body } = req;
			const { data, code } = await specialistsService.availityMatch(
				body
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error haciendo match');
		}
	},
	async rescheduleSession(req, res) {
		try {
			const { sessionsId, planId, sessionId, newDate } = req.body;
			const { data, code } = await specialistsService.rescheduleSession(
				sessionsId,
				planId,
				sessionId,
				newDate
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error actualizando la cita');
		}
	},
	async getByUsername(req, res) {
		try {
			const { username } = req.params;
			const { data, code } = await specialistsService.getByUsername(
				username
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error consiguiendo el especialista');
		}
	},
	async setSchedule(req, res) {
		try {
			const { user } = req;
			const { payload } = req.body;
			const { data, code } = await specialistsService.setSchedule(
				user,
				payload
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error actualizando tus horarios');
		}
	},
	async updatePaymentMethod(req, res) {
		try {
			const { user } = req;
			const { payload } = req.body;
			const { data, code } = await specialistsService.updatePaymentMethod(
				user,
				payload
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error actualizando el metodo de pago');
		}
	},

	async updateSpecialist(req, res) {
		try {
			const { user } = req;
			const { profile } = req.body;
			const { data, code } = await specialistsService.updateSpecialist(
				user,
				profile
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'error actualizando el especialista');
		}
	},

	async deleteOne(req, res) {
		try {
			const { user } = req;
			const { id } = req.params;
			const { data, code } = await specialistsService.deleteOne(user, id);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'error eliminando el especialista');
		}
	},
	async setPrice(req, res) {
		try {
			const { user } = req;
			const { newPrice } = req.body;
			const { data, code } = await specialistsService.setPrice(
				user,
				newPrice
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'error actualizando el precio');
		}
	},
	async getByData(req, res) {
		try {
			const { info } = req.params;
			const { data, code } = await specialistsService.getByData(info);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error consiguiendo el especialista');
		}
	},
	async getClients(req, res) {
		try {
			const { specialist } = req.params;
			const { data, code } = await specialistsService.getClients(
				specialist
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'error consiguiendo los clientes');
		}
	},
	async searchClients(req, res) {
		try {
			const { search } = req.params;
			const { data, code } = await specialistsService.searchClients(
				search
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
	async usernameAvailable(req, res) {
		try {
			const { username } = req.body;
			const { data, code } = await specialistsService.usernameAvailable(
				username
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
	async updateFormationExperience(req, res) {
		try {
			const { payload } = req.body;
			const { user } = req;
			const {
				data,
				code,
			} = await specialistsService.updateFormationExperience(
				user,
				payload
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error actualizando');
		}
	},

	async approveAvatar(req, res) {
		try {
			const { user } = req;
			const { id } = req.params;
			const { data, code } = await specialistsService.approveAvatar(
				user,
				id
			);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error aprobando el avatar');
		}
	},
	async uploadProfilePicture(req, res) {
		try {
			const id = req.params.id;
			const { file } = req;
			const {
				data,
				code,
			} = await specialistsService.uploadProfilePicture(id, file);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(
				e,
				res,
				'Error actualizando/subiendo imágen de perfil'
			);
		}
	},
	async changeToInmediateAttention(req, res) {
		try {
			const { user } = req;
			const {
				data,
				code,
			} = await specialistsService.changeToInmediateAttention(
				user.specialist
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
	async getSpecialistArray(req, res) {
		try {
			const { specs } = req.body;
			console.log(specs);
			const { data, code } = await specialistsService.getSpecialistArray(specs);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	}
};

export default Object.freeze(specialistsController);
