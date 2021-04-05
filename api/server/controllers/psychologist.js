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
};

export default Object.freeze(psychologistsController);
