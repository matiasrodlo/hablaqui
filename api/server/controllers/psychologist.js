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
	async updateAvatar(req, res) {
		try {
			const { user, file } = req;
			const { id } = req.params;
			const { data, code } = await psychologistsService.updateAvatar(
				id,
				file.cloudStoragePublicUrl
			);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error actualizando el avatar');
		}
	},
};

export default Object.freeze(psychologistsController);
