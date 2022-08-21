'use strict';

import psychologistsService from '../services/psychologist';
import { restResponse } from '../utils/responses/functions';
import { errorCallback } from '../utils/functions/errorCallback';

const psychologistsController = {
	async getAll(req, res) {
		try {
			const { data, code } = await psychologistsService.getAll();
			return restResponse(data, code, res);
		} catch (error) {
			errorCallback(error, res, 'Error obteniendo los psicologos');
		}
	},
	async getAllPagination(req, res) {
		try {
			const { page } = req.params;
			const { data, code } = await psychologistsService.getAllPagination(
				page
			);
			return restResponse(data, code, res);
		} catch (error) {
			errorCallback(error, res, 'Error obteniendo los psicologos');
		}
	},
	async match(req, res) {
		try {
			const { body } = req;
			const { data, code } = await psychologistsService.match(body);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error haciendo match');
		}
	},
	async register(req, res) {
		try {
			const { body } = req;
			const { data, code } = await psychologistsService.register(body);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error registrando un psicologo');
		}
	},
	async getByUsername(req, res) {
		try {
			const { username } = req.params;
			const { data, code } = await psychologistsService.getByUsername(
				username
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error consiguiendo el psicologo');
		}
	},
	async setSchedule(req, res) {
		try {
			const { user } = req;
			const { payload } = req.body;
			const { data, code } = await psychologistsService.setSchedule(
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
			const {
				data,
				code,
			} = await psychologistsService.updatePaymentMethod(user, payload);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error actualizando el metodo de pago');
		}
	},

	async updatePsychologist(req, res) {
		try {
			const { user } = req;
			const { profile } = req.body;
			const {
				data,
				code,
			} = await psychologistsService.updatePsychologist(user, profile);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'error actualizando el psicologo');
		}
	},

	async deleteOne(req, res) {
		try {
			const { user } = req;
			const { id } = req.params;
			const { data, code } = await psychologistsService.deleteOne(
				user,
				id
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'error eliminando el psicologo');
		}
	},
	async setPrice(req, res) {
		try {
			const { user } = req;
			const { newPrice } = req.body;
			const { data, code } = await psychologistsService.setPrice(
				user,
				newPrice
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'error actualizando el precio');
		}
	},
	async addRating(req, res) {
		try {
			const { user } = req;
			const { newRating, comment } = req.body;
			const { psychologist } = req.params;
			const { data, code } = await psychologistsService.addRating(
				user,
				Number(newRating),
				comment,
				psychologist
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'error actualizando el rating');
		}
	},

	async getRating(req, res) {
		try {
			const { psychologist } = req.params;
			const { data, code } = await psychologistsService.getRating(
				psychologist
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'error consiguiendo el rating');
		}
	},

	async getByData(req, res) {
		try {
			const { info } = req.params;
			const { data, code } = await psychologistsService.getByData(info);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error consiguiendo el psicologo');
		}
	},
	async getClients(req, res) {
		try {
			const { psychologist } = req.params;
			const { data, code } = await psychologistsService.getClients(
				psychologist
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'error consiguiendo los clientes');
		}
	},
	async searchClients(req, res) {
		try {
			const { search } = req.params;
			const { data, code } = await psychologistsService.searchClients(
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
			const { data, code } = await psychologistsService.usernameAvailable(
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
			} = await psychologistsService.updateFormationExperience(
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
			const { data, code } = await psychologistsService.approveAvatar(
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
			} = await psychologistsService.uploadProfilePicture(id, file);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(
				e,
				res,
				'Error actualizando/subiendo imágen de perfil'
			);
		}
	},
	async getEvaluations(req, res) {
		try {
			const { user } = req;
			const { data, code } = await psychologistsService.getEvaluations(
				user
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error devolviendo las evaluaciones');
		}
	},
	async getAllEvaluations(req, res) {
		try {
			const { psy } = req.params;
			const { data, code } = await psychologistsService.getAllEvaluations(
				psy
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(
				e,
				res,
				'Error devolviendo todas las evaluaciones'
			);
		}
	},
	async approveEvaluation(req, res) {
		try {
			const { evsId, evId } = req.params;
			const { data, code } = await psychologistsService.approveEvaluation(
				evsId,
				evId
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error aprobando la evaluación');
		}
	},
	async refuseEvaluation(req, res) {
		try {
			const { evsId, evId } = req.params;
			const { data, code } = await psychologistsService.refuseEvaluation(
				evsId,
				evId
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error rechazando la evaluación');
		}
	},
	async createPaymentsRequest(req, res) {
		try {
			const { user } = req;
			const {
				data,
				code,
			} = await psychologistsService.createPaymentsRequest(user);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
	async completePaymentsRequest(req, res) {
		try {
			const { psy } = req.params;
			const {
				data,
				code,
			} = await psychologistsService.completePaymentsRequest(psy);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
	async getTransactions(req, res) {
		try {
			const { user } = req;
			const { data, code } = await psychologistsService.getTransactions(
				user
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
	async changeToInmediateAttention(req, res) {
		try {
			const { user } = req;
			const {
				data,
				code,
			} = await psychologistsService.changeToInmediateAttention(
				user.psychologist
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
};

export default Object.freeze(psychologistsController);
