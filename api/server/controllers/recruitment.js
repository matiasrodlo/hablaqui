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
	async registerRecruitmentPsy(req, res) {
		try {
			const { body } = req;
			const {
				data,
				code,
			} = await recruitmentService.registerRecruitmentPsy(body);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error registrando el psicologo');
		}
	},
	async updateRecruitmentPsy(req, res) {
		try {
			const { body } = req;
			const {
				data,
				code,
			} = await recruitmentService.updateRecruitmentPsy(body);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error actualizando el psicologo');
		}
	},
};

export default Object.freeze(recruitmentController);
