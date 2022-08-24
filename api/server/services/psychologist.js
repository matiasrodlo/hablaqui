'use strict';

import { logInfo } from '../config/pino';
import Psychologist from '../models/psychologist';
import Recruitment from '../models/recruitment';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import mailService from './mail';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import moment from 'moment';
import Sessions from '../models/sessions';
import {
	bucket,
	getPublicUrlAvatar,
	getPublicUrlAvatarThumb,
} from '../config/bucket';
import Transaction from '../models/transaction';
var Analytics = require('analytics-node');
var analytics = new Analytics(process.env.SEGMENT_API_KEY);
moment.tz.setDefault('America/Santiago');

const getAll = async () => {
	let psychologists = await Psychologist.find();
	logInfo('obtuvo todos los psicologos');
	return okResponse('psicologos obtenidos', { psychologists });
};

const getAllPagination = async page => {
	const count = await Psychologist.countDocuments();

	const pageOptions = {
		totalPages: Math.ceil(count / 10),
		page: page ? parseInt(page) : 0,
		limit: 10,
	};

	if (page > pageOptions.totalPages)
		return okResponse('ultima pagina obtenida');

	const psychologists = await Psychologist.find()
		.skip(pageOptions.page * pageOptions.limit)
		.limit(pageOptions.limit);
	logInfo('obtuvo la pagina psicologos');

	return okResponse('psicologos obtenidos', {
		psychologists,
		page: pageOptions,
	});
};

const completePaymentsRequest = async psy => {
	let sessions = await getAllSessionsFunction(psy);
	const user = await Psychologist.findById(psy);
	const now = moment().format();

	const transactions = await Transaction.findOne({ psychologist: psy });
	if (!transactions) {
		await Transaction.create({
			psychologist: psy,
			transactionsRequest: [],
			transactionCompleted: [],
		});
	}

	/*Filtra las sesiones obtenidas en base a un plan que haya sido pagado por el consultante 
	y que este en un estado pending, respecto a la solicitud de retiro que haya pedido el psicólogo*/
	sessions = sessions.filter(
		session =>
			session.status === 'success' &&
			session.statusPlan === 'success' &&
			session.request === 'pending'
	);
	sessions.forEach(async session => {
		await Sessions.findOneAndUpdate(
			{
				_id: session.sessionsId,
				'plan._id': session.idPlan,
				'plan.session._id': session._id,
			},
			{
				$set: {
					'plan.$.session.$[session].request': 'paid',
					'plan.$.session.$[session].paymentDate': now,
					'plan.$.session.$[session].paidToPsychologist': true,
				},
			},
			{ arrayFilters: [{ 'session._id': session._id }], new: true }
		);
	});

	const total = sessions.reduce(
		(sum, value) =>
			typeof value.total == 'number' ? sum + value.total : sum,
		0
	);

	const transaction = {
		total,
		sessionsPaid: sessions.length,
		transactionDate: now,
	};
	await Transaction.findOneAndUpdate(
		{ psychologist: psy },
		{ $push: { transactionCompleted: transaction } }
	);

	//Enviar correo de dinero depositado a psy
	await mailService.sendCompletePaymentRequest(user, total, now);

	return okResponse('Peticion completada', {
		total: total,
		sessions: sessions,
	});
};

const createPaymentsRequest = async user => {
	if (user.role === 'user')
		return conflictResponse('No estas autorizado para esta operacion');
	const psy = user.psychologist;
	let sessions = await getAllSessionsFunction(psy);
	const now = moment().format();

	const transactions = await Transaction.findOne({ psychologist: psy });
	if (!transactions) {
		await Transaction.create({
			psychologist: psy,
			transactionsRequest: [],
			transactionCompleted: [],
		});
	}
	/*Filtra las sesiones obtenidas en base a un plan que haya sido pagado por el consultante,
	que este en un estado none (implicando que la solicitud de retiro por parte de un psicólogo no se ha hecho)
	y que la sesión no sea un Compromiso privado*/
	sessions = sessions.filter(
		session =>
			session.status === 'success' &&
			session.statusPlan === 'success' &&
			session.request === 'none' &&
			session.name !== 'Compromiso privado '
	);

	const total = sessions.reduce(
		(sum, value) =>
			typeof value.total == 'number' ? sum + value.total : sum,
		0
	);

	if (total === 0)
		return conflictResponse(
			'No puedes hacer una petición con saldo 0 disponible'
		);

	sessions.forEach(async session => {
		await Sessions.findOneAndUpdate(
			{
				_id: session.sessionsId,
				'plan._id': session.idPlan,
				'plan.session._id': session._id,
			},
			{
				$set: {
					'plan.$.session.$[session].request': 'pending',
					'plan.$.session.$[session].requestDate': now,
				},
			},
			{ arrayFilters: [{ 'session._id': session._id }], new: true }
		);
	});

	const transaction = {
		total,
		sessionsPaid: sessions.length,
		transactionDate: now,
	};
	await Transaction.findOneAndUpdate(
		{ psychologist: psy },
		{ $push: { transactionsRequest: transaction } }
	);

	if (
		process.env.API_URL.includes('hablaqui.cl') ||
		process.env.DEBUG_ANALYTICS === 'true'
	) {
		analytics.track({
			userId: user._id.toString(),
			event: 'psy-withdrawal-request',
			properties: {
				total: total,
				sessions: sessions.length,
			},
		});
	}
	//Crear correo de petición de retiro de dinero
	await mailService.sendPaymentRequest(user, total, now);

	return okResponse('Peticion hecha', {
		total: total,
		sessions: sessions,
	});
};

