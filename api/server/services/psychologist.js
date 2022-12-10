'use strict';

import { logInfo } from '../config/pino';
import sessionsFunctions from './sessions';
import { getAllSessionsFunction } from '../utils/functions/getAllSessionsFunction';
import Psychologist from '../models/psychologist';
import Recruitment from '../models/recruitment';
import User from '../models/user';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import dayjs from 'dayjs';
import Sessions from '../models/sessions';
import {
	bucket,
	getPublicUrlAvatar,
	getPublicUrlAvatarThumb,
} from '../config/bucket';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import Analytics from 'analytics-node';
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.tz.setDefault('America/Santiago');

const analytics = new Analytics(process.env.SEGMENT_API_KEY);

const getAll = async () => {
	// Funcion para obtener todos los psicologos
	let psychologists = await Psychologist.find();
	logInfo('obtuvo todos los psicologos');
	return okResponse('psicologos obtenidos', { psychologists });
};

/**
 * @description Normaliza dentro de un rango de 0 a 1 un puntaje
 * @param {Number} valor - Puntaje a normalizar
 * @param {Number} min - Valor minimo del rango
 * @param {Number} max - Valor maximo del rango
 * @returns - Puntaje normalizado
 */

const normalize = (value, min, max) => {
	return (value - min) / (max - min);
};

/**
 * @description Asigna puntaje por el precio de la sesión
 * @param {Object} psy - Psicologo
 * @param {Object} payload - Contiene las preferencias del paciente
 * @param {Number} pointsPerCriterion - Puntos por cada coincidencia
 * @returns - Puntaje
 */

const priceCriterion = (psy, payload, pointsPerCriterion) => {
	let points = 0;
	if (payload.price >= psy.sessionPrices.video) {
		points = pointsPerCriterion;
	}
	points = normalize(points, 0, pointsPerCriterion);
	return points;
};

/**
 * @description Asigna puntaje por la coincidencia de genero
 * @param {Object} psy - Psicologo
 * @param {Object} payload - Contiene las preferencias del paciente
 * @param {Number} pointsPerCriterion - Puntos por cada coincidencia
 * @returns - Puntaje
 */
const genderCriterion = (psy, payload, pointsPerCriterion) => {
	let points = 0;
	if (payload.gender == psy.gender) {
		points = pointsPerCriterion;
	}
	points = normalize(points, 0, pointsPerCriterion);
	return points;
};

/**
 * @description Asigna puntaje por cantidad de coincidencias de especialidades
 * @param {Object} psy - Psicologo
 * @param {Object} payload - Contiene las preferencias del paciente
 * @param {Number} pointsPerCriterion - Puntos por cada coincidencia
 * @returns - Puntaje normalizado
 */

const criteriaNumberSpecialties = (psy, payload, pointsPerCriterion) => {
	const numberOfSpecialities = 3;
	let points = 0;
	let maximum = 0;
	for (let j = 0; j < numberOfSpecialities; j++) {
		if (psy.specialties[j] === payload.themes[j])
			points += pointsPerCriterion;
		maximum += pointsPerCriterion;
	}
	points = normalize(points, 0, maximum);
	return points;
};

/**
 * @description Saca el puntaje maximo de disponibilidad de un psicologo
 * @param {Object} payload - Contiene las preferencias del paciente
 * @param {Number} pointsPerCriterion - Puntos por cada coincidencia
 * @returns - Puntaje maximum
 */

const maximumAvailability = (payload, pointsPerCriterion) => {
	let maximum = 0;
	if (payload.schedule == 'morning') maximum = (12 - 6) * pointsPerCriterion;
	if (payload.schedule == 'midday') maximum = (15 - 13) * pointsPerCriterion;
	if (payload.schedule == 'afternoon')
		maximum = (23 - 16) * pointsPerCriterion;
	return maximum;
};

/**
 * @description Asigna puntaje por cantidad de coincidencias de disponibilidad
 * @param {Object} days - Días de disponibilidad del psicologo
 * @param {Object} payload - Contiene las preferencias del paciente
 * @param {Number} pointsPerCriterion - Puntos por cada coincidencia
 * @returns - Puntaje
 */

