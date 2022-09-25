'use strict';

import Recruitment from '../models/recruitment'; // Contiene la definición del modelo de recruitment para mongodb
import User from '../models/user'; // Contiene la definición del modelo de user para mongodb
import { logInfo } from '../config/winston'; // Se importa el log de info para poder imprimir en la consola
import { conflictResponse, okResponse } from '../utils/responses/functions'; // funciones para generar respuestas http
import { actionInfo } from '../utils/logger/infoMessages'; // recibe información sobre la acción que el usuario realiza
import psychologist from '../models/psychologist'; // Contiene la definición del modelo de psychologist para mongodb
import mailServiceAccount from '../utils/functions/mails/accountsShares'; // Utiliza el servicio de mail
import mailServicePsy from '../utils/functions/mails/psychologistStatus'

var Analytics = require('analytics-node'); // Analytics-node sirve para integrar analiticas en cualquier aplicación.
var analytics = new Analytics(process.env.SEGMENT_API_KEY); // SEGMENT_API_KEY es una variable de entorno que contiene la clave de segment

const recruitmentService = { // Se crea un objeto que contiene los servicios de recruitment
	/**
	 * @description - This controller is used to create a new recruitment profile
	 * @param {Object} user - The user object with all the details for the profile
	 * @param {Object} body - The raw body of the request
	 * @returns Response code, message and the created recruitment profile
	 */
	async register(user, body) { // Se crea un servicio para registrar un nuevo perfil de recruitment
		const payload = { // Se crea un objeto que contiene los datos del perfil de recruitment
			...body, // Se agregan los datos del body
			email: user.email, // Se agrega el email del usuario
			name: user.name, // Se agrega el nombre del usuario
			lastName: user.lastName, // Se agrega el apellido del usuario
			rut: user.rut, // Se agrega el rut del usuario
		};
		if (await Recruitment.exists({ rut: payload.rut })) { // Se verifica si el rut del usuario ya existe en la base de datos
			return conflictResponse('Este postulante ya está registrado'); // Se informa que ya está registrado
		}
		const recruited = await Recruitment.create(payload); // Se crea un nuevo perfil de recruitment
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
		mailServicePsy.sendRecruitmentConfirmation(recruited); // Se envía un correo de confirmación al usuario
		mailServicePsy.sendRecruitmentConfirmationAdmin(recruited); // Se envía un correo de confirmación al administrador
		logInfo(actionInfo(recruited.email, 'se registró como postulante')); // Se imprime en la consola la acción que realizó el usuario
		return okResponse('Registrado exitosamente', { recruited }); // Se informa que se registró exitosamente
	},
	/**
	 * @description - This service is used to update a recruitment profile
	 * @param {Object} body - The body of the request with the new values
	 * @returns The response code, message and the updated recruitment profile (if any)
	 */
	async update(body, step) { // Se crea un servicio para actualizar un perfil de recruitment
		if (!(await Recruitment.exists({ email: body.email }))) { // Se verifica si el email del usuario ya existe en la base de datos
			return conflictResponse('Este postulante no existe'); // Se informa que no existe
		}
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
		const recruited = await Recruitment.findOneAndUpdate( // Se actualiza el perfil de recruitment
			{ email: body.email }, // Se busca por el email
			body, // Se actualizan los datos
			{ new: true } // Se retorna el nuevo perfil
		);
		logInfo(actionInfo(recruited.email, 'actualizó su perfil')); // Se imprime en la consola la acción que realizó el usuario
		return okResponse('Actualizado exitosamente', { recruited }); // Se informa que se actualizó exitosamente
	},
	/**
	 * @description - This service is used to get a recruitment profile by mail
	 * @param {Object} mail - The mail of the recruitment profile
	 * @returns The response code, message and the recruitment profile obtained (if exists)
	 */
	async get(email) { // Se crea un servicio para obtener un perfil de recruitment
		const recruited = await Recruitment.findOne({ email }); // Se busca el perfil de recruitment por el email
		return okResponse('Postulante obtenido', { recruited }); // Se retorna el perfil de recruitment
	},
	/**
	 * @description - This services is used to get all recruitment
	 * @returns The response code, message and the recruitments profile obtained
	 */
	async getAll() { // Se crea un servicio para obtener todos los perfiles de recruitment
		const recruitment = await Recruitment.find({ isVerified: false }); // Se obtienen los perfiles de recruitment y se filtran por los que no están verificados
		return okResponse('Postulantes obtenidos', { recruitment }); // Se retorna los perfiles de recruitment
	},
	/**
	 * @description - This controller checks if a recruitment profile exists and it hasn't been verified.
	 * @returns The response code, message and the new Psychologist profile created succesfully
	 **/
	async approve(user, email) { // Se crea un servicio para aprobar un perfil de recruitment
		if (user.role !== 'superuser') // Se verifica que el usuario que realiza la acción sea un superusuario
			return conflictResponse('No tienes los permisos suficientes'); // Se informa que no tiene los permisos suficientes

		if (!(await Recruitment.exists({ email }))) { // Se verifica si el email del usuario ya existe en la base de datos
			return conflictResponse( // Se informa que no existe
				'Este postulante no existe y el perfil no puede ser aprobado'
			);
		}
		if (await Recruitment.exists({ email, isVerified: true })) { // Se verifica si el email del usuario ya existe en la base de datos y si está verificado
			return conflictResponse( // Se informa que el postulante ya está aprobado
				'Este postulante ya está aprobado y no puede ser aprobado de nuevo'
			);
		}
		let payload = await Recruitment.findOneAndUpdate( // Se actualiza el perfil de recruitment
			{ email },
			{ isVerified: true },
			{ new: true }
		);

		// Formateamos el payload para que nos deje editar
		payload = JSON.stringify(payload); // Se convierte el payload a string
		payload = JSON.parse(payload); // Se convierte el payload a JSON

		delete payload._id; // Se elimina el id del payload
		delete payload.__v; // Se elimina el __v del payload

		const newProfile = await psychologist.create(payload); // Se crea un nuevo perfil de psychologist
		mailServiceAccount.sendWelcomeNewPsychologist(payload); // Se envía un correo de bienvenida al nuevo psicólogo

		const userUpdated = await User.findOneAndUpdate( // Se actualiza el perfil de user
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
	async updatePlan(recruitedId, newPlan) { // Se crea un servicio para actualizar el plan de un perfil de recruitment
		const recruitedToUpdate = await Recruitment.findOneAndUpdate( // Se actualiza el perfil de recruitment
			{ _id: recruitedId },
			{
				$push: { // Se agrega el nuevo plan
					psyPlans: { paymentStatus: 'success', ...newPlan },
				},
			},
			{ new: true }
		);
		return okResponse('Plan actualizado/creado', { recruitedToUpdate }); // Se retorna el perfil de recruitment
	},
	async flagOnboarding(recruitedId, flags) { // Se crea un servicio para actualizar los flags de onboarding de un perfil de recruitment
		const recruitedOnboarding = await Recruitment.findOneAndUpdate( // Se actualiza el perfil de recruitment
			{ _id: recruitedId },
			{
				$set: { // Se actualizan los flags
					flagOnboarding: flags,
				},
			},
			{ new: true }
		);
		return okResponse('Onboarding actualizado', { recruitedOnboarding }); // Se retorna el perfil de recruitment
	},
};

export default recruitmentService;
