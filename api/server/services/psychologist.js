'use strict';

import { logInfo } from '../config/pino';
import { room } from '../config/dotenv';
import Psychologist from '../models/psychologist';
import Recruitment from '../models/recruitment';
import User from '../models/user';
import bcrypt from 'bcrypt';
import mailService from './mail';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import moment from 'moment';
import pusher from '../config/pusher';
import { pusherCallback } from '../utils/functions/pusherCallback';
import Sessions from '../models/sessions';
import mercadopagoService from './mercadopago';
import Evaluation from '../models/evaluation';
import {
	bucket,
	getPublicUrlAvatar,
	getPublicUrlAvatarThumb,
} from '../config/bucket';
import Transaction from '../models/transaction';
var Analytics = require('analytics-node');
var analytics = new Analytics(process.env.SEGMENT_API_KEY);

const getAll = async () => {
	const psychologists = await Psychologist.find();
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

const getSessions = async (userLogged, idUser, idPsy) => {
	// iniciamos la variable
	let sessions;

	// buscamos la sesiones correspondiente a ese user y psicologo
	if (userLogged.role === 'user') {
		sessions = await Sessions.find({
			psychologist: idPsy,
			user: idUser,
		}).populate('psychologist user');
	}
	if (userLogged.role === 'psychologist') {
		sessions = await Sessions.find({
			psychologist: idPsy,
		}).populate('psychologist user');
	}

	// Para que nos de deje modificar el array de mongo
	sessions = JSON.stringify(sessions);
	sessions = JSON.parse(sessions);

	// comenzamos a modificar el array de sessiones con la estructura que necesita el frontend
	sessions = setSession(userLogged.role, sessions);

	logInfo('obtuvo todos las sesiones');
	// Print sessions in json format
	return okResponse('sesiones obtenidas', { sessions });
};

// Utilizado en mi agenda, para llenar el calendario de sesiones user o psicologo
const setSession = (role, sessions) => {
	return sessions.flatMap(item => {
		let name = '';
		let lastName = '';
		let idUser = item.user && item.user._id ? item.user._id : item._id;

		// Establece nombre de quien pertenece cada sesion
		if (role === 'psychologist') {
			if (item.user && item.user._id) {
				name = item.user.name;
				lastName = item.user.lastName ? item.user.lastName : '';
			} else {
				name = 'Compromiso privado';
				lastName = '';
			}
		} else if (role === 'user') {
			name = item.psychologist.name;
			lastName = item.psychologist.lastName
				? item.psychologist.lastName
				: '';
		}
		return item.plan.flatMap(plan => {
			if (plan.title === 'Mensajería y videollamada')
				plan.title = 'sesion online';
			else if (plan.title === 'Acompañamiento vía mensajería')
				plan.title = 'sesion online';
			else if (plan.title === 'Sesiones por videollamada')
				plan.title = 'sesion online';

			return plan.session.map(session => {
				const start = moment(session.date, 'MM/DD/YYYY HH:mm').format(
					'YYYY-MM-DD HH:mm'
				);
				const end = moment(session.date, 'MM/DD/YYYY HH:mm')
					.add(60, 'minutes')
					.format('YYYY-MM-DD HH:mm');

				return {
					_id: session._id,
					date: session.date,
					title: plan.title,
					details: `Sesion con ${name}`,
					totalPrice: plan.totalPrice,
					sessionPrice: plan.sessionPrice,
					end,
					idPsychologist: item.psychologist._id,
					idUser,
					name: `${name} ${lastName}`,
					paidToPsychologist: session.paidToPsychologist,
					sessionNumber: session.sessionNumber,
					sessionsId: item._id,
					start,
					status: session.status,
					statusPlan: plan.payment,
					idPlan: plan._id,
					url: item.roomsUrl,
				};
			});
		});
	});
};

const getRemainingSessions = async psy => {
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
			return {
				idPlan: plan._id,
				name: `${name} ${lastName}`,
				remaining: plan.remainingSessions,
				sessions: `${plan.remainingSessions} de ${plan.totalSessions}`,
				statusPlan: plan.payment,
			};
		});
	});

	return okResponse('Sesiones restantes obtenidas', {
		sessions: sessions.filter(session => {
			return session.remaining > 0;
		}),
	});
};