const pointsDisponibilidad = (days, payload, pointsPerCriterion, nextDays) => {
	let points = 0;
	for (let i = 0; i < nextDays; i++) {
		// Verifica si la hora es en la mañana, tarde o noche y ve su disponibilidad
		days[i].available.forEach(hora => {
			if (
				dayjs(hora, 'HH:mm').isBetween(
					dayjs('00:00', 'HH:mm'),
					dayjs('08:59', 'HH:mm')
				) &&
				payload.schedule == 'early'
			) {
				points += pointsPerCriterion;
			} else if (
				dayjs(hora, 'HH:mm').isBetween(
					dayjs('09:00', 'HH:mm'),
					dayjs('11:59', 'HH:mm')
				) &&
				payload.schedule == 'morning'
			) {
				points += pointsPerCriterion;
			} else if (
				dayjs(hora, 'HH:mm').isBetween(
					dayjs('12:00', 'HH:mm'),
					dayjs('13:59', 'HH:mm')
				) &&
				payload.schedule == 'midday'
			) {
				points += pointsPerCriterion;
			} else if (
				dayjs(hora, 'HH:mm').isBetween(
					dayjs('14:00', 'HH:mm'),
					dayjs('17:59', 'HH:mm')
				) &&
				payload.schedule == 'afternoon'
			) {
				points += pointsPerCriterion;
			} else if (
				dayjs(hora, 'HH:mm').isBetween(
					dayjs('18:00', 'HH:mm'),
					dayjs('23:59', 'HH:mm')
				) &&
				payload.schedule == 'night'
			) {
				points += pointsPerCriterion;
			}
		});
	}
	return points;
};

/**
 * @description Asigna puntaje por la cantidad de sesiones disponibles en un horario
 * @param {Object} psy - Psicologo
 * @param {Object} payload - Contiene las preferencias del paciente
 * @param {Number} pointsPerCriterion - Puntos por cada coincidencia
 * @returns - Puntaje normalizado
 */

const criterioDisponibilidad = (payload, pointsPerCriterion, days) => {
	let points = 0;
	const nextDays = 3;
	const maximum = maximumAvailability(payload, pointsPerCriterion);
	points = pointsDisponibilidad(days, payload, pointsPerCriterion, nextDays);
	points = normalize(points, 0, maximum);
	return points;
};

/**
 * @description Asigna puntaje por la cantidad de coincidencias de modelo terapeutico
 * @param {Object} psy - Psicologo
 * @param {Object} payload - Contiene las preferencias del paciente
 * @param {Number} pointsPerCriterion - Puntos por cada coincidencia
 * @returns - Puntaje normalizado
 */

const criterioModeloTeraupetico = (psy, payload, pointsPerCriterion) => {
	const modelQuantity = 3;
	let points = 0;
	let maximum = 0;
	// Se suma points por cada coincidencia y se obtiene el total de puntaje posible
	for (let j = 0; j < modelQuantity; j++) {
		if (psy.model[j] === payload.model[j]) points += pointsPerCriterion;
		maximum += pointsPerCriterion;
	}
	points = normalize(points, 0, maximum);
	return points;
};

/**
 * @description Pondera los psicologos segun sus puntajes
 * @param {Array} matchedList - Lista de psicologos matchados que se quiere ponderar
 * @param {Object} payload - Objeto con las preferencias del usuario
 * @returns {Array} - Lista de psicologos ponderados
 */

