'use strict';

import { logInfo } from '../config/pino';
import Psychologist from '../models/psychologist';
import User from '../models/user';
import bcrypt from 'bcrypt';
import chat from './chat';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import moment from 'moment';
import momentz from 'moment-timezone';
import pusher from '../config/pusher';
import { pusherCallback } from '../utils/functions/pusherCallback';
import Sessions from '../models/sessions';

const getAll = async () => {
	const psychologists = await Psychologist.find();
	logInfo('obtuvo todos los psicologos');
	return okResponse('psicologos obtenidos', { psychologists });
};

// const getSessions = async (user, idPsy) => {
// 	const psychologist = await Psychologist.findById(idPsy).populate({
// 		path: 'sessions.user',
// 		model: 'User',
// 		select: 'name lastName _id',
// 	});

// 	const sessions = setSession(user, psychologist);

// 	logInfo('obtuvo todos las sesiones');
// 	return okResponse('sesiones obtenidas', { sessions });
// };

// const setSession = (user, psychologist) => {
// 	let sessions = [];

// 	if (user.role === 'user')
// 		sessions = psychologist.sessions.filter(session => {
// 			return (
// 				session.user &&
// 				!Array.isArray(session.user) &&
// 				session.user._id.toString() === user._id.toString()
// 			);
// 		});

// 	if (user.role === 'psychologist')
// 		sessions = sessions = psychologist.sessions;

// 	sessions = sessions
// 		.map(item => {
// 			let name = '';
// 			let lastName = '';
// 			let idUser = '';
// 			if (user.role === 'psychologist') {
// 				if (item.user && !Array.isArray(item.user)) {
// 					name = item.user.name;
// 					lastName = item.user.lastName ? item.user.lastName : '';
// 					idUser = item.user._id;
// 				}
// 			}

// 			if (user.role === 'user') {
// 				idUser = user._id;
// 				name = psychologist.name;
// 				lastName = psychologist.lastName;
// 			}

// 			const start = moment(item.date).format('YYYY-MM-DD hh:mm');
// 			const end = moment(item.date)
// 				.add(60, 'minutes')
// 				.format('YYYY-MM-DD hh:mm');
// 			return {
// 				name: `${name} ${lastName}`,
// 				details: `Sesion con ${name}`,
// 				start,
// 				end,
// 				sessionId: item._id,
// 				idUser,
// 				idPsychologist: psychologist._id,
// 			};
// 		})
// 		.filter(el => el.start !== 'Invalid date' && el.end !== 'Invalid date');
// 	return sessions;
// };

// const getFormattedSessions = async idPsychologist => {
// 	moment.locale('es');
// 	let sessions = [];
// 	const psychologist = await Psychologist.findById(idPsychologist);
// 	const length = Array.from(Array(31), (_, x) => x);
// 	const hours = Array.from(Array(24), (_, x) =>
// 		moment()
// 			.hour(x)
// 			.minute(0)
// 			.format('HH:mm')
// 	);

// 	const daySessions = psychologist.sessions.map(session =>
// 		moment(session.date).format('YYYY-MM-DD HH:mm')
// 	);

// 	sessions = length.map(el => {
// 		const day = moment().add(el, 'days');
// 		return {
// 			id: el,
// 			text: day.format('ddd'),
// 			day: day.format('DD MMM'),
// 			date: day.format('L'),
// 			available: hours.filter(hour => {
// 				return (
// 					formattedSchedule(psychologist.schedule, day, hour) &&
// 					moment(daySessions).isValid &&
// 					!daySessions.some(
// 						date =>
// 							moment(date).format('L') ===
// 								moment(day).format('L') &&
// 							hour === moment(date).format('HH:mm')
// 					)
// 				);
// 			}),
// 		};
// 	});

// 	return okResponse('sesiones obtenidas', { sessions });
// };

