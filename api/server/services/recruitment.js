import Recruitment from '../models/recruitment';
import { logInfo } from '../config/winston';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import { actionInfo } from '../utils/logger/infoMessages';

const recruitmentService = {
	async register(user, body) {
		const payload = {
			...body,
			email: user.email,
			name: user.name,
			lastName: user.lastName,
			rut: user.rut,
		};
		if (await Recruitment.exists({ rut: payload.rut })) {
			return conflictResponse('Este psicologo ya está registrado');
		}
		if (await Recruitment.exists({ username: payload.username })) {
			return conflictResponse('Este username ya está registrado');
		}
		const recruited = await Recruitment.create(payload);
		logInfo(actionInfo(recruited.email, 'se registró como psicologo'));
		return okResponse('Registrado exitosamente', { recruited });
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
