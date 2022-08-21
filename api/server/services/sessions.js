'use strict';

import { room } from '../config/dotenv';
import { logInfo } from '../config/pino';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import User from '../models/user';
import Coupon from '../models/coupons';
import mercadopagoService from './mercadopago';
import Psychologist from '../models/psychologist';
import mailService from './mail';
import Sessions from '../models/sessions';
import moment from 'moment';
moment.tz.setDefault('America/Santiago');
var Analytics = require('analytics-node');
var analytics = new Analytics(process.env.SEGMENT_API_KEY);

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

//Reprogramación sesiones para psicologos
const cancelSession = async (user, planId, sessionsId, id) => {
	const cancelSessions = await Sessions.findOneAndUpdate(
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
	).populate('psychologist user');

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

	// considera que el usuario es psicologo
	const sessions = await Sessions.find({
		psychologist: cancelSessions[0].psychologist._id,
	}).populate('psychologist user');

	if (cancelSessions.user == null) {
		await mailService.sendCancelCommitment(cancelSessions.psychologist);
	} else {
		await mailService.sendCancelSessionPsy(
			cancelSessions.user,
			cancelSessions.psychologist
		);
		await mailService.sendCancelSessionUser(
			cancelSessions.user,
			cancelSessions.psychologist
			//sessionCancel.plan[0].session[0].date
		);
	}

	return okResponse('Sesion cancelada', {
		sessions: setSession(user.role, sessions),
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
		!psychologist.inmediateAttention.activated &&
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
		expirationDate = moment(date, 'MM/DD/YYYY HH:mm')
			.add(50, 'minutes')
			.format();
	}
	if (payload.paymentPeriod == 'Pago mensual') {
		sessionQuantity = 4;
		expirationDate = moment()
			.add({ months: 1 })
			.format();
	}
	if (payload.paymentPeriod == 'Pago trimestral') {
		sessionQuantity = 12;
		expirationDate = moment()
			.add({ months: 3 })
			.format();
	}

	const newSession = {
		date,
		sessionNumber: 1,
		paidToPsychologist: false,
	};
	const foundCoupon = await Coupon.findOne({ code: payload.coupon });

	const randomCode = () => {
		return Math.random()
			.toString(36)
			.substring(2);
	};
	const token = randomCode() + randomCode();

	let price = payload.price < 0 ? 0 : payload.price;
	if (foundCoupon && foundCoupon.discountType === 'static')
		price = payload.originalPrice;
	const newPlan = {
		title: payload.title,
		period: payload.paymentPeriod,
		datePayment: '',
		totalPrice: price,
		sessionPrice: price / sessionQuantity,
		expiration: expirationDate,
		usedCoupon: payload.coupon,
		totalSessions: sessionQuantity,
		remainingSessions: sessionQuantity - 1,
		tokenToPay: token,
		session: [newSession],
	};
	//logInfo(newPlan);
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
			userId: payload.user._id.toString(),
			event: 'user-purchase-plan',
			properties: {
				plan: payload.title,
				period: payload.paymentPeriod,
				price: payload.price,
				expiration: expirationDate,
				totalSessions: sessionQuantity,
			},
		});
		analytics.track({
			userId: payload.psychologist.toString(),
			event: 'psy-new-plan',
			properties: {
				plan: payload.title,
				period: payload.paymentPeriod,
				price: payload.price,
				expiration: expirationDate,
				totalSessions: sessionQuantity,
				user: payload.user._id.toString(),
			},
		});
	}

	let created = null;

	const userPlans = await Sessions.find({ user: payload.user });

	if (
		userPlans.some(sessions => {
			return sessions.plan.some(
				plan =>
					plan.payment === 'success' &&
					moment().isBefore(moment(plan.expiration)) &&
					plan.title !== 'Plan inicial'
				//sessions.psychologist.toString() !== payload.psychologist
			);
		})
	)
		return conflictResponse('El usuario ya tiene un plan vigente');
	else {
		if (userSessions) {
			created = await Sessions.findOneAndUpdate(
				{ user: payload.user, psychologist: payload.psychologist },
				{ $push: { plan: newPlan }, $set: { roomsUrl: url } },
				{ new: true }
			);
		} else {
			created = await Sessions.create({
				user: payload.user,
				psychologist: payload.psychologist,
				plan: [newPlan],
				roomsUrl: url,
			});
		}
	}

	if (
		process.env.API_URL.includes('hablaqui.cl') ||
		process.env.DEBUG_ANALYTICS === 'true'
	) {
		let planData = [
			{
				item_id: created._id.toString(),
				item_name: payload.title,
				coupon: payload.coupon || '',
				price: payload.price / sessionQuantity,
				quantity: sessionQuantity,
			},
		];
		analytics.track({
			userId: payload.user._id.toString(),
			event: 'current-user-purchase-plan',
			properties: {
				products: planData,
				order_id: created.plan[created.plan.length - 1]._id.toString(),
				timestamp: moment().format(),
				total: payload.price / sessionQuantity,
			},
		});
		analytics.track({
			userId: payload.psychologist.toString(),
			event: 'current-psy-new-plan',
			properties: {
				products: planData,
				user: payload.user._id,
				order_id: created.plan[created.plan.length - 1]._id.toString(),
				timestamp: moment().format(),
			},
		});
	}
	if (foundCoupon) {
		let discount = -payload.price;
		if (foundCoupon.discountType === 'static') {
			if (payload.price >= 0) discount = 0;
			await Coupon.findOneAndUpdate(
				{ _id: foundCoupon._id },
				{ $set: { discount: discount } }
			);
		}
	}
	let responseBody = { init_point: null };
	if (payload.price <= 0) {
		await mercadopagoService.successPay({
			sessionsId: created._id.toString(),
			planId: created.plan.pop()._id.toString(),
		});
	} else {
		const user = await User.findById(payload.user);
		const plan = created.plan.pop();
		const mercadopagoPayload = {
			psychologist: psychologist.username,
			price: payload.price,
			description:
				payload.title +
				' - Pagado por ' +
				user.name +
				' ' +
				user.lastName,
			quantity: 1,
			sessionsId: created._id.toString(),
			planId: plan._id.toString(),
			token,
		};
		responseBody = await mercadopagoService.createPreference(
			mercadopagoPayload
		);
		await mailService.pendingPlanPayment(
			user,
			psychologist,
			payload.price,
			responseBody.init_point
		);
	}

	return okResponse('Plan y preferencias creadas', responseBody);
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
	const { psychologist, plan, roomsUrl } = await Sessions.findOne({
		_id: id,
	}).populate('psychologist');

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

	const myPlan = plan.filter(
		plan => plan._id.toString() === idPlan.toString()
	)[0];

	if (myPlan.payment !== 'success')
		return conflictResponse('No puedes agendar un plan sin pagar');

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
			.add(50, 'minutes')
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
	if (
		process.env.API_URL.includes('hablaqui.cl') ||
		process.env.DEBUG_ANALYTICS === 'true'
	) {
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
		const getUser = await User.findOne({ email: psychologist.email });
		const userID = getUser._id;
		analytics.track({
			userId: userID.toString(),
			event: 'psy-new-session',
			properties: {
				user: userLogged._id,
				planId: idPlan,
				userpsyId: id,
			},
		});
	}
	await mailService.sendScheduleToUser(
		userLogged,
		psychologist,
		moment(payload.date, 'MM/DD/YYYY HH:mm'),
		roomsUrl,
		`${myPlan.totalSessions - payload.remainingSessions}/${
			myPlan.totalSessions
		}`
	);
	await mailService.sendScheduleToPsy(
		userLogged,
		psychologist,
		moment(payload.date, 'MM/DD/YYYY HH:mm'),
		roomsUrl,
		`${myPlan.totalSessions - payload.remainingSessions}/${
			myPlan.totalSessions
		}`
	);

	return okResponse('sesion creada', {
		sessions: setSession(userLogged.role, [sessions]),
	});
};
/**
 * Creacion de sesion personalizda
 * (invitado por psicologo, o bloqueo de horas)
 * @param {Object} user Usuario logeado
 * @param {string} payload.date Fecha de la sesion
 * @param {string} payload.type Tipo de la sesion ['online', 'presencial', 'commitment', etc...]
 * @param {Number} payload.price Precio que se cobrara
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

		// correo de compromiso privado
		if (payload.type === 'compromiso privado')
			await mailService.sendCustomSessionCommitment(
				updatedSession.psychologist
			);

		//validamos precio y que exista user(recordemos que user es null en compromiso privado)
		if (payload.price && payload.price > 0 && payload.user) {
			const {
				data,
			} = await mercadopagoService.createCustomSessionPreference({
				userId: payload.user,
				psyId: user.psychologist,
				planId: updatedSession.plan[updatedSession.plan.length - 1]._id,
			});
			if (payload.type === 'sesion online') {
				// Enviamos email al user con el link para pagar
				await mailService.sendCustomSessionToUser(
					updatedSession.user,
					updatedSession.psychologist,
					data.init_point,
					payload.date,
					payload.price,
					'online'
				);
				await mailService.sendCustomSessionToPsy(
					updatedSession.user,
					updatedSession.psychologist,
					data.init_point,
					payload.date,
					payload.price,
					'online'
				);
			}
			if (payload.type === 'sesion presencial') {
				await mailService.sendCustomSessionToUser(
					updatedSession.user,
					updatedSession.psychologist,
					data.init_point,
					payload.date,
					payload.price,
					'presencial'
				);
				await mailService.sendCustomSessionToPsy(
					updatedSession.user,
					updatedSession.psychologist,
					data.init_point,
					payload.date,
					payload.price,
					'presencial'
				);
			}
		}
		if (
			process.env.API_URL.includes('hablaqui.cl') ||
			process.env.DEBUG_ANALYTICS === 'true'
		) {
			if (payload.type === 'online') {
				let planData = [
					{
						item_id: 3,
						item_name:
							'Plan/sesión personalizada agendada por psicólogo',
						item_price: payload.price,
						item_quantity: 1,
					},
				];
				analytics.track({
					userId: user._id.toString(),
					event: 'psy-scheduled-user-session',
					properties: {
						products: planData,
						currency: 'CLP',
						order_id: updatedSession.plan[
							updatedSession.plan.length - 1
						]._id.toString(),
						total: 0,
					},
				});
			} else if (payload.type === 'presencial') {
				let planData = [
					{
						item_id: 4,
						item_name:
							'Plan/sesión personalizada agendada por psicólogo presencialmente',
						item_price: payload.price,
						item_quantity: 1,
					},
				];
				analytics.track({
					userId: user._id.toString(),
					event: 'psy-scheduled-onsite-user-session',
					properties: {
						products: planData,
						currency: 'CLP',
						order_id: updatedSession.plan[
							updatedSession.plan.length - 1
						]._id.toString(),
						total: 0,
					},
				});
			} else if (payload.type === 'compromiso privado') {
				analytics.track({
					userId: user._id.toString(),
					event: 'psy-scheduled-private-hours',
				});
			}
		}
		// respondemos con la sesion creada
		return okResponse('sesion creada', {
			sessions: setSession(user.role, [updatedSession]).pop(),
		});
	} catch (err) {
		logInfo(err);
	}
};

//type: será el tipo de calendario que debe mostrar (agendamiento o reagendamiento)
// Utilizado para traer las sessiones de un psicologo para el selector
const getFormattedSessions = async (idPsychologist, type) => {
	let sessions = [];
	// obtenemos el psicologo
	const psychologist = await Psychologist.findById(idPsychologist).select(
		'_id schedule preferences inmediateAttention'
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
	let minimumNewSession = 0;
	if (type === 'schedule')
		minimumNewSession = moment(Date.now()).add(
			psychologist.preferences.minimumNewSession,
			'h'
		);
	else if (type === 'reschedule')
		minimumNewSession = moment(Date.now()).add(
			psychologist.preferences.minimumRescheduleSession,
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
const formattedSessionsAll = async ids => {
	let sessions = [];
	let psychologist = [];
	if (ids && Array.isArray(ids) && ids.length) {
		psychologist = await Psychologist.find({ _id: { $in: ids } }).select(
			'schedule preferences inmediateAttention'
		);
	} else
		psychologist = await Psychologist.find({}).select(
			'schedule preferences inmediateAttention'
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
		'_id schedule preferences inmediateAttention'
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
			allSessions.filter(
				element =>
					element.psychologist._id.toString() === item._id.toString()
			)
		),
	}));

	sessions = allSessions.map(item => {
		const minimumNewSession = moment(Date.now()).add(
			item.preferences.minimumNewSession,
			'h'
		);
		let schedule = item.schedule;

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
							formattedSchedule(schedule, day, hour) &&
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

const paymentsInfo = async user => {
	if (user.role != 'psychologist')
		return conflictResponse('No eres psicologo');

	const payments = await paymentInfoFunction(user.psychologist);
	return okResponse('Obtuvo todo sus pagos', { payments });
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
	let currentSession = await Sessions.findOne({
		_id: sessionsId,
	}).populate('psychologist', 'preferences');
	const {
		minimumRescheduleSession,
	} = currentSession.psychologist.preferences;

	currentSession = currentSession.plan
		.flatMap(plan => {
			return plan.session;
		})
		.filter(s => s._id.toString() === id.toString())[0];

	if (
		moment().isAfter(
			moment(currentSession.date, 'MM/DD/YYYY HH:mm').subtract(
				minimumRescheduleSession,
				'hours'
			)
		)
	) {
		return conflictResponse(
			'No puede agendar ' +
				minimumRescheduleSession +
				' horas antes de la sesión'
		);
	}

	const date = `${newDate.date} ${newDate.hour}`;
	newDate.date = moment(newDate.date, 'MM/DD/YYY').format('DD/MM/YYYY');
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
			.add(50, 'minutes')
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

	if (userLogged.role === 'user') {
		await mailService.sendRescheduleToUser(
			sessions.user,
			sessions.psychologist,
			newDate
		);
		await mailService.sendRescheduleToPsy(
			sessions.user,
			sessions.psychologist,
			newDate,
			sessions.roomsUrl
		);
	} else {
		await mailService.sendRescheduleToUserByPsy(
			sessions.user,
			sessions.psychologist,
			newDate,
			sessions.roomsUrl
		);
		await mailService.sendRescheduleToPsyByPsy(
			sessions.user,
			sessions.psychologist,
			newDate,
			sessions.roomsUrl
		);
	}

	if (
		process.env.API_URL.includes('hablaqui.cl') ||
		process.env.DEBUG_ANALYTICS === 'true'
	) {
		analytics.track({
			userId: userLogged._id.toString(),
			event: 'user-reschedule-session',
			properties: {
				user: userLogged._id,
				psychologistId: sessions.psychologist._id.toString(),
			},
		});
	}
	return okResponse('Hora actualizada', {
		sessions: setSession(userLogged.role, [sessions]),
	});
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

const paymentsInfoFromId = async psy => {
	const user = await Psychologist.findById(psy);
	if (!user) return conflictResponse('No es psicologo');
	const payments = await paymentInfoFunction(psy);
	return okResponse('Obtuvo todo sus pagos', { payments });
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

const paymentInfoFunction = async psyId => {
	let allSessions = await Sessions.find({
		psychologist: psyId,
	}).populate('user');

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
				const paymentPlanDate = moment(plans.datePayment).format(
					'DD/MM/YYYY'
				);

				let sessions = plans.session.map(session => {
					let transDate =
						session.paymentDate &&
						moment(session.paymentDate, 'MM/DD/YYYY').isValid()
							? moment(session.paymentDate, 'MM/DD/YYYY').format(
									'DD/MM/YYYY'
							  )
							: session.requestDate &&
							  moment(session.requestDate).isValid()
							? 'Pendiente'
							: 'Por cobrar';
					transDate =
						session.status === 'pending'
							? 'Por realizar'
							: transDate;

					return {
						_id: session._id,
						datePayment: paymentPlanDate,
						name: item.user.name ? item.user.name : '',
						lastname: item.user.lastName ? item.user.lastName : '',
						date: moment(session.date, 'MM/DD/YYYY HH:mm').format(
							'DD/MM/YYYY HH:mm'
						),
						sessionsNumber: `${session.sessionNumber} de ${plans.totalSessions}`,
						amount: priceFormatter(+plans.sessionPrice),
						hablaquiPercentage: 0,
						mercadoPercentage: (
							plans.sessionPrice * 0.0351
						).toFixed(2),
						percentage: '3.51%',
						total: priceFormatter(
							+(plans.sessionPrice * (1 - 0.0351)).toFixed(0)
						),
						status: session.status,
						transDate,
					};
				});

				const lastSession = sessions[sessions.length - 1];
				const pendingsToPay = sessions.filter(
					s => s.transDate === 'Pendiente'
				).length;

				const pendingsToDo = sessions.filter(
					s => s.transDate === 'Por realizar'
				).length;

				const receivable = sessions.filter(
					session => session.transDate === 'Por cobrar'
				).length;

				for (
					let i = sessions.length + 1;
					i <= plans.totalSessions;
					i++
				) {
					const session = {
						_id: null,
						datePayment: moment(
							plans.datePayment,
							'MM/DD/YYYY'
						).format('DD/MM/YYYY'),
						name: item.user.name ? item.user.name : '',
						lastname: item.user.lastName ? item.user.lastName : '',
						date: '---',
						sessionsNumber: `${i} de ${plans.totalSessions}`,
						amount: priceFormatter(+plans.sessionPrice),
						hablaquiPercentage: 0,
						mercadoPercentage: (
							plans.sessionPrice * 0.0351
						).toFixed(2),
						percentage: '3.51%',
						total: priceFormatter(
							+(plans.sessionPrice * (1 - 0.0351)).toFixed(0)
						),
						status: 'pending',
						transDate: 'Por agendar',
					};
					sessions.push(session);
				}

				/*sessions = sessions.filter(
					session => session.status === 'success'
				);*/

				const lastname = item.user.lastName ? item.user.lastName : '';
				return {
					idPlan: plans._id,
					sessionsId: item._id,
					name: item.user.name
						? item.user.name + ' ' + lastname
						: lastname,
					lastname,
					plan: plans.title,
					payment: plans.payment,
					suscription: plans.period,
					user: item.user._id,
					datePayment: paymentPlanDate,
					amount: priceFormatter(+plans.totalPrice),
					finalAmount: priceFormatter(
						+(plans.totalPrice * (1 - 0.0351)).toFixed(0)
					),
					sessions,
					transState:
						pendingsToPay > 0
							? 'Pendiente'
							: receivable > 0
							? 'Por cobrar'
							: pendingsToDo > 0
							? 'Por realizar'
							: 'Cobrado',
					sessionsNumber: lastSession
						? lastSession.sessionsNumber
						: '- de ' + sessions.length,
				};
			});
	});
	const payments = validPayments.filter(item => {
		return (
			item &&
			item.payment === 'success' &&
			item.plan !== 'compromiso privado' &&
			item.suscription !== 'Plan inicial'
		);
	});
	return payments;
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
					totalSessions: plan.totalSessions,
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

const priceFormatter = price => {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
	});

	return formatter.format(price);
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
					numberSessionSuccess: item.numberSessionSuccess,
					activePlan:
						plan.payment === 'success' &&
						moment().isBefore(moment(plan.expiration)),
				};
			});
		});
	});
};

const sessionsService = {
	getSessions,
	getRemainingSessions,
	cancelSession,
	checkPlanTask,
	createPlan,
	createSession,
	customNewSession,
	getFormattedSessions,
	formattedSessionsAll,
	paymentsInfo,
	reschedule,
	updateSessions,
	deleteCommitment,
	getAllSessions,
	paymentsInfoFromId,
};

export default Object.freeze(sessionsService);