const formattedSchedule = (schedule, day, hour) => {
	// VERSION 2
	// let validHour = false;
	// const week = [
	// 	'monday',
	// 	'tuesday',
	// 	'wednesday',
	// 	'thursday',
	// 	'saturday',
	// 	'sunday',
	// ];
	// day = moment(day).format('dddd');
	// week.forEach(weekDay => {
	// 	if (day.toLowerCase() === weekDay)
	// 		if (Array.isArray(schedule[weekDay]))
	// 			validHour = moment(hour, 'HH:mm').isBetween(
	// 				moment(schedule[weekDay][0], 'HH:mm'),
	// 				moment(schedule[weekDay][1], 'HH:mm'),
	// 				undefined,
	// 				[]
	// 			);
	// 		else if (schedule[weekDay] === 'busy') validHour = false;
	// });

	// return validHour;

	if (moment(day).format('dddd') === 'lunes') {
		if (Array.isArray(schedule.monday))
			return moment(hour, 'HH:mm').isBetween(
				moment(schedule.monday[0], 'HH:mm'),
				moment(schedule.monday[1], 'HH:mm'),
				undefined,
				[]
			);
		else if (schedule.monday === 'busy') return false;
	}
	if (moment(day).format('dddd') === 'martes') {
		if (Array.isArray(schedule.tuesday))
			return moment(hour, 'HH:mm').isBetween(
				moment(schedule.tuesday[0], 'HH:mm'),
				moment(schedule.tuesday[1], 'HH:mm'),
				undefined,
				[]
			);
		else if (schedule.tuesday === 'busy') return false;
	}
	if (moment(day).format('dddd') === 'miércoles') {
		if (Array.isArray(schedule.wednesday))
			return moment(hour, 'HH:mm').isBetween(
				moment(schedule.wednesday[0], 'HH:mm'),
				moment(schedule.wednesday[1], 'HH:mm'),
				undefined,
				[]
			);
		else if (schedule.wednesday === 'busy') return false;
	}
	if (moment(day).format('dddd') === 'jueves') {
		if (Array.isArray(schedule.thursday))
			return moment(hour, 'HH:mm').isBetween(
				moment(schedule.thursday[0], 'HH:mm'),
				moment(schedule.thursday[1], 'HH:mm'),
				undefined,
				[]
			);
		else if (schedule.thursday === 'busy') return false;
	}
	if (moment(day).format('dddd') === 'viernes') {
		if (Array.isArray(schedule.friday))
			return moment(hour, 'HH:mm').isBetween(
				moment(schedule.friday[0], 'HH:mm'),
				moment(schedule.friday[1], 'HH:mm'),
				undefined,
				[]
			);
		else if (schedule.friday === 'busy') return false;
	}
	if (moment(day).format('dddd') === 'sábado') {
		if (Array.isArray(schedule.saturday))
			return moment(hour, 'HH:mm').isBetween(
				moment(schedule.saturday[0], 'HH:mm'),
				moment(schedule.saturday[1], 'HH:mm'),
				undefined,
				[]
			);
		else if (schedule.saturday === 'busy') return false;
	}
	if (moment(day).format('dddd') === 'domingo') {
		if (Array.isArray(schedule.sunday))
			return moment(hour, 'HH:mm').isBetween(
				moment(schedule.sunday[0], 'HH:mm'),
				moment(schedule.sunday[1], 'HH:mm'),
				undefined,
				[]
			);
	} else if (schedule.sunday === 'busy') return false;
};

const match = async body => {
	const { payload } = body;
	let matchedPsychologists = [];
	if (payload.gender == 'transgender') {
		matchedPsychologists = await Psychologist.find({
			models: payload.model,
			isTrans: true,
			specialties: { $in: payload.themes },
		});
	} else {
		matchedPsychologists = await Psychologist.find({
			gender: payload.gender || {
				$in: ['male', 'female', 'transgender'],
			},
			models: payload.model,
			specialties: { $in: payload.themes },
		});
	}
	if (matchedPsychologists.length == 0) {
		let newMatchedPsychologists = [];
		if (payload.gender == 'transgender') {
			newMatchedPsychologists = await Psychologist.find({
				isTrans: true,
				specialties: { $in: payload.themes },
			});
		} else {
			newMatchedPsychologists = await Psychologist.find({
				gender: payload.gender || {
					$in: ['male', 'female', 'transgender'],
				},
				specialties: { $in: payload.themes },
			});
		}

		return okResponse('Psicologos encontrados', {
			matchedPsychologists: newMatchedPsychologists,
			perfectMatch: false,
		});
	} else {
		return okResponse('psicologos encontrados', {
			matchedPsychologists,
			perfectMatch: true,
		});
	}
};