const ponderationMatch = async (matchedList, payload, weighted) => {
	const pointsPerCriterion = 3;
	// Se obtienen todas las sessiones
	const sessions = await Sessions.find();
	// Devuelve una promesa que termina correctamente cuando todas las promesas en el argumento iterable han sido concluídas con éxito
	let newMatchedList = await Promise.all(
		matchedList.map(async psy => {
			let criteria = 0;
			let points = normalize(psy.points, 0, 100) * weighted[criteria];
			const sessionPsy = sessions.filter(
				session => session.psy === psy._id
			);
			criteria++;
			// Se le asigna un puntaje según la cantidad de coincidencias (3 por que son 3 especialidades)
			points +=
				weighted[criteria] *
				criteriaNumberSpecialties(psy, payload, pointsPerCriterion);
			criteria++;
			// Se obtiene la disponibilidad del psicologo y recorre los primeros 3 días
			const days = await sessionsFunctions.getFormattedSessionsForMatch(
				psy,
				sessionPsy
			);
			points +=
				weighted[criteria] *
				criterioDisponibilidad(payload, pointsPerCriterion, days);
			criteria++;
			// Se obtiene el precio del psicologo y se le asigna un puntaje dado por el precio
			points +=
				priceCriterion(psy, payload, pointsPerCriterion) *
				weighted[criteria];
			criteria++;
			// Se obtiene el modelo terapeutico del psicologo y se le asigna un puntaje dado por el modelo
			points +=
				criterioModeloTeraupetico(psy, payload, pointsPerCriterion) *
				weighted[criteria];
			criteria++;
			// Se obtiene el genero del psicologo y se le asigna un puntaje dado por el genero
			points +=
				genderCriterion(psy, payload, pointsPerCriterion) *
				weighted[criteria];
			criteria++;
			// De documento de mongo se pasa a un formato de objeto JSON
			let psychologist = JSON.stringify(psy);
			psychologist = JSON.parse(psychologist);
			return { ...psychologist, points, days };
		})
	);
	// Se ordena el arreglo por puntuación manual del psicologo
	newMatchedList = newMatchedList.sort((a, b) => b.points - a.points);
	// Se imprime los puntajes de cada psicologo
	return newMatchedList;
};

const bestMatch = async body => {
	const { payload } = body;
	let matchedPsychologists = [];
	let perfectMatch = true;
	// Ponderado es un array que contiene el porcentaje de ponderación de cada criterio
	// (puntaje manual, especialidad, disponibilidad, precio, modelo terapeutico, genero)
	const weighted = [0.01, 0.05, 0.2, 0.5, 0.04, 0.2];

	// Comienza a buscar los psicologos por genero y especialidad
	if (payload.gender == 'transgender') {
		matchedPsychologists = await Psychologist.find({
			isTrans: true,
			specialties: { $in: payload.themes },
		});
	} else {
		matchedPsychologists = await Psychologist.find({
			gender: payload.gender || {
				$in: ['male', 'female', 'transgender'],
			},
			specialties: { $in: payload.themes },
		});
	}

	// Si no encuentra como minimo 0, busca el psicologo solo respecto al genero
	if (matchedPsychologists.length == 0) {
		if (payload.gender == 'transgender') {
			matchedPsychologists = await Psychologist.find({
				isTrans: true,
			});
		} else {
			matchedPsychologists = await Psychologist.find({
				gender: payload.gender || {
					// Se buscan los psicologos por género, prioriza payload.gender el genero entregado por el cliente.
					$in: ['male', 'female', 'transgender'],
				},
			});
		}
		if (matchedPsychologists.length == 0) {
			matchedPsychologists = await Psychologist.find();
		}
		perfectMatch = false;
	}

	// Se busca el mejor match según criterios
	matchedPsychologists = await ponderationMatch(
		matchedPsychologists,
		payload,
		weighted
	);

	return okResponse('psicologos encontrados', {
		matchedPsychologists,
		perfectMatch,
	});
};

const economicMatch = async body => {
	const { payload } = body;
	let matchedPsychologists = [];
	let perfectMatch = true;

	// Comienza a buscar los psicologos por genero y especialidad
	if (payload.gender == 'transgender') {
		matchedPsychologists = await Psychologist.find({
			isTrans: true,
			specialties: { $in: payload.themes },
		});
	} else {
		matchedPsychologists = await Psychologist.find({
			gender: payload.gender || {
				$in: ['male', 'female', 'transgender'],
			},
			specialties: { $in: payload.themes },
		});
	}

	// Si no encuentra como minimo 1, busca el psicologo solo respecto al genero
	if (matchedPsychologists.length == 0) {
		if (payload.gender == 'transgender') {
			matchedPsychologists = await Psychologist.find({
				isTrans: true,
			});
		} else {
			matchedPsychologists = await Psychologist.find({
				gender: payload.gender || {
					// Se buscan los psicologos por género, prioriza payload.gender el genero entregado por el cliente.
					$in: ['male', 'female', 'transgender'],
				},
			});
		}
		if (matchedPsychologists.length == 0) {
			matchedPsychologists = await Psychologist.find();
		}
		perfectMatch = false;
	}

	// Se busca el mejor match según criterios
	// Obtiene primero al psy más barato
	matchedPsychologists.sort(
		(a, b) => a.sessionPrices.video - b.sessionPrices.video
	);

	return okResponse('psicologos encontrados', {
		matchedPsychologists,
		perfectMatch,
	});
};

