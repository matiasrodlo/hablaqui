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
			return restResponse('', 200, res);
		} catch (e) {
			errorCallback(e, res, 'Error registrando un psicologo');
		}
	},
};

export default Object.freeze(psychologistsController);
