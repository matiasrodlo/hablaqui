import sessionService from '../services/session';
import { errorCallback } from '../utils/functions/errorCallback';
import { restResponse } from '../utils/responses/functions';

const sessionController = {
	async create(req, res) {
		try {
			const { body } = req;
			const { data, code } = await sessionService.create(body, res);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error creando una cita');
		}
	},
};

export default Object.freeze(sessionController);