const availityMatch = async body => {
	const { payload } = body;
	let points = 0;
	const nextDays = 7;
	let pointsPerCriterion = 1;
	let matchedPsychologists = [];
	let perfectMatch = true;

	// Comienza a buscar los psicologos por genero y especialidad
	if (payload.gender == 'transgender') {
		matchedPsychologists = await Psychologist.find({
			isTrans: true,
			specialties: { $in: payload.themes },
		});
	} else {
		matchedPsychologists = await Psychologist.find({
			gender: payload.gender || {
				$in: ['male', 'female', 'transgender'],
			},
			specialties: { $in: payload.themes },
		});
	}

	// Si no encuentra como minimo 3, busca el psicologo solo respecto al genero
	if (matchedPsychologists.length == 0) {
		if (payload.gender == 'transgender') {
			matchedPsychologists = await Psychologist.find({
				isTrans: true,
			});
		} else {
			matchedPsychologists = await Psychologist.find({
				gender: payload.gender || {
					// Se buscan los psicologos por género, prioriza payload.gender el genero entregado por el cliente.
					$in: ['male', 'female', 'transgender'],
				},
			});
		}
		if (matchedPsychologists.length == 0) {
			matchedPsychologists = await Psychologist.find();
		}
		perfectMatch = false;
	}

	// Se obtienen todas las sessiones
	const sessions = await Sessions.find();

	// Entre los psicologos ya ponderados se obtiene cual es el que tiene mayor disponibilidad
	matchedPsychologists = await Promise.all(
		matchedPsychologists.map(async psy => {
			psy.points = 0;
			const sessionPsy = sessions.filter(
				session => session.psy === psy._id
			);
			const days = await sessionsFunctions.getFormattedSessionsForMatch(
				psy,
				sessionPsy
			);
			points = pointsDisponibilidad(
				days,
				payload,
				pointsPerCriterion,
				nextDays
			);
			let psychologist = JSON.stringify(psy);
			psychologist = JSON.parse(psychologist);
			return { ...psychologist, points };
		})
	);
	// Se obtiene el psicologo con mayor disponibilidad representado por b
	matchedPsychologists.sort((a, b) => b.points - a.points);

	return okResponse('psicologos encontrados', {
		matchedPsychologists,
		perfectMatch,
	});
};

const rescheduleSession = async (sessionsId, planId, sessionId, newDate) => {
	// Se da formato a la fecha
	newDate = dayjs(newDate, 'yyyy-MM-DDTHH:mm').format('MM/DD/YYYY HH:mm');
	// Se busca la sesion que se va a reprogramar y se actualiza la fecha
	const sessions = await Sessions.findOneAndUpdate(
		{
			_id: sessionsId,
			'plan._id': planId,
			'plan.session._id': sessionId,
		},
		{
			$set: {
				'plan.$[].session.$[session].date': newDate,
			},
		},
		{ arrayFilters: [{ 'session._id': sessionId }], new: true }
	).populate('psychologist user');
	// Se verifica que la sesion exista
	if (!sessions) {
		return conflictResponse('Sesion no encontrada');
	}
	// Se verifica si el plan sigue vigente
	sessions.plan.forEach(plan => {
		for (let i = 0; i < plan.session.length; i++) {
			if (
				plan.session[i]._id.toString() === sessionId.toString() &&
				dayjs(plan.session[i].date, 'MM/DD/YYYY HH:mm').isAfter(
					plan.expiration,
					'MM/DD/YYYY HH:mm'
				) &&
				plan._id.toString() === planId.toString()
			) {
				// Se actualiza la fecha de vencimiento a 50 minutos despues de la ultima sesion
				plan.expiration = dayjs(newDate, 'MM/DD/YYYY HH:mm')
					.add(50, 'minutes')
					.format();
			}
		}
	});
	await sessions.save();
	return okResponse('Hora actualizada', { sessions });
};
const updatePlan = async (psychologistId, planInfo) => {
	// Funcion para actualizar el plan de un psicologo, se busca el psicologo por su id y se actualiza
	const updatedPsychologist = await Psychologist.findByIdAndUpdate(
		psychologistId,
		{
			$push: {
				psyPlans: { paymentStatus: 'success', ...planInfo },
			},
		},
		{ new: true }
	);
	return okResponse('Plan creado', { psychologist: updatedPsychologist });
};