/**
 *
 * @param {String} payload.paymentPeriod - Indica el tiempo de la suscripcion
 * @param {String} payload.title - Nombre del plan
 * @param {Number} payload.price - Precio del plan
 * @param {String} payload.coupon - Cupon usado, caso contrario es ''
 * @param {ObjectId} payload.user - Id del user
 * @param {ObjectId} payload.psychologist - Id del psicologo
 * @returns
 */
const createPlan = async body => {
	const { payload } = body;

	let sessionQuantity = 0;
	let expirationDate = '';
	if (payload.paymentPeriod == 'Pago semanal') {
		sessionQuantity = 1;
		expirationDate = moment()
			.add({ weeks: 1 })
			.toISOString();
	}
	if (payload.paymentPeriod == 'Pago mensual') {
		sessionQuantity = 4;
		expirationDate = moment()
			.add({ months: 1 })
			.toISOString();
	}
	if (payload.paymentPeriod == 'Pago cada tres meses') {
		sessionQuantity = 12;
		expirationDate = moment()
			.add({ months: 3 })
			.toISOString();
	}
	const newPlan = {
		title: payload.title,
		period: payload.paymentPeriod,
		totalPrice: payload.price,
		sessionPrice: payload.price / sessionQuantity,
		expiration: expirationDate,
		usedCoupon: payload.coupon,
		totalSessions: sessionQuantity,
		remainingSessions: sessionQuantity,
	};

	if (
		await Sessions.exists({
			user: payload.user,
			psychologist: payload.psychologist,
		})
	) {
		const created = await Sessions.findOneAndUpdate(
			{ user: payload.user, psychologist: payload.psychologist },
			{ $push: { plan: newPlan } }
		);

		return okResponse('Plan creado', { plan: created });
	} else {
		const created = await Sessions.create({
			user: payload.user,
			psychologsit: payload.psychologist,
			plan: [newPlan],
			session: [],
		});

		chat.startConversation(payload.psychologist, payload.user);
		return okResponse('Plan creado', { plan: created });
	}
};

/**
 * @description Crea una sesion nueva.
 * @param {ObjectId} payload.user - Id del usuario
 * @param {ObjectId} payload.psychologist - Id del psicologo
 * @param {String} payload.date - Fecha de la sesion (solamente el dia)
 * @param {String} payload.start - Hora de inicio
 * @returns El Id de la sesion recien creada
 */
const createSession = async body => {
	const { payload } = body;
	let foundSession = await Sessions.findOne({
		user: payload.user,
		psychologist: payload.psychologist,
	});

	if (foundSession.plan.slice(-1)[0].remainingSessions == 0)
		return conflictResponse('No te quedan sesiones por agendar');

	// Se resta una sesion
	foundSession.plan[foundSession.plan.length - 1].remainingSessions -= 1;

	// Se formatea la fecha de forma correcta
	const date = payload.date;
	const start = payload.start;
	const parsedDate = date.split('/');
	// Tiene que cambiarse la zona horaria cuando haya cambio de horario en Chile
	const isoDate = `${parsedDate[2]}-${parsedDate[1]}-${parsedDate[0]}T${start}:00-03:00`;

	const newSession = {
		date: isoDate,
		sessionNumber: `${foundSession.totalSessions -
			foundSession.remainingSessions} / ${foundSession.totalSessions}`,
		paidToPsychologist: false,
	};
	foundSession.session.push(newSession);
	foundSession.save();

	// Revisar la fecha no deberia ser necesario si el frontend esta bien hecho.
	// En caso de querer usar esta funcionalidad, hay que adaptarla al nuevo modelo.

	// const foundPsychologist = await Psychologist.findById(
	// 	payload.psychologist._id
	// );
	// if (
	// 	moment().isAfter(
	// 		moment(isoDate).subtract({
	// 			hours: foundPsychologist.preferences.minimumNewSession,
	// 		})
	// 	)
	// ) {
	// 	return conflictResponse(
	// 		`La hora tiene que ser tomada con ${foundPsychologist.preferences.minimumNewSession} horas de anticipacion`
	// 	);
	// }

	// let dateConflict = false;
	// foundPsychologist.sessions.forEach(session => {
	// 	if (moment(session.date).isSame(payload.date)) {
	// 		dateConflict = true;
	// 	}
	// });
	// if (dateConflict) return conflictResponse('Esta hora ya esta ocupada');

	logInfo('creo una nueva cita');

	return okResponse('sesion creada', {
		id: foundSession.session[foundSession.session.length - 1]._id,
	});
};

