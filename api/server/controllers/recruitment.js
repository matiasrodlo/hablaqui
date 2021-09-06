import recruitmentService from '../services/recruitment';
import { restResponse } from '../utils/responses/functions';
import { errorCallback } from '../utils/functions/errorCallback';

const recruitmentController = {
	async register(req, res) {
		try {
			const { body, user } = req;
			const { data, code } = await recruitmentService.register(
				user,
				body
			);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error registrando el psicologo');
		}
	},
};

export default Object.freeze(recruitmentController);