const getByData = async username => {
	// Funcion para obtener un psicologo por su username
	const usernameSearch = await Psychologist.findOne({ username });
	if (!usernameSearch) {
		const idSearch = await Psychologist.findOne({ _id: username });
		return okResponse('Psicólogo encontrado', {
			psychologist: idSearch,
		});
	}
	return okResponse('Psicólogo encontrado', { psychologist: usernameSearch }); // Se retorna una respuesta con el psicologo
};

const setSchedule = async (user, payload) => {
	let response;
	// Si el user es un psicologo, se busca el psicologo por su id y se actualiza el horario
	if (user.psychologist) {
		response = await Psychologist.findByIdAndUpdate(
			user.psychologist,
			{
				$set: {
					schedule: {
						monday: payload.monday,
						tuesday: payload.tuesday,
						wednesday: payload.wednesday,
						thursday: payload.thursday,
						friday: payload.friday,
						saturday: payload.saturday,
						sunday: payload.sunday,
					},
				},
			},
			{ new: true }
		);
	}
	// Si el user es un postulante (psychologist === undefined), pero no un user
	else {
		response = await Recruitment.findOneAndUpdate(
			{ email: user.email },
			{
				$set: {
					schedule: {
						monday: payload.monday,
						tuesday: payload.tuesday,
						wednesday: payload.wednesday,
						thursday: payload.thursday,
						friday: payload.friday,
						saturday: payload.saturday,
						sunday: payload.sunday,
					},
				},
			},
			{ new: true }
		);
	}
	return okResponse('Horario actualizado', {
		psychologist: response,
	});
};

const updatePaymentMethod = async (user, payload) => {
	if (user.role !== 'psychologist')
		return conflictResponse('No eres un psicologo.');
	else {
		// Si el user es un psicologo se busca por su id y se actualiza el metodo de pago
		let foundPsychologist;
		if (user.psychologist) {
			foundPsychologist = await Psychologist.findById(user.psychologist);
		} else {
			// Si el user es un postulante
			foundPsychologist = await Recruitment.findOne({
				email: user.email,
			});
		}
		// Se crea un nuevo metodo de pago, se agregan los datos y se guarda
		const newPaymentMethod = {
			bank: payload.bank || foundPsychologist.paymentMethod.bank,
			accountType:
				payload.accountType ||
				foundPsychologist.paymentMethod.accountType,
			accountNumber:
				payload.accountNumber ||
				foundPsychologist.paymentMethod.accountNumber,
			rut: payload.rut || foundPsychologist.paymentMethod.rut,
			name: payload.name || foundPsychologist.paymentMethod.name,
			email: payload.email || foundPsychologist.paymentMethod.email,
		};
		foundPsychologist.paymentMethod = newPaymentMethod;
		await foundPsychologist.save();
		return okResponse('Metodo de pago actualizado', {
			psychologist: foundPsychologist,
		});
	}
};

