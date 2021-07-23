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
			const avatar = req.file.cloudStoragePublicUrl;
			const { data, code } = await psychologistsService.register(
				body,
				avatar
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error registrando un psicologo');
		}
	},
	async createSession(req, res) {
		try {
			const { body } = req;
			const { data, code } = await psychologistsService.createSession(
				body,
				res
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error creando una cita');
		}
	},
	async reschedule(req, res) {
		try {
			const { id } = req.params;
			const { user } = req;
			const { newDate } = req.body;
			const { data, code } = await psychologistsService.reschedule(
				user,
				id,
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
	async cancelSession(req, res) {
		try {
			const { user } = req;
			const { sessionId } = req.body;
			const { data, code } = await psychologistsService.cancelSession(
				user,
				sessionId
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error cancelando la sesion');
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
};

export default Object.freeze(psychologistsController);
