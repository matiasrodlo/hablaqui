'use strict';

import { logInfo } from '../config/pino';
import { room } from '../config/dotenv';
import Psychologist from '../models/psychologist';
import User from '../models/user';
import bcrypt from 'bcrypt';
import chat from './chat';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import moment from 'moment';
import pusher from '../config/pusher';
import { pusherCallback } from '../utils/functions/pusherCallback';
import Sessions from '../models/sessions';
import {
	bucket,
	getPublicUrlAvatar,
	getPublicUrlAvatarThumb,
} from '../config/bucket';

const getAll = async () => {
	const psychologists = await Psychologist.find();
	logInfo('obtuvo todos los psicologos');
	return okResponse('psicologos obtenidos', { psychologists });
};

const getSessions = async (userLogged, idUser, idPsy) => {
	let sessions = await Sessions.find({
		psychologist: idPsy,
		user: idUser,
	}).populate('psychologist user');
	sessions = sessions.filter(item =>
		item.plan.some(plan => {
			return (
				plan.payment === 'success' &&
				moment().isBefore(moment(plan.expiration))
			);
		})
	);
	const mappedSessions = setSession(userLogged.role, sessions);

	logInfo('obtuvo todos las sesiones');
	return okResponse('sesiones obtenidas', { sessions: mappedSessions });
};

// Utilizado en mi agenda, para llenar el calendario de sesiones user o psicologo
const setSession = (role, sessions) => {
	return sessions
		.flatMap(item => {
			let name = '';
			let lastName = '';

			// Establece nombre de quien pertenece cada sesion
			if (role === 'psychologist') {
				if (item.user) {
					name = item.user.name;
					lastName = item.user.lastName ? item.user.lastName : '';
				}
			} else if (role === 'user') {
				name = item.psychologist.name;
				lastName = item.psychologist.lastName
					? item.psychologist.lastName
					: '';
			}

			return item.session.map(session => {
				const start = moment(session.date, 'YYYY-DD-MM').format(
					'YYYY-MM-DD hh:mm'
				);
				const end = moment(session.date, 'YYYY-DD-MM')
					.add(60, 'minutes')
					.format('YYYY-MM-DD hh:mm');
				return {
					name: `${name} ${lastName}`,
					details: `Sesion con ${name}`,
					start,
					end,
					sessionId: item._id,
					idUser: item.user._id,
					idPsychologist: item.psychologist._id,
					url: item.roomsUrl,
				};
			});
		})
		.filter(
			el => !isNaN(Date.parse(el.start)) && !isNaN(Date.parse(el.end))
		);
};

// Utilizado en modal agenda cita online
const getFormattedSessions = async idPsychologist => {
	let sessions = [];
	// obtenemos el psicologo
	const psychologist = await Psychologist.findById(idPsychologist);
	// creamos un array con la cantidad de dias
	const length = Array.from(Array(31), (_, x) => x);
	// creamos un array con la cantidad de horas
	const hours = Array.from(Array(24), (_, x) =>
		moment()
			.hour(x)
			.minute(0)
			.format('HH:mm')
	);
	// Obtenemos sessiones del psicologo
	let psySessions = await Sessions.find({
		psychologist: idPsychologist,
	});
	const daySessions = psySessions.flatMap(item => {
		return item.session.length
			? item.session.map(session => session.date)
			: [];
	});

	console.log(daySessions);

	sessions = length.map(el => {
		const day = moment().add(el, 'days');

		return {
			id: el,
			value: day,
			day: day.format('DD MMM'),
			date: day.format('L'),
			available: hours.filter(hour => {
				return (
					formattedSchedule(psychologist.schedule, day, hour) &&
					!daySessions.some(
						date =>
							moment(date, 'MM/DD/YYYY HH:mm').format('L') ===
								moment(day).format('L') &&
							hour ===
								moment(date, 'MM/DD/YYYY HH:mm').format('HH:mm')
					)
				);
			}),
		};
	});

	return okResponse('sesiones obtenidas', { sessions });
};