const updatePsychologist = async (user, profile) => {
	if (user.role == 'user') return conflictResponse('No tienes poder.');
	if (user.psychologist) {
		// Si el user es un psicologo intenta actualizar el psicologo
		try {
			const psy = await Psychologist.findById(profile._id);
			if (psy.sessionPrices.video !== profile.sessionPrices.video) {
				// Si existe una fecha de vencimiento, y esta está antes de la fecha actual adelantado un mes
				if (
					psy.stampSetPrices &&
					dayjs().isBefore(dayjs(psy.stampSetPrices).add(1, 'months'))
				)
					profile.sessionPrices = psy.sessionPrices;
				else profile.stampSetPrices = dayjs().format();
			}
			const updated = await Psychologist.findByIdAndUpdate(
				profile._id,
				profile,
				{
					new: true,
					runValidators: true,
					context: 'query',
				}
			);
			// Hace el trackeo de segment
			if (
				process.env.API_URL.includes('hablaqui.cl') ||
				process.env.DEBUG_ANALYTICS === 'true'
			) {
				const getUser = await User.findOne({ email: user.email });
				const id = getUser._id;
				analytics.track({
					userId: id.toString(),
					event: 'psy-updated-profile',
				});
				analytics.identify({
					userId: id.toString(),
					traits: {
						email: updated.email,
						name: updated.name,
						lastName: updated.lastName,
						username: updated.username,
						code: updated.code,
						avatar: updated.avatar,
						country: updated.country,
						marketplaceVisibility:
							updated.preferences.marketplaceVisibility,
						birthDate: updated.birthDate,
						comuna: updated.comuna,
						region: updated.region,
						isVerified: updated.isVerified,
						approveAvatar: updated.approveAvatar,
						freeFirstSession: updated.freeFirstSession,
						hasPersonalDescription:
							updated.personalDescription == '' ? false : true,
						hasProfessionalDescription:
							updated.professionalDescription == ''
								? false
								: true,
						personalDescription: updated.personalDescription,
						professionalDescription:
							updated.professionalDescription,
						role: 'psychologist',
					},
				});
			}

			logInfo(user.email, 'actualizo su perfil de psicologo');
			return okResponse('Actualizado exitosamente', {
				psychologist: updated,
			});
		} catch (err) {
			logInfo(err.stack);
			return conflictResponse(
				'Ocurrió un error al actualizar el perfil. Verifica los campos.'
			);
		}
	} else {
		try {
			// Se intenta actualizar el psicologo
			const updated = await Recruitment.findByIdAndUpdate(
				profile._id,
				profile,
				{
					new: true,
				}
			);
			// Se hace el trackeo de segment
			if (
				process.env.API_URL.includes('hablaqui.cl') ||
				process.env.DEBUG_ANALYTICS === 'true'
			) {
				analytics.track({
					userId: user.id.toString(),
					event: 'recruited-updated-profile',
				});
				analytics.identify({
					userId: user.id.toString(),
					traits: {
						email: updated.email,
						name: updated.name,
						lastName: updated.lastName,
						username: updated.username,
						code: updated.code,
						avatar: updated.avatar,
						country: updated.country,
						marketplaceVisibility:
							updated.preferences.marketplaceVisibility,
						birthDate: updated.birthDate,
						comuna: updated.comuna,
						region: updated.region,
						isVerified: updated.isVerified,
						approveAvatar: updated.approveAvatar,
						freeFirstSession: updated.freeFirstSession,
						hasPersonalDescription:
							updated.personalDescription == '' ? false : true,
						hasProfessionalDescription:
							updated.professionalDescription == ''
								? false
								: true,
						personalDescription: updated.personalDescription,
						professionalDescription:
							updated.professionalDescription,
						role: 'recruited',
					},
				});
			}
			return okResponse('Actualizado exitosamente', {
				psychologist: updated,
			});
		} catch (err) {
			logInfo(err.stack);
			return conflictResponse(
				'Ocurrió un error al actualizar el perfil. Verifica los campos.'
			);
		}
	}
};

const deleteOne = async (user, id) => {
	if (user.role !== 'superuser')
		return conflictResponse(
			'No tienes permisos suficientes para realizar esta acción'
		);

	// Se elimina el psicologo, se busca por id y se elimina
	await Psychologist.deleteOne({ _id: id });
	const psychologists = await Psychologist.find();
	return okResponse('Psicologo eliminado', { psychologists });
};

const setPrice = async (user, newPrice) => {
	newPrice = Number(newPrice);
	if (user.role != 'psychologist')
		return conflictResponse('No tienes permisos');
	const psy = await Psychologist.findById(user.psychologist);

	// Si el psicologo ya esta establecido, y el precio aún no expira
	if (
		psy.stampSetPrices &&
		dayjs().isBefore(dayjs(psy.stampSetPrices).add(1, 'months'))
	)
		return conflictResponse(
			'Tiene que esperar 1 mes para volver a cambiar el precio'
		);

	// Se actualiza el precio
	let updatedPsychologist = await Psychologist.findByIdAndUpdate(
		user.psychologist,
		{
			sessionPrices: {
				text: newPrice * 0.75,
				video: newPrice,
				full: newPrice * 1.25,
			},
			stampSetPrices: dayjs(),
		},
		{ new: true }
	);
	return okResponse('Precios actualizados', {
		psychologist: updatedPsychologist,
	});
};