const completePaymentsRequest = async psy => {
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
		trasnactionDate: now,
	};
	await Transaction.findOneAndUpdate(
		{ psychologist: psy },
		{ $push: { transactionCompleted: transaction } }
	);

	return okResponse('Peticion hecha', {
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

	const total = sessions.reduce(
		(sum, value) =>
			typeof value.total == 'number' ? sum + value.total : sum,
		0
	);
	const transaction = {
		total,
		sessionsPaid: sessions.length,
		trasnactionDate: now,
	};
	await Transaction.findOneAndUpdate(
		{ psychologist: psy },
		{ $push: { transactionsRequest: transaction } }
	);

	return okResponse('Peticion hecha', {
		total: total,
		sessions: sessions,
	});
};

const getAllSessionsFunction = async psy => {
	let sessions = await Sessions.find({
		psychologist: psy,
	}).populate('psychologist user');

	let comission = 0;
	let percentage = '0%';

	let { psyPlans } = await Psychologist.findById(psy);
	let currentPlan = psyPlans[psyPlans.length - 1];

	if (!currentPlan) {
		currentPlan = {
			tier: 'free',
			paymentStatus: 'success',
			planStatus: 'active',
			expirationDate: '',
			subscriptionPeriod: '',
			price: 0,
			hablaquiFee: 0.2,
			paymentFee: 0.0399,
		};
	}

	if (currentPlan.tier === 'premium') {
		comission = currentPlan.paymentFee;
		percentage = '3.99%';
	} else {
		comission = currentPlan.hablaquiFee;
		percentage = '20%';
	}
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
			const realComission = plan.invitedByPsychologist
				? currentPlan.paymentFee
				: comission;
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
					invited: plan.invitedByPsychologist,
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
					hablaquiPercentage:
						realComission === 0.0399
							? plan.sessionPrice * 0
							: plan.sessionPrice * 0.1601,
					mercadoPercentage: plan.sessionPrice * 0.0399,
					total: plan.sessionPrice * (1 - realComission),
					percentage: realComission === 0.0399 ? '3.99%' : percentage,
					expiration,
				};
			});
		});
	});
	return sessions.filter(session => !session.expiration);
};

//Devuelve todas las sesiones, excepto las expiradas
const getAllSessions = async psy => {
	//Obtenemos solamente las sesiones que no han expirado, con todo lo que ello implica
	const sessions = await getAllSessionsFunction(psy);
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

	return okResponse('Sesiones obtenidas', {
		total,
		sessions,
	});
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
				session.status === 'success' && session.request === 'none'
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
		total,
		totalAvailable,
		successSessions,
		sessionsReceivable,
		sessions,
		transactions,
	});
};