const formattedSchedule = (schedule, day, hour) => {
	let validHour = false;
	const week = [
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
		'sunday',
	];
	day = moment(day).format('dddd');
	week.forEach(weekDay => {
		if (day.toLowerCase() === weekDay)
			if (Array.isArray(schedule[weekDay]))
				validHour = schedule[weekDay].some(interval =>
					moment(hour, 'HH:mm').isBetween(
						moment(interval[0], 'HH:mm'),
						moment(interval[1], 'HH:mm'),
						undefined,
						[]
					)
				);
			else if (schedule[weekDay] === 'busy') validHour = false;
	});

	return validHour;
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
const createPlan = async ({ payload }) => {
	console.log(payload);
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
		remainingSessions: sessionQuantity - 1,
	};
	// valido MM/DD/YYYY HH:mm
	const date = `${payload.date} ${payload.start}`;

	const newSession = {
		date,
		sessionNumber: 1,
		paidToPsychologist: false,
	};

	if (
		await Sessions.exists({
			user: payload.user,
			psychologist: payload.psychologist,
		})
	) {
		const created = await Sessions.findOneAndUpdate(
			{ user: payload.user, psychologist: payload.psychologist },
			{ $push: { plan: newPlan, session: newSession } }
		);

		return okResponse('Plan creado', { plan: created });
	} else {
		const randomToken1 = (Math.random() + 1).toString(36).substring(2);
		const randomToken2 = (Math.random() + 1).toString(36).substring(2);
		const created = await Sessions.create({
			user: payload.user,
			psychologist: payload.psychologist,
			plan: [newPlan],
			session: [newSession],
			roomsUrl: `${room}room/${randomToken1}-${randomToken2}`,
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
const createSession = async ({ payload }) => {
	// Obtenemos la session correspondiente
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
	await foundSession.save();

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
		moment(date)
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
		return okResponse('Psicólogo encontrado', {
			psychologist: idSearch,
		});
	}
	return okResponse('Psicólogo encontrado', { psychologist: usernameSearch });
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
				email: user.email,
				_id: user._id,
			};
		})
		.filter(user => user.role != 'psychologist');
	return okResponse('Usuarios encontrados', { users: mappedUsers });
};

const searchClients = async search => {
	const foundUser = await User.find({ email: search, name: search });
	if (!foundUser) {
		return okResponse('No se encontró al usuario', { users: [] });
	}
	return okResponse('Usuario encontrado', { users: foundUser });
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

const uploadProfilePicture = async (psyID, picture) => {
	if (!picture) return conflictResponse('No se ha enviado ninguna imagen');
	const { name, lastName } = await User.findById(psyID);
	const gcsname = `${psyID}-${name}-${lastName}`;
	const file = bucket.file(gcsname);
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
	stream.end(picture.buffer);

	await Psychologist.findByIdAndUpdate(psyID, {
		avatar: getPublicUrlAvatar(gcsname),
		avatarThumbnail: getPublicUrlAvatarThumb(gcsname),
	});

	return okResponse('Imagen subida', {
		avatar: getPublicUrlAvatar(gcsname),
		avatarThumbnail: getPublicUrlAvatarThumb(gcsname),
	});
};

const customNewSession = async (user, payload) => {
	if (user.role != 'psychologist')
		return conflictResponse('No eres psicologo');

	const newSession = {
		typeSession: payload.type,
		date: moment(payload.date).toISOString,
		user: payload.type == 'commitment' ? '' : payload.user,
		invitedByPsychologist: true,
		price: payload.price,
	};

	let updatedPsychologist = Psychologist.findByIdAndUpdate(
		user.psychologist,
		{
			$push: {
				sessions: newSession,
			},
		},
		{ new: true }
	);

	return okResponse('sesion creada', {
		session: newSession,
		psychologist: updatedPsychologist,
	});
};

const approveAvatar = async (user, id) => {
	if (user.role !== 'superuser')
		return conflictResponse(
			'No tienes permisos suficientes para realizar esta acción'
		);

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
	addRating,
	approveAvatar,
	cancelSession,
	checkPlanTask,
	createPlan,
	createSession,
	customNewSession,
	deleteOne,
	getAll,
	getByData,
	getClients,
	getFormattedSessions,
	getRating,
	getSessions,
	match,
	paymentsInfo,
	register,
	reschedule,
	searchClients,
	setPrice,
	setSchedule,
	updateFormationExperience,
	updatePaymentMethod,
	updatePlan,
	updatePsychologist,
	uploadProfilePicture,
	usernameAvailable,
};

export default Object.freeze(psychologistsService);