const getAllSessionsFunction = async psy => {
	let sessions = await Sessions.find({
		psychologist: psy,
	}).populate('psychologist user');

	sessions = sessions.flatMap(item => {
		let name = '';
		let lastName = '';

		// Establece nombre de quien pertenece cada sesion
		if (item.user && item.user._id) {
			name = item.user.name;
			lastName = item.user.lastName ? item.user.lastName : '';
		} else {
			name = 'Compromiso privado';
			lastName = '';
		}
		return item.plan.flatMap(plan => {
			return plan.session.map(session => {
				const expiration =
					plan.payment === 'pending' &&
					moment().isAfter(moment(plan.expiration));
				let requestDate = session.requestDate
					? session.requestDate
					: 'Por cobrar';
				if (requestDate !== 'Por cobrar')
					requestDate = moment(requestDate).format(
						'YYYY/MM/DD HH:mm'
					);
				let paymentDate = session.requestDate
					? session.requestDate
					: 'Por cobrar';
				if (paymentDate !== 'Por cobrar')
					paymentDate = moment(paymentDate).format(
						'YYYY/MM/DD HH:mm'
					);
				return {
					_id: session._id,
					date: session.date,
					sessionPrice: plan.sessionPrice,
					idPsychologist: item.psychologist._id,
					name: `${name} ${lastName}`,
					paidToPsychologist: session.paidToPsychologist,
					sessionsNumber: `${session.sessionNumber}/${plan.totalSessions}`,
					sessionsId: item._id,
					status: session.status,
					statusPlan: plan.payment,
					suscription: plan.period,
					idPlan: plan._id,
					paymentPlanDate: moment(plan.datePayment).format(
						'YYYY/MM/DD HH:mm'
					),
					requestDate,
					paymentDate,
					request: session.request ? session.request : 'none',
					hablaquiPercentage: 0,
					mercadoPercentage: plan.sessionPrice * 0.0351,
					total: +(plan.sessionPrice * (1 - 0.0351)).toFixed(),
					percentage: '3.51%',
					expiration,
				};
			});
		});
	});
	sessions = sessions.filter(session => !session.expiration);
	return sessions;
};

