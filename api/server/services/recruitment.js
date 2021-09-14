import Recruitment from '../models/recruitment';
import { logInfo } from '../config/winston';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import { actionInfo } from '../utils/logger/infoMessages';
import psychologist from '../models/psychologist';

const recruitmentService = {
	/**
	 * @description - This controller is used to create a new recruitment profile
	 * @param {Object} user - The user object with all the details for the profile
	 * @param {Object} body - The raw body of the request
	 * @returns Response code, message and the created recruitment profile
	 */
	async register(user, body) {
		const payload = {
			...body,
			email: user.email,
			name: user.name,
			lastName: user.lastName,
			rut: user.rut,
		};
		if (await Recruitment.exists({ rut: payload.rut })) {
			return conflictResponse('Este postulante ya está registrado');
		}

		const recruited = await Recruitment.create(payload);
		logInfo(actionInfo(recruited.email, 'se registró como postulante'));
		return okResponse('Registrado exitosamente', { recruited });
	},
	/**
	 * @description - This controller is used to update a recruitment profile
	 * @param {Object} body - The body of the request with the new values
	 * @returns The response code, message and the updated recruitment profile (if any)
	 */
	async update(body) {
		if (!(await Recruitment.exists({ rut: body.rut }))) {
			return conflictResponse('Este postulante no existe');
		}
		const recruited = await Recruitment.findOneAndUpdate(
			{ email: body.email },
			body,
			{ new: true }
		);
		logInfo(actionInfo(recruited.email, 'actualizó su perfil'));
		return okResponse('Actualizado exitosamente', { recruited });
	},
	/**
	 * @description - This controller is used to get a recruitment profile by mail
	 * @param {Object} mail - The mail of the recruitment profile
	 * @returns The response code, message and the recruitment profile obtained (if exists)
	 */
	async get(email) {
		const recruited = await Recruitment.findOne({ email });
		return okResponse('Postulante obtenido', { recruited });
	},
	/**
	 * @description - This services is used to get all recruitment
	 * @returns The response code, message and the recruitments profile obtained
	 */
	async getAll() {
		const recruitment = await Recruitment.find({ isVerified: false });
		return okResponse('Postulantes obtenidos', { recruitment });
	},
	/**
	 * @description - This controller checks if a recruitment profile exists and it hasn't been verified.
	 * @returns The response code, message and the new Psychologist profile created succesfully
	 **/
	async approve(user, email) {
		if (user.role !== 'superuser')
			return conflictResponse('No tienes los permisos suficientes');

		if (!(await Recruitment.exists({ email }))) {
			return conflictResponse(
				'Este postulante no existe y el perfil no puede ser aprobado'
			);
		}
		if (await Recruitment.exists({ email, isVerified: true })) {
			return conflictResponse(
				'Este postulante ya está aprobado y no puede ser aprobado de nuevo'
			);
		}
		const approvedProfile = await Recruitment.findOneAndUpdate(
			{ email },
			{ isVerified: true },
			{ new: true }
		);
		const payload = {
			...approvedProfile,
			avatar: approvedProfile.avatar,
			code: approvedProfile.code,
			email: approvedProfile.email,
			linkedin: approvedProfile.linkedin,
			instagram: approvedProfile.instagram,
			username: approvedProfile.username,
			name: approvedProfile.name,
			lastName: approvedProfile.lastName,
			rut: approvedProfile.rut,
			gender: approvedProfile.gender,
			sessionType: approvedProfile.sessionType,
		};
		const newProfile = await psychologist.create(payload);
		logInfo(
			actionInfo(
				approvedProfile.email,
				' fue aprobado y tiene un nuevo perfil'
			)
		);
		return okResponse('Aprobado exitosamente', { newProfile });
	},
};

export default recruitmentService;