// Utilizado para traer las sessiones de un psicologo para el selector
const getFormattedSessions = async idPsychologist => {
	let sessions = [];
	// obtenemos el psicologo
	const psychologist = await Psychologist.findById(idPsychologist).select(
		'_id schedule preferences'
	);
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

	// Filtramos que cada session sea de usuarios con pagos success y no hayan expirado
	psySessions = psySessions.filter(item =>
		item.plan.some(plan => {
			return (
				plan.payment === 'success' &&
				moment().isBefore(moment(plan.expiration))
			);
		})
	);

	// Formato de array debe ser [date, date, ...date]
	const daySessions = psySessions
		.flatMap(item => {
			return item.plan.flatMap(plan => {
				return plan.session.length
					? plan.session.map(session => session.date)
					: [];
			});
		})
		.filter(date =>
			moment(date, 'MM/DD/YYYY HH:mm').isSameOrAfter(moment())
		);

	const minimumNewSession = moment(Date.now()).add(
		psychologist.preferences.minimumNewSession,
		'h'
	);

	sessions = length.map(el => {
		const day = moment(Date.now()).add(el, 'days');
		const temporal = moment(day).format('L');

		return {
			id: el,
			value: day,
			day: day.format('DD MMM'),
			date: day.format('L'),
			text: moment(day),
			available: hours.filter(hour => {
				return (
					moment(`${temporal} ${hour}`, 'MM/DD/YYYY HH:mm').isAfter(
						minimumNewSession
					) &&
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

// Utilizado para traer las sessiones de todos los psicologos para el selector
const formattedSessionsAll = async () => {
	let sessions = [];
	let psychologist = await Psychologist.find({}).select(
		'schedule preferences'
	);
	// Para que nos de deje modificar el array de mongo
	psychologist = JSON.stringify(psychologist);
	psychologist = JSON.parse(psychologist);

	// creamos un array con la cantidad de dias
	const length = Array.from(Array(31), (_, x) => x);
	// creamos un array con la cantidad de horas
	const hours = Array.from(Array(24), (_, x) =>
		moment()
			.hour(x)
			.minute(0)
			.format('HH:mm')
	);

	// Formato de array debe ser [date, date, ...date]
	const setDaySessions = sessions =>
		sessions
			.flatMap(item => {
				return item.plan.flatMap(plan => {
					return plan.session.length
						? plan.session.map(session => session.date)
						: [];
				});
			})
			.filter(date =>
				moment(date, 'MM/DD/YYYY HH:mm').isSameOrAfter(moment())
			);

	// Obtenemos sessiones del psicologo
	let allSessions = await Sessions.find({}).populate(
		'psychologist',
		'_id schedule preferences'
	);

	// Filtramos que cada session sea de usuarios con pagos success y no hayan expirado
	allSessions = allSessions.filter(item =>
		item.plan.some(plan => {
			return (
				plan.payment === 'success' &&
				moment().isBefore(moment(plan.expiration))
			);
		})
	);

	allSessions = psychologist.map(item => ({
		...item,
		sessions: setDaySessions(
			allSessions.filter(element => element.psychologist === item._id)
		),
	}));

	sessions = allSessions.map(item => {
		const minimumNewSession = moment(Date.now()).add(
			item.preferences.minimumNewSession,
			'h'
		);

		return {
			psychologist: item._id,
			sessions: length.map(el => {
				const day = moment(Date.now()).add(el, 'days');
				const temporal = moment(day).format('L');
				return {
					psychologist: item._id,
					value: day,
					day: day.format('DD MMM'),
					date: day.format('L'),
					text: moment(day),
					available: hours.filter(hour => {
						return (
							moment(
								`${temporal} ${hour}`,
								'MM/DD/YYYY HH:mm'
							).isAfter(minimumNewSession) &&
							formattedSchedule(item.schedule, day, hour) &&
							!item.sessions.some(
								date =>
									moment(date, 'MM/DD/YYYY HH:mm').format(
										'L'
									) === temporal &&
									hour ===
										moment(date, 'MM/DD/YYYY HH:mm').format(
											'HH:mm'
										)
							)
						);
					}),
				};
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
						'[)'
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
	if (payload.user === payload.psychologist && payload.price !== 0) {
		return conflictResponse('No puedes suscribirte a ti mismo');
	}
	// valido MM/DD/YYYY HH:mm
	const date = `${payload.date} ${payload.start}`;
	const psychologist = await Psychologist.findById(payload.psychologist);
	const minimumNewSession = psychologist.preferences.minimumNewSession;
	if (
		moment().isAfter(
			moment(date, 'MM/DD/YYYY HH:mm').subtract(
				minimumNewSession,
				'hours'
			)
		)
	) {
		return conflictResponse(
			'No se puede agendar, se excede el tiempo de anticipación de la reserva'
		);
	}
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
	if (payload.paymentPeriod == 'Pago trimestral') {
		sessionQuantity = 12;
		expirationDate = moment()
			.add({ months: 3 })
			.toISOString();
	}

	const newSession = {
		date,
		sessionNumber: 1,
		paidToPsychologist: false,
	};

	const newPlan = {
		title: payload.title,
		period: payload.paymentPeriod,
		datePayment: '',
		totalPrice: payload.price,
		sessionPrice: payload.price / sessionQuantity,
		expiration: expirationDate,
		usedCoupon: payload.coupon,
		totalSessions: sessionQuantity,
		remainingSessions: sessionQuantity - 1,
		session: [newSession],
	};

	const userSessions = await Sessions.findOne({
		user: payload.user,
		psychologist: payload.psychologist,
	});

	const roomId = require('crypto')
		.createHash('md5')
		.update(`${payload.user}${payload.psychologist}`)
		.digest('hex');

	const url =
		payload.title !== 'Acompañamiento vía mensajería'
			? `${room}room/${roomId}`
			: '';

	if (payload.price > 0 && payload.user !== payload.psychologist) {
		await User.findByIdAndUpdate(payload.user, {
			$set: {
				psychologist: payload.psychologist,
			},
		});

		analytics.track({
			userId: payload.user._id,
			event: 'user-purchase-plan',
			properties: {
				plan: payload.title,
				period: payload.paymentPeriod,
				price: payload.price,
				expiration: expirationDate,
				totalSessions: sessionQuantity,
				email: payload.user.email,
			},
		});
		analytics.track({
			userId: payload.psychologist,
			event: 'psy-new-plan',
			properties: {
				plan: payload.title,
				period: payload.paymentPeriod,
				price: payload.price,
				expiration: expirationDate,
				totalSessions: sessionQuantity,
				user: payload.user._id,
			},
		});
	}

	if (userSessions) {
		if (
			userSessions.plan.some(
				plan =>
					plan.payment === 'success' &&
					moment().isBefore(moment(plan.expiration))
			)
		) {
			return conflictResponse('El usuario ya tiene un plan vigente');
		}

		const created = await Sessions.findOneAndUpdate(
			{ user: payload.user, psychologist: payload.psychologist },
			{ $push: { plan: newPlan }, $set: { roomsUrl: url } }
		);

		return okResponse('Plan creado', { plan: created });
	} else {
		const created = await Sessions.create({
			user: payload.user,
			psychologist: payload.psychologist,
			plan: [newPlan],
			roomsUrl: url,
		});
		//const params = { planId: created._id.toString() };

		return okResponse('Plan creado', { plan: created });
	}
};

/**
 * @description Crea una sesion nueva.
 * @param {Object} userLogged - user logged
 * @param {ObjectId} payload.id - Id sessions
 * @param {ObjectId} payload.idPlan - Id plan
 * @param {Object} payload - data to save
 * @returns sessions actualizada
 */
//Nueva sesion agendada correo (sin pago de sesión) para ambos
const createSession = async (userLogged, id, idPlan, payload) => {
	const { psychologist } = await Sessions.findOne({ _id: id }).populate(
		'psychologist'
	);
	const minimumNewSession = psychologist.preferences.minimumNewSession;
	// check whether the date is after the current date plus the minimum time
	if (
		moment().isAfter(
			moment(payload.date, 'MM/DD/YYYY HH:mm').subtract(
				minimumNewSession,
				'hours'
			)
		)
	) {
		return conflictResponse(
			'No se puede agendar, se excede el tiempo de anticipación de la reserva'
		);
	}

	let sessions = await Sessions.findOneAndUpdate(
		{ _id: id, 'plan._id': idPlan },
		{
			$set: {
				'plan.$.remainingSessions': payload.remainingSessions,
			},
			$push: { 'plan.$.session': payload },
		},
		{ new: true }
	).populate('psychologist user');

	if (payload.remainingSessions === 0) {
		let session = getLastSessionFromPlan(sessions, '', idPlan);
		const expiration = moment(session.lastSession)
			.add(1, 'hours')
			.format();
		sessions = await Sessions.findOneAndUpdate(
			{ _id: id, 'plan._id': idPlan },
			{
				$set: {
					'plan.$.expiration': expiration,
				},
			}
		).populate('psychologist user');
	}

	analytics.track({
		userId: userLogged._id.toString(),
		event: 'user-new-session',
		properties: {
			user: userLogged._id,
			planId: idPlan,
			userpsyId: id,
			email: userLogged.email,
		},
	});

	analytics.track({
		userId: userLogged.psychologist.toString(),
		event: 'psy-new-session',
		properties: {
			user: userLogged._id,
			planId: idPlan,
			userpsyId: id,
		},
	});

	return okResponse('sesion creada', {
		sessions: setSession(userLogged.role, [sessions]),
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
 * Reprogramacion de sesion
 * @param {string} userLogged Usuario logeado
 * @param {string} sessionsId sessionsId id de las sessiones
 * @param {string} id id del sub scheme session
 * @param {Object} newDate Datos a actualizar
 * @returns sessions
 */
const reschedule = async (userLogged, sessionsId, id, newDate) => {
	const date = `${newDate.date} ${newDate.hour}`;
	const sessions = await Sessions.findOneAndUpdate(
		{
			_id: sessionsId,
			'plan.session._id': id,
		},
		{
			$set: {
				'plan.$[].session.$[session].date': date,
			},
		},
		{ arrayFilters: [{ 'session._id': id }], new: true }
	).populate('psychologist user');

	let session = getLastSessionFromPlan(sessions, id, '');

	if (session.remainingSessions === 0) {
		const expiration = moment(session.lastSession, 'YYYY/MM/DD HH:mm')
			.add(1, 'hours')
			.format();
		await Sessions.findOneAndUpdate(
			{ _id: sessionsId, 'plan._id': session.plan_id },
			{
				$set: {
					'plan.$.expiration': expiration,
				},
			}
		);
	}

	await mailService.sendRescheduleToUser(
		sessions.user,
		sessions.psychologist,
		newDate
	);
	await mailService.sendRescheduleToPsy(
		sessions.user,
		sessions.psychologist,
		newDate
	);

	return okResponse('Hora actualizada', {
		sessions: setSession(userLogged.role, [sessions]),
	});
};

const getLastSessionFromPlan = (sessions, sessionId, planId) => {
	let session = sessions.plan
		.flatMap(plan => {
			let maxSession = plan.session.map(session =>
				moment(session.date, 'MM/DD/YYYY HH:mm').format(
					'YYYY/MM/DD HH:mm'
				)
			);
			maxSession = maxSession.sort((a, b) => new Date(b) - new Date(a));
			return plan.session.flatMap(session => {
				return {
					session_id: session._id,
					plan_id: plan._id,
					date: session.date,
					datePayment: plan.datePayment,
					lastSession: maxSession[0],
					remainingSessions: plan.remainingSessions,
				};
			});
		})
		.filter(
			session =>
				sessionId === session.session_id.toString() ||
				planId === session.plan_id.toString()
		);

	return session[0];
};

/**
 * Actualiza una sessions
 * @param {string} sessions campos a actualizar
 */
const updateSessions = async sessions => {
	await Sessions.updateOne(
		{
			_id: sessions._id,
		},
		{
			$set: {
				observation: sessions.observation,
			},
		}
	);

	return okResponse('Observacion agregada');
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
//Reprogramación sesiones para psicologos
const cancelSession = async (user, planId, sessionsId, id) => {
	const cancelSessions = await Sessions.find({
		_id: sessionsId,
		'plan._id': planId,
		'plan.session._id': id,
	}).populate('psychologist user');

	await Sessions.updateOne(
		{
			_id: sessionsId,
			'plan._id': planId,
			'plan.session._id': id,
		},
		{
			$pull: {
				'plan.$.session': { _id: id },
			},
		}
	);

	/*session = getLastSessionFromPlan(session, id, planId);

	const date = moment(session.date).format();
	const lastSession = moment(session.lastSession).format();

	//En caso de cancelar una sesión, cambiará a fecha de expiración si las sesiones restantes eran 0
	//y la fecha de lasesión cancelada sea igual que la fecha de la ultima sesión (sesión cuando expirá actualmente)
	if (
		session.remainingSessions === 0 &&
		new Date(date).getTime() === new Date(lastSession).getTime()
	) {
		const expiration = moment(session.datePayment)
			.add(1, 'months')
			.format();
		await Sessions.findOneAndUpdate(
			{ _id: sessionsId, 'plan._id': session.plan_id },
			{
				$set: {
					'plan.$.expiration': expiration,
				},
			}
		);
	}*/

	const sessions = await Sessions.find({
		psychologist: user.psychologist,
	}).populate('psychologist user');

	await mailService.sendCancelSessionPsy(
		cancelSessions[0].user,
		cancelSessions[0].psychologist
	);
	await mailService.sendCancelSessionUser(
		cancelSessions[0].user,
		cancelSessions[0].psychologist
		//sessionCancel.plan[0].session[0].date
	);

	return okResponse('Sesion cancelada', {
		sessions: setSession(user.role, sessions),
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

			const data = {
				user: user._id,
				psychologistId: updated._id,
				username: updated.username,
			};

			pusher.trigger('psychologist', 'update', data, pusherCallback);

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
				plan.status = 'expired';
			}
		});
		foundUser.save();
	});

	return okResponse('ok');
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

/**
 * Creacion de sesion personalizda
 * (invitado por psicologo, o bloqueo de horas)
 * @param {Object} user Usuario logeado
 * @param {string} payload.date Fecha de la sesion
 * @param {string} payload.type Tipo de la sesion ['online', 'presencial', 'commitment', etc...]
 * @param {integer} payload.price Precio que se cobrara
 * @returns sessions
 */
const customNewSession = async (user, payload) => {
	try {
		// Validamos que sea psicologo
		if (user.role !== 'psychologist')
			return conflictResponse('No eres psicologo');
		let sessions = [];
		let hours = 1;

		if (payload.dateEnd && payload.type === 'compromiso privado') {
			logInfo('custom');
			const start = moment(payload.date, 'MM/DD/YYYY HH:mm');
			const end = moment(payload.dateEnd, 'MM/DD/YYYY HH:mm');
			hours = Math.abs(end.diff(start, 'hours')) + 1;
		}
		// Objeto con la sesion a crear
		for (let i = 0; i < hours; i++) {
			const date = moment(payload.date, 'MM/DD/YYYY HH:mm').add(
				i,
				'hours'
			);
			const newSession = {
				date: date.format('MM/DD/YYYY HH:mm'),
				sessionNumber: i + 1,
				paidToPsychologist: false,
				status: 'pending',
			};
			sessions.push(newSession);
		}

		// Objeto con el plan a crear
		const newPlan = {
			title: payload.type,
			period: 'Pago semanal',
			totalPrice: payload.price,
			sessionPrice: payload.price,
			payment:
				payload.type === 'compromiso privado' ? 'success' : 'pending',
			expiration: moment(payload.date, 'MM/DD/YYYY HH:mm')
				.add({ weeks: 1 })
				.toISOString(),
			invitedByPsychologist: true,
			usedCoupon: '',
			totalSessions: 1,
			remainingSessions: 0,
			session: sessions,
		};

		// Si existe un plan con este titulo lo removemos
		await Sessions.updateOne(
			{
				user: payload.user,
				psychologist: user.psychologist,
			},
			{
				$pull: {
					plan: { title: 'Plan inicial' },
				},
			}
		);

		// Creamos la direccion de la sala de videollamadas
		const roomId = require('crypto')
			.createHash('md5')
			.update(`${payload.user}${payload.psychologist}`)
			.digest('hex');

		// creamos o actualizamos las sesiones entre el usuario y el psicologo
		// cuando se crea compromiso privado el user será null
		const updatedSession = await Sessions.findOneAndUpdate(
			{
				user: payload.user,
				psychologist: user.psychologist,
			},
			{
				user: payload.user,
				psychologist: user.psychologist,
				$push: { plan: newPlan },
				roomsUrl: payload.user ? `${room}room/${roomId}` : '',
			},
			{ upsert: true, new: true }
		).populate('user psychologist');

		//validamos precio y que exista user(recordemos que user es null en compromiso privado)
		if (payload.price && payload.price > 0 && payload.user) {
			const {
				data,
			} = await mercadopagoService.createCustomSessionPreference({
				userId: payload.user,
				psyId: user.psychologist,
				planId: updatedSession.plan[updatedSession.plan.length - 1]._id,
			});
			// Enviamos email a el user con el link para pagar
			await mailService.sendCustomSessionPaymentURL(
				updatedSession.user,
				updatedSession.psychologist,
				data.init_point
			);
		}

		// respondemos con la sesion creada
		return okResponse('sesion creada', {
			sessions: setSession(user.role, [updatedSession]).pop(),
		});
	} catch (err) {
		logInfo(err);
	}
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

	let allSessions = await Sessions.find({
		psychologist: user.psychologist,
	}).populate('user');

	let comission = 0;
	let percentage = '0%';

	let psy = await Psychologist.findById(user.psychologist);
	if (!psy.psyPlans || psy.psyPlans == []) {
		psy.psyPlans = [
			{
				tier: 'free',
				paymentStatus: 'success',
				planStatus: 'active',
				expirationDate: '',
				subscriptionPeriod: '',
				price: 0,
				hablaquiFee: 0.2,
				paymentFee: 0.0399,
			},
		];
		await psy.save();
	}

	let currentPlan = psy.psyPlans[psy.psyPlans.length - 1];

	if (currentPlan.tier === 'premium') {
		comission = currentPlan.paymentFee;
		percentage = '3.99%';
	} else {
		comission = currentPlan.hablaquiFee;
		percentage = '20%';
	}

	// Filtramos que cada session sea de usuarios con pagos success y no hayan expirado
	allSessions = allSessions.filter(item =>
		item.plan.some(plan => {
			return (
				plan.payment === 'success' &&
				plan.title !== 'compromiso privado'
			);
		})
	);
	const validPayments = allSessions.flatMap(item => {
		if (item.user)
			return item.plan.flatMap(plans => {
				const realComission = plans.invitedByPsychologist
					? currentPlan.paymentFee
					: comission;
				let sessions = plans.session.map(session => {
					const transDate = session.paymentDate
						? session.paymentDate
						: 'Por cobrar';
					const hablaquiPercentage =
						realComission === 0.0399
							? plans.sessionPrice * 0
							: plans.sessionPrice * 0.1601;

					return {
						datePayment: moment(plans.datePayment).format(
							'DD/MM/YYYY'
						),
						name: `${item.user.name ? item.user.name : ''} ${
							item.user.lastName ? item.user.lastName : ''
						}`,
						date: moment(session.date).format('DD/MM/YYYY'),
						sessionsNumber: `${session.sessionNumber} de ${plans.totalSessions}`,
						amount: plans.sessionPrice,
						hablaquiPercentage: hablaquiPercentage.toFixed(2),
						mercadoPercentage: (
							plans.sessionPrice * 0.0399
						).toFixed(2),
						percentage:
							realComission === 0.0399 ? '3.99%' : percentage,
						total: (
							plans.sessionPrice *
							(1 - realComission)
						).toFixed(2),
						status: session.status,
						transDate,
					};
				});
				sessions = sessions.filter(
					session => session.status === 'success'
				);

				const receivable = sessions.filter(
					session => session.transDate === 'Por cobrar'
				).length;

				return {
					idPlan: plans._id,
					sessionsId: item._id,
					name: `${item.user.name ? item.user.name : ''} ${
						item.user.lastName ? item.user.lastName : ''
					}`,
					plan: plans.title,
					payment: plans.payment,
					suscription: plans.period,
					user: item.user._id,
					datePayment: moment(plans.datePayment).format('DD/MM/YYYY'),
					amount: plans.totalPrice,
					finalAmount: (
						plans.totalPrice *
						(1 - realComission)
					).toFixed(2),
					sessions,
					transState: receivable > 0 ? 'Por cobrar' : 'Cobrado',
				};
			});
	});
	const payments = validPayments.filter(item => {
		return (
			item &&
			item.payment === 'success' &&
			item.plan !== 'compromiso privado'
		);
	});
	//logInfo(payments);
	return okResponse('Obtuvo todo sus pagos', { payments });
};

const deleteCommitment = async (planId, psyId) => {
	const psy = await Psychologist.findById(psyId);
	if (!psy) {
		return conflictResponse('No existe el psicólogo');
	}

	const updatedSessions = await Sessions.findOneAndUpdate(
		{
			psychologist: psy._id,
			'plan._id': planId,
		},
		{
			$pull: {
				plan: { _id: planId },
			},
		},
		{ new: true }
	);

	return okResponse('Sesion eliminada', updatedSessions);
};

const getEvaluations = async user => {
	if (user.role !== 'psychologist')
		return conflictResponse('No eres psicólogo');

	const psy = user.psychologist;
	let evaluations = await Evaluation.find({ psychologist: psy });
	if (!evaluations)
		return okResponse('Evaluaciones devueltas', {
			evaluations: [],
			global: 0,
			internet: 0,
			puntuality: 0,
			attention: 0,
		});

	evaluations = await getAllEvaluationsFunction(psy);
	evaluations = evaluations.filter(
		evaluation => evaluation.approved === 'approved'
	);

	return okResponse('Evaluaciones devueltas', {
		evaluations,
		...getScores(evaluations),
	});
};

const getScores = evaluations => {
	const global =
		evaluations.reduce(
			(sum, value) =>
				typeof value.global == 'number' ? sum + value.global : sum,
			0
		) / evaluations.length;
	const puntuality =
		evaluations.reduce(
			(sum, value) =>
				typeof value.puntuality == 'number'
					? sum + value.puntuality
					: sum,
			0
		) / evaluations.length;
	const attention =
		evaluations.reduce(
			(sum, value) =>
				typeof value.attention == 'number'
					? sum + value.attention
					: sum,
			0
		) / evaluations.length;
	const internet =
		evaluations.reduce(
			(sum, value) =>
				typeof value.internet == 'number' ? sum + value.internet : sum,
			0
		) / evaluations.length;
	return { global, internet, puntuality, attention };
};

const getAllEvaluations = async psy => {
	const evaluations = await getAllEvaluationsFunction(psy);
	return okResponse('Todas las sesiones devueltas', {
		evaluations,
		...getScores(evaluations),
	});
};

const getAllEvaluationsFunction = async psy => {
	let evaluations = await Evaluation.find({ psychologist: psy }).populate(
		'user'
	);

	evaluations = evaluations.flatMap(item => {
		return item.evaluations.map(evaluation => {
			return {
				_id: evaluation._id,
				evaluationsId: item._id,
				comment: evaluation.comment,
				approved: evaluation.approved,
				global: evaluation.global,
				puntuality: evaluation.puntuality,
				attention: evaluation.attention,
				internet: evaluation.internet,
				name: item.user.name,
				userId: item.user._id,
				moderatingDate: evaluation.moderatingDate,
				createdAt: moment(evaluation.createdAt)
					.tz('America/Santiago')
					.format(),
			};
		});
	});

	return evaluations;
};

const approveEvaluation = async (evaluationsId, evaluationId) => {
	const evaluations = await Evaluation.findOneAndUpdate(
		{ _id: evaluationsId, 'evaluations._id': evaluationId },
		{
			$set: {
				'evaluations.$.approved': 'approved',
				'evaluations.$.moderatingDate': moment().format(),
			},
		}
	).populate('psychologist user');

	//enviar correo donde se apruba la evaluación

	return okResponse('Sesion aprobada', { evaluations });
};

const refuseEvaluation = async (evaluationsId, evaluationId) => {
	const evaluations = await Evaluation.findOneAndUpdate(
		{ _id: evaluationsId, 'evaluations._id': evaluationId },
		{
			$set: {
				'evaluations.$.approved': 'refuse',
				'evaluations.$.moderatingDate': moment().format(),
			},
		}
	).populate('psychologist user');

	//Enviar correo donde se rechaza la evaluación

	return okResponse('Sesion rechazada', { evaluations });
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
	getAllPagination,
	getByData,
	getClients,
	getFormattedSessions,
	formattedSessionsAll,
	getRating,
	getSessions,
	match,
	paymentsInfo,
	register,
	reschedule,
	searchClients,
	setPrice,
	setSchedule,
	updateSessions,
	updateFormationExperience,
	updatePaymentMethod,
	updatePlan,
	updatePsychologist,
	uploadProfilePicture,
	usernameAvailable,
	deleteCommitment,
	getAllSessions,
	getRemainingSessions,
	getEvaluations,
	getAllEvaluations,
	approveEvaluation,
	refuseEvaluation,
	createPaymentsRequest,
	completePaymentsRequest,
	getTransactions,
};

export default Object.freeze(psychologistsService);