const getClients = async psychologist => {
	// Se busca las sessiones de un psicologo en particular y se filtran por las que estan pagadas
	let sessions = await Sessions.find({
		psychologist: psychologist,
	}).populate('user');

	return okResponse('Usuarios encontrados', {
		users: sessions
			.filter(item => item.user)
			.map(item => ({
				_id: item.user._id,
				avatar: item.user.avatar,
				avatarThumbnail: item.user.avatarThumbnail,
				createdAt: item.user.createdAt,
				direction: item.user.direction,
				email: item.user.email,
				fullname: `${item.user.name} ${
					item.user.lastName ? item.user.lastName : ''
				}`,
				lastName: item.user.lastName,
				birthDate: item.user.birthDate,
				lastSession: getLastSession(item) || 'N/A',
				name: item.user.name,
				observation: item.observation,
				phone: item.user.phone,
				plan: item.plan.find(
					plan =>
						plan.payment === 'success' &&
						dayjs().isBefore(dayjs(plan.expiration))
				),
				role: item.user.role,
				roomsUrl: item.roomsUrl,
				rut: item.user.rut,
				sessionsId: item._id,
			}))
			.filter(item => !!item.plan),
	});
};

const getLastSession = item => {
	// Se obtiene la ultima sesion de un documento Sessions, se le da formato, se ordena, se filtra y se retorna
	return item.plan
		.flatMap(plan =>
			plan.session.map(session =>
				dayjs(session.date, 'MM/DD/YYYY HH:mm').format('DD/MM/YYYY')
			)
		)
		.sort((a, b) => new Date(b) - new Date(a))
		.find(sessionDate =>
			dayjs(sessionDate, 'DD/MM/YYYY').isSameOrBefore(dayjs())
		);
};

const searchClients = async search => {
	// Se busca un usuario por nombre y correo
	const foundUser = await User.find({ email: search, name: search });
	if (!foundUser) {
		return okResponse('No se encontró al usuario', { users: [] });
	}
	return okResponse('Usuario encontrado', { users: foundUser });
};

const usernameAvailable = async username => {
	// Se verifica si el nombre de usuario ya existe para saber si el usuario está disponible
	let available = true;
	if (await Psychologist.exists({ username })) available = false;
	return okResponse(
		available ? 'Usuario disponible' : 'Usuario ya esta ocupado',
		{ available }
	);
};

const updateFormationExperience = async (user, payload) => {
	if (user.role != 'psychologist') {
		return conflictResponse('No eres psicologo');
	}

	/**
	 * Payload schema:
	 * 	models: array
	 * 	specialties: array
	 * 	languages: array
	 * 	formation: array
	 * 	experience: array
	 */

	let updatedPsychologist = await Psychologist.findByIdAndUpdate(
		user.psychologist,
		payload,
		{ new: true }
	);
	return okResponse('psicologo actualizado', {
		psychologist: updatedPsychologist,
	});
};

const uploadProfilePicture = async (psyID, picture) => {
	if (!picture) return conflictResponse('No se ha enviado ninguna imagen');
	const { name, lastName, _id } = await User.findById(psyID);
	// Se crea el archivo en GCS, GCS es un bucket de Google Cloud Storage, un bucket en Google Cloud Storage son contenedores básicos que contienen los datos
	const gcsname = `${psyID}-${name}-${lastName}`;
	const file = bucket.file(gcsname);
	// Se crea un stream para escribir en el archivo y se escribe el metadato de la imagen
	const stream = file.createWriteStream({
		metadata: {
			contentType: picture.mimetype,
		},
	});
	stream.on('error', err => {
		picture.cloudStorageError = err;
		conflictResponse('Error al subir la imagen');
	});
	stream.on('finish', () => {
		logInfo(`${gcsname}` + ' subido exitosamente');
	});
	// Se escribe el archivo en el stream
	stream.end(picture.buffer);

	// Se hace el trackeo de la imagen en segment
	if (
		process.env.API_URL.includes('hablaqui.cl') ||
		process.env.DEBUG_ANALYTICS === 'true'
	) {
		analytics.track({
			userId: _id.toString(),
			event: 'updated-profile-picture',
			properties: {
				avatar: getPublicUrlAvatar(gcsname),
			},
		});
	}

	await Psychologist.findByIdAndUpdate(psyID, {
		avatar: getPublicUrlAvatar(gcsname),
		avatarThumbnail: getPublicUrlAvatarThumb(gcsname),
	});

	return okResponse('Imagen subida', {
		// Se retorna una respuesta de exito
		avatar: getPublicUrlAvatar(gcsname),
		avatarThumbnail: getPublicUrlAvatarThumb(gcsname),
	});
};

