import recruitmentService from '../services/recruitment';
import { restResponse } from '../utils/responses/functions';
import { errorCallback } from '../utils/functions/errorCallback';
/**
 * @description - This function is used to register the recruitment details and profile
 * @param {object} req - The request object (Recruitment details)
 * @param {object} res - The response object (Response code and message)
 * @returns {object} - The response object
 */
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
	async update(req, res) {
		try {
			const { body } = req;
			const { data, code } = await recruitmentService.update(body);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error actualizando el psicologo');
		}
	},
	async get(req, res) {
		try {
			const { email } = req.params;
			const { data, code } = await recruitmentService.get(email);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error obteniendo el psicologo');
		}
	},
};

export default Object.freeze(recruitmentController);