const register = async body => {
	if (await User.exists({ email: body.email })) {
		return conflictResponse('Correo electronico en uso');
	}

	if (await Psychologist.exists({ username: body.username })) {
		return conflictResponse('Este nombre de usuario ya esta ocupado');
	}

	const psychologist = await Psychologist.create(body);
	const newUser = {
		name: body.name,
		rut: body.rut,
		role: 'psychologist',
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		psychologist: psychologist._id,
	};

	User.create(newUser);

	return okResponse('psicologo creado');
};

/**
 * Necesita pruebas!
 * @param {ObjectId} psyId - Id del Psicologo
 * @param {String} date - La fecha donde se agendara (en formato ISO)
 * @returns Si esta disponible (true) o no (false)
 */
const checkAvailability = async (psyId, date) => {
	const sessions = Sessions.find({ psychologist: psyId });
	const psychologist = Psychologist.findById(psyId);

	if (
		moment(newDate)
			.isBefore(moment())
			.add(psychologist.preferences.minimumRescheduleSession, 'hours')
	) {
		return false;
	}

	const formatted = sessions.map(e => e.sessions).flat();

	const found = formatted.find(el => el == date);
	return found ? false : true;
};

const reschedule = async (user, id, newDate) => {
	newDate = moment(
		`${newDate.date} ${newDate.hour}`,
		`DD/MM/YYYY HH:mm`
	).toISOString();

	const availability = checkAvailability(user.psychologist, newDate);
	if (!availability)
		return conflictResponse('El psicologo no esta disponible');

	const session = await Sessions.findOne({
		user: user._id,
		psychologist: user.psychologist,
	});
	let foundSession = session.session.find(el => el._id.toString() == id);
	foundSession.date = newDate;
	await session.save();

	// No se como funciona setSession
	return okResponse('Hora actualizada', {
		sessions: setSession(user, savePsychologist),
	});
};

const updatePlan = async (psychologistId, planInfo) => {
	/* planInfo: {
		name: String,
		price: Number,
		hablaquiFee: Number,
		paymentFee: Number,
	}*/
	const updatedPsychologist = await Psychologist.findByIdAndUpdate(
		psychologistId,
		{
			plan: { status: 'success', ...planInfo },
		},
		{ new: true }
	);
	return okResponse('Plan creado', { psychologist: updatedPsychologist });
};

const getByData = async username => {
	const usernameSearch = await Psychologist.findOne({ username });
	if (!usernameSearch) {
		const idSearch = await Psychologist.findOne({ _id: username });
		return okResponse('Psicologo encontrado', {
			psychologist: idSearch,
		});
	}
	return okResponse('Psicologo encontrado', { psychologist: usernameSearch });
};

