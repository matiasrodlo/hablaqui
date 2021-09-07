import Recruitment from '../models/recruitment';
import { logInfo } from '../config/winston';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import { actionInfo } from '../utils/logger/infoMessages';

const recruitmentService = {
	/**
	 * @description - This service is used to create a new recruitment in the mongoDB database
	 * @param {body} - The body of the request with all the properties of Recruitment
	 * @returns {Promise} - Returns a Promise with the created recruitment or the error
	 * @throws {Error} - Throws an error if the recruitment is not created in the database due to a validation error or server error
	 */
	async registerRecruitmentPsy(body) {
		if (await Recruitment.exists({ rut: body.rut })) {
			return conflictResponse('Este psicologo ya está registrado');
		}
		if (await Recruitment.exists({ username: body.username })) {
			return conflictResponse('Este username ya está registrado');
		}
		const recruitedPsy = await Recruitment.create(body);
		logInfo(actionInfo(recruitedPsy.email, 'se registró como psicologo'));
		return okResponse('Registrado exitosamente');
	},
	async updateRecruitmentPsy(body) {
		if (!(await Recruitment.exists({ rut: body.rut }))) {
			return conflictResponse('Este psicologo no existe');
		}
		const recruitedPsy = await Recruitment.findOneAndUpdate(
			{ emai: body.email },
			body,
			{ new: true }
		);
		logInfo(actionInfo(recruitedPsy.email, 'actualizó su perfil'));
		return okResponse('Actualizado exitosamente', recruitedPsy);
	},
};

export default recruitmentService;
