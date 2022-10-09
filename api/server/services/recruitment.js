'use strict';

import Recruitment from '../models/recruitment'; // Contiene la definición del modelo de recruitment para mongodb
import User from '../models/user'; // Contiene la definición del modelo de user para mongodb
import { logInfo } from '../config/winston'; // Se importa el log de info para poder imprimir en la consola
import { conflictResponse, okResponse } from '../utils/responses/functions'; // funciones para generar respuestas http
import { actionInfo } from '../utils/logger/infoMessages'; // recibe información sobre la acción que el usuario realiza
import psychologist from '../models/psychologist'; // Contiene la definición del modelo de psychologist para mongodb
import mailServiceAccount from '../utils/functions/mails/accountsShares'; // Utiliza el servicio de mail
import mailServicePsy from '../utils/functions/mails/psychologistStatus';

var Analytics = require('analytics-node'); // Analytics-node sirve para integrar analiticas en cualquier aplicación.
var analytics = new Analytics(process.env.SEGMENT_API_KEY); // SEGMENT_API_KEY es una variable de entorno que contiene la clave de segment

const recruitmentService = {
	/**
	 * @description - This controller is used to create a new recruitment profile
	 * @param {Object} user - The user object with all the details for the profile
	 * @param {Object} body - The raw body of the request
	 * @returns Response code, message and the created recruitment profile
	 */
	async register(user, body) {
		// Se crea un objeto que contiene los datos del perfil de recruitment
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
		// Se crea un nuevo perfil de recruitment
		const recruited = await Recruitment.create(payload);
		// Se hace el trakeo en segment
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
			analytics.track({
				userId: user._id.toString(),
				event: 'psy-application-step',
				properties: {
					step: 1,
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
		mailServicePsy.sendRecruitmentConfirmation(recruited);
		mailServicePsy.sendRecruitmentConfirmationAdmin(recruited);
		logInfo(actionInfo(recruited.email, 'se registró como postulante'));
		return okResponse('Registrado exitosamente', { recruited });
	},
	/**
	 * @description - This service is used to update a recruitment profile
	 * @param {Object} body - The body of the request with the new values
	 * @returns The response code, message and the updated recruitment profile (if any)
	 */
	async update(body, step) {
		if (!(await Recruitment.exists({ email: body.email }))) {
			return conflictResponse('Este postulante no existe');
		}
		// Se hace el trakeo en segment
		if (
			process.env.API_URL.includes('hablaqui.cl') ||
			process.env.DEBUG_ANALYTICS === 'true'
		) {
			if (step !== undefined && step !== null && step !== '') {
				const psyID = await User.findOne({ email: body.email });
				analytics.track({
					userId: psyID._id.toString(),
					event: 'psy-application-step',
					properties: {
						step: step,
					},
				});
			}
		}
		// Se actualiza el perfil de recruitment
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

		// Se actualiza el perfil de recruitment
		let payload = await Recruitment.findOneAndUpdate(
			{ email },
			{ isVerified: true },
			{ new: true }
		);

		// Formateamos el payload para que nos deje editar
		payload = JSON.stringify(payload); // Se convierte el payload a string
		payload = JSON.parse(payload); // Se convierte el payload a JSON

		delete payload._id; // Se elimina el id del payload
		delete payload.__v; // Se elimina el __v del payload

		// Se crea un nuevo perfil de psychologist
		const newProfile = await psychologist.create(payload);
		mailServiceAccount.sendWelcomeNewPsychologist(payload);

		const userUpdated = await User.findOneAndUpdate(
			{ email: payload.email },
			{ $set: { psychologist: newProfile._id } },
			{ new: true }
		);

		// Se hace el trakeo en segment
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
		// Actualizar el plan de un perfil de recruitment
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
	async flagOnboarding(recruitedId, flags) {
		// Actualiza los flags de onboarding de un perfil de recruitment
		const recruitedOnboarding = await Recruitment.findOneAndUpdate(
			{ _id: recruitedId },
			{
				$set: {
					flagOnboarding: flags,
				},
			},
			{ new: true }
		);
		return okResponse('Onboarding actualizado', { recruitedOnboarding }); // Se retorna el perfil de recruitment
	},
};

export default recruitmentService;