const approveAvatar = async (user, id) => {
	if (user.role !== 'superuser')
		return conflictResponse(
			'No tienes permisos suficientes para realizar esta acción'
		);

	// Se busca el psicologo y se le aprueba la imagen de avatar
	const psychologist = await Psychologist.findByIdAndUpdate(
		id,
		{
			approveAvatar: true,
		},
		{ new: true }
	);
	return okResponse('Avatar aprobado', {
		psychologist,
	});
};

const changeToInmediateAttention = async psy => {
	/*if (user.role !== 'psychologist')
		return conflictResponse('No tienes permitida esta opción');
	const psy = user.psychologist;*/
	let psychologist = await Psychologist.findById(psy);
	// Si la atención inmediata está activada, se desactiva
	if (psychologist.inmediateAttention.activated) {
		psychologist = await Psychologist.findOneAndUpdate(
			{ _id: psy },
			{
				$set: {
					inmediateAttention: {
						activated: false,
						expiration: '',
					},
				},
			},
			{ new: true }
		);
	} else {
		// Si no esta activado el plan inmediato de atención
		let sessions = await getAllSessionsFunction(psy);
		let now = new Date();
		// Se filtran las sesiones que si la fecha de la sesión es menor a la fecha actual mas 3 horas
		sessions = sessions.filter(session => {
			const date = dayjs(session.date).format('DD/MM/YYYY HH:mm');
			return (
				session.status !== 'success' &&
				dayjs(date).isBefore(dayjs(now).add(3, 'hours')) &&
				dayjs(date)
					.add(50, 'minutes')
					.isAfter(dayjs(now))
			);
		});

		if (sessions.length !== 0)
			return conflictResponse('Tiene sesiones próximas');

		// Se activa el plan inmediato de atención
		psychologist = await Psychologist.findOneAndUpdate(
			{ _id: psy },
			{
				$set: {
					inmediateAttention: {
						activated: true,
						expiration: dayjs(now)
							.add(1, 'hour')
							.format(),
					},
				},
			},
			{ new: true }
		);
	}

	const msj = psychologist.inmediateAttention.activated
		? 'Estaras disponible durante las proxima 3 horas'
		: 'Atención inmediata desactivada';

	return okResponse(msj, {
		psychologist,
	});
};
/*
const getAllSessionsInmediateAttention = async () => {
	let psychologist = await Psychologist.find({}).select(
		'_id inmediateAttention'
	);
	// Para que nos de deje modificar el array de mongo
	psychologist = JSON.stringify(psychologist);
	psychologist = JSON.parse(psychologist);
	psychologist = psychologist.filter(
		psy => psy.inmediateAttention.activated === true
	);

	let allSessions = await Sessions.find().populate(
		'psychologist',
		'_id inmediateAttention'
	);

	let now = Date.now();
	// Formato de array debe ser [date, date, ...date]
	const setDaySessions = sessions =>
		sessions.flatMap(item => {
			return item.plan
				.flatMap(plan => {
					return plan.session.length
						? plan.session.map(session => session.date)
						: [];
				})
				.filter(session => {
					const date = dayjs(session.date).format(
						'DD/MM/YYYY HH:mm'
					);
					return (
						session.status !== 'success' &&
						dayjs(date).isBefore(dayjs(now).add(3, 'hours')) &&
						dayjs(date)
							.add(50, 'minutes')
							.isAfter(dayjs(now))
					);
				});
		});

	allSessions = psychologist.map(item => ({
		...item,
		sessions: setDaySessions(
			allSessions.filter(element => element.psychologist === item._id)
		).length,
	}));

	return okResponse('Sesiones', { allSessions });
};*/

const psychologistsService = {
	approveAvatar,
	deleteOne,
	getAll,
	getByData,
	getClients,
	bestMatch,
	economicMatch,
	availityMatch,
	rescheduleSession,
	searchClients,
	setPrice,
	setSchedule,
	updateFormationExperience,
	updatePaymentMethod,
	updatePlan,
	updatePsychologist,
	uploadProfilePicture,
	usernameAvailable,
	changeToInmediateAttention,
};
export default Object.freeze(psychologistsService);