const getTransactions = async user => {
	if (user.role === 'user')
		return conflictResponse('No estas autorizado para esta operacion');
	const psy = user.psychologist;

	let sessions = await getAllSessionsFunction(psy);
	let transactions = await Transaction.findOne({ psychologist: psy });

	if (transactions) transactions = transactions.transactionsRequest;
	else transactions = [];

	sessions = sessions.filter(
		session =>
			session.status === 'success' &&
			session.statusPlan === 'success' &&
			session.name !== 'Compromiso privado '
	);
	const total = sessions
		.filter(session => {
			return (
				session.status === 'success' &&
				session.statusPlan === 'success' &&
				session.name !== 'Compromiso privado '
			);
		})
		.reduce(
			(sum, value) =>
				typeof value.total == 'number' ? sum + value.total : sum,
			0
		);

	const totalAvailable = sessions
		.filter(
			session =>
				session.status === 'success' &&
				session.request === 'none' &&
				session.name !== 'Compromiso privado '
		)
		.reduce(
			(sum, value) =>
				typeof value.total == 'number' ? sum + value.total : sum,
			0
		);

	const sessionsReceivable = sessions.filter(
		session => session.request === 'none'
	).length;

	const successSessions = sessions.filter(
		session => session.status === 'success'
	).length;

	return okResponse('Transacciones devueltas', {
		transactions: {
			total: priceFormatter(total),
			totalAvailable: priceFormatter(totalAvailable),
			successSessions,
			sessionsReceivable,
			sessions,
			transactions,
		},
	});
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

const updatePlan = async (psychologistId, planInfo) => {
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
	let response;
	// Si el user es un psicologo
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
		let foundPsychologist;
		if (user.psychologist) {
			foundPsychologist = await Psychologist.findById(user.psychologist);
		} else {
			foundPsychologist = await Recruitment.findOne({
				email: user.email,
			});
		}
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
		try {
			const psy = await Psychologist.findById(profile._id);
			if (psy.sessionPrices.video !== profile.sessionPrices.video) {
				if (
					psy.stampSetPrices &&
					moment().isBefore(
						moment(psy.stampSetPrices).add(1, 'months')
					)
				)
					profile.sessionPrices = psy.sessionPrices;
				else profile.stampSetPrices = moment().format();
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
			const updated = await Recruitment.findByIdAndUpdate(
				profile._id,
				profile,
				{
					new: true,
				}
			);
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

	await Psychologist.deleteOne({ _id: id });
	const psychologists = await Psychologist.find();
	return okResponse('Psicologo eliminado', { psychologists });
};

const setPrice = async (user, newPrice) => {
	newPrice = Number(newPrice);
	if (user.role != 'psychologist')
		return conflictResponse('No tienes permisos');
	const psy = await Psychologist.findById(user.psychologist);

	if (
		psy.stampSetPrices &&
		moment().isBefore(moment(psy.stampSetPrices).add(1, 'months'))
	)
		return conflictResponse(
			'Tiene que esperar 1 mes para volver a cambiar el precio'
		);
	let updatedPsychologist = await Psychologist.findByIdAndUpdate(
		user.psychologist,
		{
			sessionPrices: {
				text: newPrice * 0.75,
				video: newPrice,
				full: newPrice * 1.25,
			},
			stampSetPrices: moment(),
		},
		{ new: true }
	);
	return okResponse('Precios actualizados', {
		psychologist: updatedPsychologist,
	});
};

const getClients = async psychologist => {
	const sessions = await Sessions.find({
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
						moment().isBefore(moment(plan.expiration))
				),
				role: item.user.role,
				roomsUrl: item.roomsUrl,
				rut: item.user.rut,
				sessionsId: item._id,
			})),
	});
};

const getLastSession = item => {
	return item.plan
		.flatMap(plan =>
			plan.session.map(session =>
				moment(session.date, 'MM/DD/YYYY HH:mm').format('DD/MM/YYYY')
			)
		)
		.sort((a, b) => new Date(b) - new Date(a))
		.find(sessionDate =>
			moment(sessionDate, 'DD/MM/YYYY').isSameOrBefore(moment())
		);
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
	const { name, lastName, _id } = await User.findById(psyID);
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
		avatar: getPublicUrlAvatar(gcsname),
		avatarThumbnail: getPublicUrlAvatarThumb(gcsname),
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

const changeToInmediateAttention = async psy => {
	/*if (user.role !== 'psychologist')
		return conflictResponse('No tienes permitida esta opción');
	const psy = user.psychologist;*/
	let psychologist = await Psychologist.findById(psy);
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
		let sessions = await getAllSessionsFunction(psy);
		let now = new Date();
		sessions = sessions.filter(session => {
			const date = moment(session.date).format('DD/MM/YYYY HH:mm');
			return (
				session.status !== 'success' &&
				moment(date).isBefore(moment(now).add(3, 'hours')) &&
				moment(date)
					.add(50, 'minutes')
					.isAfter(moment(now))
			);
		});

		if (sessions.length !== 0)
			return conflictResponse('Tiene sesiones próximas');

		psychologist = await Psychologist.findOneAndUpdate(
			{ _id: psy },
			{
				$set: {
					inmediateAttention: {
						activated: true,
						expiration: moment(now)
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
					const date = moment(session.date).format(
						'DD/MM/YYYY HH:mm'
					);
					return (
						session.status !== 'success' &&
						moment(date).isBefore(moment(now).add(3, 'hours')) &&
						moment(date)
							.add(50, 'minutes')
							.isAfter(moment(now))
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

const priceFormatter = price => {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
	});

	return formatter.format(price);
};

const psychologistsService = {
	approveAvatar,
	deleteOne,
	getAll,
	getAllPagination,
	getByData,
	getClients,
	match,
	register,
	searchClients,
	setPrice,
	setSchedule,
	updateFormationExperience,
	updatePaymentMethod,
	updatePlan,
	updatePsychologist,
	uploadProfilePicture,
	usernameAvailable,
	createPaymentsRequest,
	completePaymentsRequest,
	getTransactions,
	changeToInmediateAttention,
};
export default Object.freeze(psychologistsService);