const setSchedule = async (user, payload) => {
	let foundPsychologist = await Psychologist.findByIdAndUpdate(
		user.psychologist,
		{
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
		{ new: true }
	);

	return okResponse('Horario actualizado', {
		psychologist: foundPsychologist,
	});
};

const cancelSession = async (user, sessionId) => {
	let sessions = await Sessions.findOne({
		user: user._id,
		psychologist: user.psychologist,
	});
	sessions.session = sessions.session.filter(
		el => el._id.toString() != sessionId
	);
	await sessions.save();

	return okResponse('Sesion cancelada', { sessions });
};

const updatePaymentMethod = async (user, payload) => {
	if (user.role !== 'psychologist')
		return conflictResponse('No eres un psicologo.');

	let foundPsychologist = await Psychologist.findById(user.psychologist);
	const newPaymentMethod = {
		bank: payload.bank || foundPsychologist.paymentMethod.bank,
		accountType:
			payload.accountType || foundPsychologist.paymentMethod.accountType,
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
};

const updatePsychologist = async (user, profile) => {
	if (user.role == 'user') return conflictResponse('No tienes poder.');
	const updated = await Psychologist.findByIdAndUpdate(profile._id, profile, {
		new: true,
		runValidators: true,
		context: 'query',
	});

	const data = {
		user: user._id,
		psychologistId: updated._id,
		username: updated.username,
	};

	pusher.trigger('psychologist', 'update', data, pusherCallback);

	logInfo(user.email, 'actualizo su perfil de psicologo');
	return okResponse('Actualizado exitosamente', { psychologist: updated });
};

const deleteOne = async (user, id) => {
	if (user.role !== 'superuser')
		return conflictResponse(
			'No tienes permisos suficientes para realizar esta acción'
		);

	await Psychologist.deleteOne({ _id: id });
	const psychologists = await Psychologist.find();
	return okResponse('Psicologo eliminado', { psychologists });
};

const setPrice = async (user, newPrice) => {
	newPrice = Number(newPrice);
	if (user.role != 'psychologist')
		return conflictResponse('No tienes permisos');
	let updatedPsychologist = await Psychologist.findByIdAndUpdate(
		user.psychologist,
		{
			sessionPrices: {
				text: newPrice * 0.75,
				video: newPrice,
				full: newPrice * 1.25,
			},
		},
		{ new: true }
	);
	return okResponse('Precios actualizados', {
		psychologist: updatedPsychologist,
	});
};

const addRating = async (user, newRating, comment, psychologist) => {
	if (user.psychologist != psychologist)
		return conflictResponse('Este no es tu psicologo');

	const rating = {
		author: user._id,
		comment,
		stars: newRating,
	};

	const updatedPsychologist = await Psychologist.findByIdAndUpdate(
		psychologist,
		{ $push: { ratings: rating } },
		{ new: true }
	);

	return okResponse('Rating actualizado', {
		psychologist: updatedPsychologist,
	});
};
const getRating = async psychologist => {
	const foundPsychologist = await Psychologist.findById(psychologist);
	if (!foundPsychologist.ratings || foundPsychologist.ratings.length == 0)
		return okResponse('El psicologo no tiene evaluaciones aun.');

	let total = 0;
	for (let i = 0; i < foundPsychologist.ratings.length; i++) {
		total += foundPsychologist.ratings[i].stars;
	}

	return okResponse('Rating conseguido', {
		rating: total / foundPsychologist.ratings.length,
	});
};

const checkPlanTask = async () => {
	let allUsers = await User.find();
	let planUsers = allUsers.filter(user => user.plan.length > 0);
	planUsers.forEach(async userWithPlan => {
		let foundUser = await User.findById(userWithPlan._id);
		foundUser.plan.forEach(plan => {
			if (moment().isAfter(plan.expiration)) {
				plan.stauts = 'expired';
			}
		});
		foundUser.save();
	});

	return okResponse('ok');
};

const getClients = async psychologist => {
	const foundUsers = await User.find({ psychologist });
	const mappedUsers = foundUsers
		.map(user => {
			return {
				role: user.role,
				name: user.name,
				lastName: user.lastName,
				avatar: user.avatar,
				_id: user._id,
			};
		})
		.filter(user => user.role != 'psychologist');
	return okResponse('Usuarios encontrados', { users: mappedUsers });
};

const usernameAvailable = async username => {
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

const paymentsInfo = async user => {
	if (user.role != 'psychologist')
		return conflictResponse('No eres psicologo');

	const allSessions = Sessions.find({
		psychologist: user.psychologist,
	}).populate('User');
	const response = allSessions.map(data => {
		const plan = data.plan[data.plan.length - 1];
		return data.session.map(session => {
			return {
				...session,
				sessionPrice: plan.sessionPrice,
				invitedByPsychologist: plan.invitedByPsychologist,
				client: `${data.user.name} ${data.user.lastName}`,
			};
		});
	});

	return okResponse('', response);
};

const psychologistsService = {
	getAll,
	getSessions,
	match,
	register,
	createPlan,
	createSession,
	reschedule,
	getByData,
	setSchedule,
	updatePlan,
	cancelSession,
	updatePaymentMethod,
	updatePsychologist,
	deleteOne,
	setPrice,
	addRating,
	getRating,
	checkPlanTask,
	getClients,
	getFormattedSessions,
	usernameAvailable,
	updateFormationExperience,
	paymentsInfo,
};

export default Object.freeze(psychologistsService);
