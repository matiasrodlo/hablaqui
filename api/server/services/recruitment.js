'use strict';

import Recruitment from '../models/recruitment';
import User from '../models/user';
import { logInfo } from '../config/winston';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import { actionInfo } from '../utils/logger/infoMessages';
import psychologist from '../models/psychologist';
import mailService from './mail';

var Analytics = require('analytics-node');
var analytics = new Analytics(process.env.SEGMENT_API_KEY);

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
		if (
			process.env.API_URL.includes('hablaqui.cl') ||
			process.env.DEBUG_ANALYTICS === 'true'
		) {
			analytics.track({
				userId: user._id.toString(),
				event: 'psy-new-application',
				properties: {
					email: user.email,
					name: user.name,
					lastName: user.lastName,
					source: recruited.howFindOut,
					isExclusiveActivity: recruited.isExclusiveActivity,
					isUnderSupervision: recruited.isUnderSupervision,
					isSupervisor: recruited.isSupervisor,
					isContentCreator: recruited.isContentCreator,
					isAffiliateExternal: recruited.isAffiliateExternal,
					isInterestedBusiness: recruited.isInterestedBusiness,
					professionalDescription: recruited.professionalDescription,
					personalDescription: recruited.personalDescription,
				},
			});
			analytics.identify({
				userId: user._id.toString(),
				traits: {
					email: user.email,
					name: user.name,
					lastName: user.lastName,
					source: recruited.howFindOut,
					isExclusiveActivity: recruited.isExclusiveActivity,
					isUnderSupervision: recruited.isUnderSupervision,
					isSupervisor: recruited.isSupervisor,
					isContentCreator: recruited.isContentCreator,
					isAffiliateExternal: recruited.isAffiliateExternal,
					isInterestedBusiness: recruited.isInterestedBusiness,
					professionalDescription: recruited.professionalDescription,
					personalDescription: recruited.personalDescription,
				},
			});
		}
		// Send email to the psychologist confirming the application. Also internal confirmation is sent.
		mailService.sendRecruitmentConfirmation(recruited);
		mailService.sendRecruitmentConfirmationAdmin(recruited);
		logInfo(actionInfo(recruited.email, 'se registró como postulante'));
		return okResponse('Registrado exitosamente', { recruited });
	},
	/**
	 * @description - This service is used to update a recruitment profile
	 * @param {Object} body - The body of the request with the new values
	 * @returns The response code, message and the updated recruitment profile (if any)
	 */
	async update(body) {
		if (!(await Recruitment.exists({ email: body.email }))) {
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
	 * @description - This service is used to get a recruitment profile by mail
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
		let payload = await Recruitment.findOneAndUpdate(
			{ email },
			{ isVerified: true },
			{ new: true }
		);
		let id = payload._id;

		// Formateamos el payload para que nos deje editar
		payload = JSON.stringify(payload);
		payload = JSON.parse(payload);

		delete payload._id;
		delete payload.__v;

		const newProfile = await psychologist.create(payload);
		mailService.sendWelcomeNewPsychologist(payload);

		const userUpdated = await User.findOneAndUpdate(
			{ email: payload.email },
			{ $set: { psychologist: newProfile._id } },
			{ new: true }
		);
		if (
			process.env.API_URL.includes('hablaqui.cl') ||
			process.env.DEBUG_ANALYTICS === 'true'
		) {
			analytics.track({
				userId: userUpdated._id.toString(),
				event: 'new-psy-onboard',
			});
			analytics.identify({
				userId: userUpdated._id.toString(),
				traits: {
					role: userUpdated.role,
					psychologist: newProfile._id,
					email: payload.email,
					name: payload.name,
					lastName: payload.lastName,
					rut: payload.rut,
					psyId: newProfile._id,
				},
			});
		}

		logInfo(
			actionInfo(payload.email, 'fue aprobado y tiene un nuevo perfil')
		);
		return okResponse('Aprobado exitosamente', { newProfile });
	},
	async updatePlan(recruitedId, newPlan) {
		const recruitedToUpdate = await Recruitment.findOneAndUpdate(
			{ _id: recruitedId },
			{
				$push: {
					psyPlans: { paymentStatus: 'success', ...newPlan },
				},
			},
			{ new: true }
		);
		return okResponse('Plan actualizado/creado', { recruitedToUpdate });
	},
};

export default recruitmentService;
