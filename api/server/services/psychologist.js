'use strict';

import { logInfo } from '../config/pino';
import Psychologist from '../models/psychologist';
import User from '../models/user';
import bcrypt from 'bcrypt';
import chat from './chat';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import moment from 'moment';
import pusher from '../config/pusher';
import { pusherCallback } from '../utils/functions/pusherCallback';
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

const getSessions = async (user, idPsy) => {
	const psychologist = await Psychologist.findById(idPsy).populate({
		path: 'sessions.user',
		model: 'User',
		select: 'name lastName _id',
	});

	const sessions = setSession(user, psychologist);

	logInfo('obtuvo todos las sesiones');
	return okResponse('sesiones obtenidas', { sessions });
};

const setSession = (user, psychologist) => {
	let sessions = [];

	if (user.role === 'user')
		sessions = psychologist.sessions.filter(session => {
			return (
				session.user &&
				!Array.isArray(session.user) &&
				session.user._id.toString() === user._id.toString()
			);
		});

	if (user.role === 'psychologist')
		sessions = sessions = psychologist.sessions;

	sessions = sessions
		.map(item => {
			let name = '';
			let lastName = '';
			let idUser = '';
			if (user.role === 'psychologist') {
				if (item.user && !Array.isArray(item.user)) {
					name = item.user.name;
					lastName = item.user.lastName ? item.user.lastName : '';
					idUser = item.user._id;
				}
			}

			if (user.role === 'user') {
				idUser = user._id;
				name = psychologist.name;
				lastName = psychologist.lastName;
			}

			const start = moment(item.date).format('YYYY-MM-DD hh:mm');
			const end = moment(item.date)
				.add(60, 'minutes')
				.format('YYYY-MM-DD hh:mm');
			return {
				name: `${name} ${lastName}`,
				details: `Sesion con ${name}`,
				start,
				end,
				sessionId: item._id,
				idUser,
				idPsychologist: psychologist._id,
			};
		})
		.filter(el => el.start !== 'Invalid date' && el.end !== 'Invalid date');
	return sessions;
};

const getFormattedSessions = async idPsychologist => {
	let sessions = [];
	const psychologist = await Psychologist.findById(idPsychologist);
	const length = Array.from(Array(31), (_, x) => x);
	const hours = Array.from(Array(24), (_, x) =>
		moment()
			.hour(x)
			.minute(0)
			.format('HH:mm')
	);

	const daySessions = psychologist.sessions.map(session =>
		moment(session.date).format('YYYY-MM-DD HH:mm')
	);

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
					moment(daySessions).isValid &&
					!daySessions.some(
						date =>
							moment(date).format('L') ===
								moment(day).format('L') &&
							hour === moment(date).format('HH:mm')
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

const createSession = async body => {
	const { payload } = body;

	const date = payload.date;
	const start = payload.start;

	const parsedDate = date.split('/');
	// Tiene que cambiarse la zona horaria cuando haya cambio de horario en Chile
	const isoDate = `${parsedDate[2]}-${parsedDate[1]}-${parsedDate[0]}T${start}:00-03:00`;

	let sessionQuantity = 0;
	if (payload.paymentPeriod == 'Pago semanal') sessionQuantity = 1;
	if (payload.paymentPeriod == 'Pago mensual') sessionQuantity = 4;
	if (payload.paymentPeriod == 'Pago cada tres meses') sessionQuantity = 12;

	const sessions = {
		date: isoDate,
		user: payload.user._id,
		plan: payload.title,
		statePayments: 'pending',
		price: payload.price / sessionQuantity,
		invitedByPsychologist:
			payload.psychologist.username == payload.user.inviteCode,
	};

	// Check if available
	const foundPsychologist = await Psychologist.findById(
		payload.psychologist._id
	);
	if (
		moment().isAfter(
			moment(isoDate).subtract({
				hours: foundPsychologist.preferences.minimumNewSession,
			})
		)
	) {
		return conflictResponse(
			`La hora tiene que ser tomada con ${foundPsychologist.preferences.minimumNewSession} horas de anticipacion`
		);
	}

	let dateConflict = false;
	foundPsychologist.sessions.forEach(session => {
		if (moment(session.date).isSame(payload.date)) {
			dateConflict = true;
		}
	});
	if (dateConflict) return conflictResponse('Esta hora ya esta ocupada');

	// Save session
	const savedSession = await Psychologist.findOneAndUpdate(
		{ _id: payload.psychologist._id },
		{
			$push: { sessions },
		},
		{ upsert: true, returnOriginal: false }
	);

	let expirationDate = '';
	if (payload.paymentPeriod == 'Pago semanal')
		expirationDate = moment()
			.add({ weeks: 1 })
			.toISOString();
	if (payload.paymentPeriod == 'Pago mensual')
		expirationDate = moment()
			.add({ weeks: 4 })
			.toISOString();
	if (payload.paymentPeriod == 'Pago cada tres meses')
		expirationDate = moment()
			.add({ months: 3 })
			.toISOString();

	await User.findOneAndUpdate(
		{ _id: payload.user._id },
		{
			$push: {
				plan: {
					fullInfo: payload.fullInfo,
					title: payload.title,
					period: payload.paymentPeriod,
					price: payload.price,
					sessionPrice: payload.price / sessionQuantity,
					psychologist: payload.psychologist._id,
					expiration: expirationDate,
					invitedByPsychologist:
						payload.psychologist.username ==
						payload.user.inviteCode,
					usedCoupon: payload.discountCoupon
						? payload.discountCoupon
						: 'not used',
				},
			},
			hasPaid: true,
		}
	);

	logInfo('creo una nueva cita');
	chat.startConversation(payload.psychologist._id, payload.user);

	return okResponse('sesion creada', {
		id: savedSession.sessions[savedSession.sessions.length - 1]._id,
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

const reschedule = async (user, id, newDate) => {
	let foundPsychologist = await Psychologist.findById(
		user.psychologist
	).populate({
		path: 'sessions.user',
		model: 'User',
		select: 'name lastName _id',
	});

	let e = false;
	let error = '';
	newDate = moment(
		`${newDate.date} ${newDate.hour}`,
		`DD/MM/YYYY HH:mm`
	).toISOString();
	foundPsychologist.sessions.forEach(session => {
		if (session._id == id) {
			if (
				foundPsychologist.sessions.filter(item => item.date == newDate)
					.length == 0
			) {
				if (
					moment(newDate).isAfter(
						moment().add(
							foundPsychologist.preferences
								.minimumRescheduleSession,
							'hours'
						)
					)
				) {
					session.date = newDate;
				} else {
					e = true;
					error = 'Esta hora esta muy encima';
				}
			} else {
				e = true;
				error = 'Esta hora ya esta ocupada';
			}
		}
	});
	if (!e) {
		const savePsychologist = await foundPsychologist.save();
		return okResponse('Hora actualizada', {
			sessions: setSession(user, savePsychologist),
		});
	}
	return conflictResponse(error);
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
	let foundPsychologist = await Psychologist.findById(user.psychologist);
	foundPsychologist.sessions = foundPsychologist.sessions.filter(
		item => item._id != sessionId
	);
	await foundPsychologist.save();

	return okResponse('Sesion cancelada', { psychologist: foundPsychologist });
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

const psychologistsService = {
	getAll,
	getSessions,
	searchClients,
	match,
	register,
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
	uploadProfilePicture,
};

export default Object.freeze(psychologistsService);
