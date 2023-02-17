'use strict';

import { room } from '../config/dotenv';
import { logInfo } from '../config/pino';
import { getAllSessionsFunction } from '../utils/functions/getAllSessionsFunction';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import {
	paymentInfoFunction,
	formattedSchedule,
	getLastSessionFromPlan,
	setSession,
} from '../utils/functions/sessionsFunctions';
import User from '../models/user';
import Coupon from '../models/coupons';
import mercadopagoService from './mercadopago';
import Specialist from '../models/specialist';
import mailServiceReminder from '../utils/functions/mails/reminder';
import mailServiceSchedule from '../utils/functions/mails/schedule';
import Sessions from '../models/sessions';
import Email from '../models/email';
import dayjs from 'dayjs';
import crypto from 'crypto';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Analytics from 'analytics-node';
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.tz.setDefault('America/Santiago');

const analytics = new Analytics(process.env.SEGMENT_API_KEY);

const getSessions = async (userLogged, idUser) => {
	// iniciamos la variable
	let sessions;

	// Buscamos la sesiones correspondiente a ese user y psicologo
	if (userLogged.role === 'user') {
		sessions = await Sessions.find({
			//specialist: idSpec,
			user: idUser,
		}).populate('specialist user');
	}
	if (userLogged.role === 'specialist') {
		sessions = await Sessions.find({
			specialist: idUser,
		}).populate('specialist user');
	}

	// Para que nos de deje modificar el array de mongo
	sessions = JSON.stringify(sessions);
	sessions = JSON.parse(sessions);

	// Comenzamos a modificar el array de sessiones con la estructura que necesita el frontend
	sessions = setSession(userLogged.role, sessions);

	logInfo('obtuvo todos las sesiones');
	// Print sessions in json format
	return okResponse('sesiones obtenidas', { sessions });
};

const getRemainingSessions = async spec => {
	let sessions = await Sessions.find({
		specialist: spec,
	}).populate('specialist user');

	sessions = sessions.flatMap(item => {
		let name = '';
		let lastName = '';

		// Establece nombre de quien pertenece cada sesion, verificando si existe el usuario y su id
		if (item.user && item.user._id) {
			name = item.user.name;
			lastName = item.user.lastName ? item.user.lastName : '';
		} else {
			name = 'Compromiso privado';
			lastName = '';
		}

		// Retorna el plan con las sesiones restantes
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

// Reprogramación sesiones para psicologos
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
	).populate('specialist user');

	/*session = getLastSessionFromPlan(session, id, planId); 
 
	const date = dayjs.tz(dayjs(session.date)).format(); 
	const lastSession = dayjs.tz(dayjs(session.lastSession)).format(); 
 
	//En caso de cancelar una sesión, cambiará a fecha de expiración si las sesiones restantes eran 0 
	//y la fecha de lasesión cancelada sea igual que la fecha de la ultima sesión (sesión cuando expirá actualmente) 
	if ( 
		session.remainingSessions === 0 && 
		new Date(date).getTime() === new Date(lastSession).getTime() 
	) { 
		const expiration = dayjs.tz(dayjs(session.datePayment) 
			.add(1, 'months')) 
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

	// Considera que el usuario es psicologo
	const sessions = await Sessions.find({
		specialist: cancelSessions[0].specialist._id,
	}).populate('specialist user');

	// Se verifica si es un compromiso privado
	if (cancelSessions.user === null) {
		await mailServiceReminder.sendCancelCommitment(
			cancelSessions.specialist
		);
	} else {
		await mailServiceReminder.sendCancelSessionSpec(
			cancelSessions.user,
			cancelSessions.specialist
		);
		await mailServiceReminder.sendCancelSessionUser(
			cancelSessions.user,
			cancelSessions.specialist
			//sessionCancel.plan[0].session[0].date
		);
	}

	return okResponse('Sesion cancelada', {
		sessions: setSession(user.role, sessions),
	});
};

const checkPlanTask = async () => {
	// Busca todos los usuarios, filtra los que tienen planes, los recorre y verifica si el plan está vencido
	let allUsers = await User.find();
	let planUsers = allUsers.filter(user => user.plan.length > 0);
	planUsers.forEach(async userWithPlan => {
		let foundUser = await User.findById(userWithPlan._id);
		foundUser.plan.forEach(plan => {
			if (dayjs().isAfter(dayjs(plan.expiration))) {
				plan.status = 'expired';
			}
		});
		foundUser.save();
	});

	return okResponse('ok');
};

/**
 * @description Función que crea un plan para un usuario
 * @param {String} payload.paymentPeriod - Indica el tiempo de la suscripcion
 * @param {String} payload.title - Nombre del plan
 * @param {Number} payload.price - Precio del plan
 * @param {String} payload.coupon - Cupon usado, caso contrario es ''
 * @param {ObjectId} payload.user - Id del user
 * @param {ObjectId} payload.specialist - Id del psicologo
 * @returns
 */

const createPlan = async ({ payload }) => {
	if (payload.user === payload.specialist && payload.price !== 0) {
		return conflictResponse('No puedes suscribirte a ti mismo');
	}
	// Válido MM/DD/YYYY HH:mm
	const date = `${payload.date} ${payload.start}`;
	const specialist = await Specialist.findById(payload.specialist);
	const minimumNewSession = specialist.preferences.minimumNewSession;

	// Verifica que la fecha de la sesión despues de la fecha actual según la preferencia del psicologo
	if (
		!specialist.inmediateAttention.activated &&
		dayjs().isAfter(
			dayjs
				.tz(dayjs(date, 'MM/DD/YYYY HH:mm'))
				.subtract(minimumNewSession, 'hours')
		)
	) {
		return conflictResponse(
			'No se puede agendar, se excede el tiempo de anticipación de la reserva'
		);
	}
	// Se inicializa la cantidad de sesiones y su expiración
	let sessionQuantity = 0;
	let expirationDate = '';

	if (payload.paymentPeriod == 'Pago semanal') {
		sessionQuantity = 1;
		expirationDate = dayjs
			.tz(
				dayjs(date, 'MM/DD/YYYY HH:mm')
					.add(50, 'minutes')
					.add(3, 'hours')
			)
			.format();
	}
	if (payload.paymentPeriod == 'Pago mensual') {
		sessionQuantity = 4;
		expirationDate = dayjs
			.tz(
				dayjs()
					.add(2, 'months')
					.add(3, 'hours')
			)
			.format();
	}
	if (payload.paymentPeriod == 'Pago trimestral') {
		sessionQuantity = 12;
		expirationDate = dayjs
			.tz(
				dayjs()
					.add(6, 'months')
					.add(3, 'hours')
			)
			.format();
	}

	// Se crea la primera sesión
	const newSession = {
		date,
		sessionNumber: 1,
		paidToSpecialist: false,
	};
	const foundCoupon = await Coupon.findOne({ code: payload.coupon });

	// Se genera un código aleatorio para el token de pago
	const randomCode = () => {
		return Math.random()
			.toString(36)
			.substring(2);
	};
	const token = randomCode() + randomCode();

	let price = payload.price < 0 ? 0 : payload.price;
	// Si se encuentra un cupon y el tipo de descuento es estático, se asgina el valor del cupon al precio
	if (foundCoupon && foundCoupon.discountType === 'static')
		price = payload.originalPrice;

	// Se crea el plan
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

	// Se busca en Sessions un documento con el usuario y el psicologo, además genera la sala
	const userSessions = await Sessions.findOne({
		user: payload.user,
		specialist: payload.specialist,
	});

	const roomId = crypto
		.createHash('sha256')
		.update(`${payload.user}${payload.specialist}`)
		.digest('hex');

	const url =
		payload.title !== 'Acompañamiento vía mensajería'
			? `${room}room/${roomId}`
			: '';

	// Se verifica que el precio sea mayor a cero y que el usuario no sea el mismo que el psicologo
	if (payload.price > 0 && payload.user !== payload.specialist) {
		// Se asigna el psicologo al usuario
		await User.findByIdAndUpdate(payload.user, {
			$set: {
				specialist: payload.specialist,
			},
		});
		// Se hace el trakeo en segment
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
			userId: payload.specialist.toString(),
			event: 'spec-new-plan',
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

	// Recorre los planes verificando si el usuario ya tiene un plan activo
	if (
		userPlans.some(sessions => {
			return sessions.plan.some(
				plan =>
					plan.payment === 'success' &&
					dayjs().isBefore(dayjs(plan.expiration)) &&
					plan.title !== 'Plan inicial' &&
					sessions.specialist.toString() !== payload.specialist
			);
		})
	)
		return conflictResponse('El usuario ya tiene un plan vigente');
	else {
		// Si se encontró un docuemnto, se agrega el nuevo plan con la URL de la sala
		if (userSessions) {
			created = await Sessions.findOneAndUpdate(
				{ user: payload.user, specialist: payload.specialist },
				{ $push: { plan: newPlan }, $set: { roomsUrl: url } },
				{ new: true }
			);
		} else {
			created = await Sessions.create({
				user: payload.user,
				specialist: payload.specialist,
				plan: [newPlan],
				roomsUrl: url,
			});
		}
	}

	// Hace el trakeo en segment
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
				timestamp: dayjs.tz().format(),
				total: payload.price / sessionQuantity,
			},
		});
		analytics.track({
			userId: payload.specialist.toString(),
			event: 'current-spec-new-plan',
			properties: {
				products: planData,
				user: payload.user._id,
				order_id: created.plan[created.plan.length - 1]._id.toString(),
				timestamp: dayjs.tz().format(),
			},
		});
	}

	// Si se encontró un cupon, se hace el descuento
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

	// Si el precio es menor o igual a cero quiere decir que es un plan gratuito
	if (payload.price <= 0) {
		await mercadopagoService.successPay({
			sessionsId: created._id.toString(),
			planId: created.plan.pop()._id.toString(),
		});
	} else {
		// Se crea el pago en mercadopago
		const user = await User.findById(payload.user);
		const plan = created.plan.pop();
		const mercadopagoPayload = {
			specialist: specialist.username,
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
		await Email.create({
			sessionDate: dayjs.tz(dayjs(created.date).add(3, 'hours')).format(),
			wasScheduled: false,
			type: 'reminder-payment-hour',
			queuedAt: null,
			scheduledAt: null,
			userRef: user._id,
			specRef: specialist._id,
			sessionRef: created._id,
		});
		await Email.create({
			sessionDate: dayjs.tz(dayjs(created.date).add(3, 'hours')).format(),
			wasScheduled: false,
			type: 'reminder-payment-day',
			queuedAt: null,
			scheduledAt: null,
			userRef: user._id,
			specRef: specialist._id,
			sessionRef: created._id,
		});
		await Email.create({
			sessionDate: dayjs.tz(dayjs(created.date).add(3, 'hours')).format(),
			wasScheduled: false,
			type: 'promocional-incentive-week',
			queuedAt: null,
			scheduledAt: null,
			userRef: user._id,
			specRef: specialist._id,
			sessionRef: created._id,
		});
	}

	return okResponse('Plan y preferencias creadas', responseBody);
};

/**
 * @description Crea una sesion nueva.
 * @param {Object} userLogged - user logged
 * @param {ObjectId} payload.id - Id sessions
 * @param {ObjectId} payload.idPlan - Id plan
 * @param {Object} payload - datos para guardar
 * @returns sessions actualizada
 */

//Nueva sesion agendada correo (sin pago de sesión) para ambos
const createSession = async (userLogged, id, idPlan, payload) => {
	const { specialist, plan, roomsUrl } = await Sessions.findOne({
		_id: id,
	}).populate('specialist');

	const minimumNewSession = specialist.preferences.minimumNewSession;
	// Comprobar si la fecha es posterior a la fecha actual más el tiempo mínimo
	if (
		dayjs().isAfter(
			dayjs
				.tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm'))
				.subtract(minimumNewSession, 'hours')
		)
	) {
		return conflictResponse(
			'No se puede agendar, se excede el tiempo de anticipación de la reserva'
		);
	}

	// Se encuentra el plan indicado, y se verifica si está pagado
	const myPlan = plan.filter(
		plan => plan._id.toString() === idPlan.toString()
	)[0];

	if (myPlan.payment !== 'success')
		return conflictResponse('No puedes agendar un plan sin pagar');

	// Se busca el plan, se ingresa la cantidad de sesiones restantes e información con respecto al nuevo plan
	let sessions = await Sessions.findOneAndUpdate(
		{ _id: id, 'plan._id': idPlan },
		{
			$set: {
				'plan.$.remainingSessions': payload.remainingSessions,
			},
			$push: { 'plan.$.session': payload },
		},
		{ new: true }
	).populate('specialist user');

	// Si no quedan sesiones por agendar, se obtiene la ultima sesion del plan
	if (payload.remainingSessions === 0) {
		let session = getLastSessionFromPlan(sessions, '', idPlan);
		const expiration = dayjs
			.tz(
				dayjs(session.lastSession)
					.add(50, 'minutes')
					.add(3, 'hours')
			)
			.format();
		// La nueva expiración es la fecha de la ultima sesion del plan + 50 minutos
		sessions = await Sessions.findOneAndUpdate(
			{ _id: id, 'plan._id': idPlan },
			{
				$set: {
					'plan.$.expiration': expiration,
				},
			}
		).populate('specialist user');
	}

	// Se hace el trackeo en segment
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
				userspecId: id,
				email: userLogged.email,
			},
		});
		const getUser = await User.findOne({ email: specialist.email });
		const userID = getUser._id;
		analytics.track({
			userId: userID.toString(),
			event: 'spec-new-session',
			properties: {
				user: userLogged._id,
				planId: idPlan,
				userspecId: id,
			},
		});
	}
	await mailServiceSchedule.sendScheduleToUser(
		userLogged,
		specialist,
		dayjs.tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm')).format(),
		roomsUrl,
		`${myPlan.totalSessions - payload.remainingSessions}/${myPlan.totalSessions
		}`
	);
	await mailServiceSchedule.sendScheduleToSpec(
		userLogged,
		specialist,
		dayjs.tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm')).format(),
		roomsUrl,
		`${myPlan.totalSessions - payload.remainingSessions}/${myPlan.totalSessions
		}`
	);

	// Se filtra el plan para obtener el id de la ultima sesion
	let planFiltered = sessions.plan.filter(plan => plan._id == idPlan)[0];

	let idSessionUltimate =
		planFiltered.session[sessions.plan[0].session.length - 1]._id;

	// Email scheduling for appointment reminder for the user
	await Email.create({
		sessionDate: dayjs
			.tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(3, 'hours'))
			.format(),
		wasScheduled: false,
		type: 'reminder-user-hour',
		queuedAt: undefined,
		scheduledAt: undefined,
		userRef: userLogged._id,
		specRef: specialist._id,
		sessionRef: idSessionUltimate,
		url: roomsUrl,
	});
	await Email.create({
		sessionDate: dayjs
			.tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(3, 'hours'))
			.format(),
		wasScheduled: false,
		type: 'reminder-user-day',
		queuedAt: undefined,
		scheduledAt: undefined,
		userRef: userLogged._id,
		specRef: specialist._id,
		sessionRef: idSessionUltimate,
		url: roomsUrl,
	});
	// Email scheduling for appointment reminder for the specialist
	await Email.create({
		sessionDate: dayjs
			.tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(3, 'hours'))
			.format(),
		wasScheduled: false,
		type: 'reminder-spec-hour',
		queuedAt: undefined,
		scheduledAt: undefined,
		userRef: userLogged._id,
		specRef: specialist._id,
		sessionRef: idSessionUltimate,
		url: roomsUrl,
	});
	await Email.create({
		sessionDate: dayjs
			.tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(3, 'hours'))
			.format(),
		wasScheduled: false,
		type: 'reminder-spec-day',
		queuedAt: undefined,
		scheduledAt: undefined,
		userRef: userLogged._id,
		specRef: specialist._id,
		sessionRef: idSessionUltimate,
		url: roomsUrl,
	});

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
		if (user.role !== 'specialist')
			return conflictResponse('No eres psicologo');
		let sessions = [];
		let hours = 1;

		// Se comprueba si es una sesion de compromiso
		if (payload.dateEnd && payload.type === 'compromiso privado') {
			const start = dayjs
				.tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm'))
				.format();
			const end = dayjs
				.tz(dayjs(payload.dateEnd, 'MM/DD/YYYY HH:mm'))
				.format();
			hours = Math.abs(end.diff(start, 'hours')) + 1;
		}

		// Objeto con la sesion a crear
		for (let i = 0; i < hours; i++) {
			const date = dayjs.tz(
				dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(i, 'hours')
			);
			const newSession = {
				date: date.format('MM/DD/YYYY HH:mm'),
				sessionNumber: i + 1,
				paidToSpecialist: false,
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
			expiration: dayjs
				.tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(1, 'week'))
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
				specialist: user.specialist,
			},
			{
				$pull: {
					plan: { title: 'Plan inicial' },
				},
			}
		);

		// Creamos la direccion de la sala de videollamadas
		const roomId = crypto
			.createHash('sha256')
			.update(`${payload.user}${payload.specialist}`)
			.digest('hex');

		// creamos o actualizamos las sesiones entre el usuario y el psicologo
		// cuando se crea compromiso privado el user será null
		const updatedSession = await Sessions.findOneAndUpdate(
			{
				user: payload.user,
				specialist: user.specialist,
			},
			{
				user: payload.user,
				specialist: user.specialist,
				$push: { plan: newPlan },
				roomsUrl: payload.user ? `${room}room/${roomId}` : '',
			},
			{ upsert: true, new: true }
		).populate('user specialist');

		// Correo de compromiso privado
		if (payload.type === 'compromiso privado')
			await mailServiceReminder.sendCustomSessionCommitment(
				updatedSession.specialist
			);

		// Validamos precio y que exista user(recordemos que user es null en compromiso privado)
		if (payload.price && payload.price > 0 && payload.user) {
			const {
				data,
			} = await mercadopagoService.createCustomSessionPreference({
				userId: payload.user,
				specId: user.specialist,
				planId: updatedSession.plan[updatedSession.plan.length - 1]._id,
			});
			if (payload.type === 'sesion online') {
				// Enviamos email al user con el link para pagar
				await mailServiceSchedule.sendCustomSessionToUser(
					updatedSession.user,
					updatedSession.specialist,
					data.init_point,
					payload.date,
					payload.price,
					'online'
				);
				await mailServiceSchedule.sendCustomSessionToSpec(
					updatedSession.user,
					updatedSession.specialist,
					data.init_point,
					payload.date,
					payload.price,
					'online'
				);
			}
			if (payload.type === 'sesion presencial') {
				await mailServiceSchedule.sendCustomSessionToUser(
					updatedSession.user,
					updatedSession.specialist,
					data.init_point,
					payload.date,
					payload.price,
					'presencial'
				);
				await mailServiceSchedule.sendCustomSessionToSpec(
					updatedSession.user,
					updatedSession.specialist,
					data.init_point,
					payload.date,
					payload.price,
					'presencial'
				);
			}
		}
		// Se hace el trakeo en segment
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
					event: 'spec-scheduled-user-session',
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
					event: 'spec-scheduled-onsite-user-session',
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
					event: 'spec-scheduled-private-hours',
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

const getFormattedSessionsForMatch = async idSpecialist => {
	let sessions = [];
	// obtenemos el psicologo
	const specialist = await Specialist.findById(idSpecialist).select(
		'_id schedule preferences inmediateAttention'
	);
	// creamos un array con la cantidad de dias
	const length = Array.from(Array(31), (_, x) => x);
	// creamos un array con la cantidad de horas
	const hours = Array.from(Array(24), (_, x) =>
		dayjs
			.tz()
			.hour(x)
			.minute(0)
			.format('HH:mm')
	);
	// Obtenemos sessiones del psicologo
	let specSessions = await Sessions.find({
		specialist: idSpecialist,
	});

	// Filtramos que cada session sea de usuarios con pagos success y no hayan expirado
	specSessions = specSessions.filter(item =>
		item.plan.some(plan => {
			return (
				plan.payment === 'success' &&
				dayjs().isBefore(dayjs(plan.expiration))
			);
		})
	);

	// Formato de array debe ser [date, date, ...date]
	const daySessions = specSessions
		.flatMap(item => {
			return item.plan.flatMap(plan => {
				return plan.session.length
					? plan.session.map(session => session.date)
					: [];
			});
		})
		.filter(date => dayjs(date, 'MM/DD/YYYY HH:mm').isSameOrAfter(dayjs()));
	let minimumNewSession = dayjs
		.tz(dayjs().add(specialist.preferences.minimumNewSession, 'h'))
		.format();

	sessions = length.map(el => {
		const day = dayjs.tz(dayjs().add(el, 'days'));
		const temporal = dayjs.tz(day).format('L');

		return {
			id: el,
			value: day.format(),
			day: day.format('DD MMM'),
			date: day.format('L'),
			text: day.format(),
			available: hours.filter(hour => {
				return (
					dayjs
						.tz(dayjs(`${temporal} ${hour}`, 'MM/DD/YYYY HH:mm'))
						.isAfter(dayjs.tz(minimumNewSession)) &&
					formattedSchedule(specialist.schedule, day, hour) &&
					!daySessions.some(
						date =>
							dayjs(date, 'MM/DD/YYYY HH:mm').format('L') ===
								dayjs(day).format('L') &&
							hour ===
								dayjs(date, 'MM/DD/YYYY HH:mm').format('HH:mm')
					)
				);
			}),
		};
	});
	return sessions;
};

//type: será el tipo de calendario que debe mostrar (agendamiento o reagendamiento)
// Utilizado para traer las sessiones de un psicologo para el selector
const getFormattedSessions = async (idSpecialist, type) => {
	let sessions = [];
	// Obtenemos el psicologo
	const specialist = await Specialist.findById(idSpecialist).select(
		'_id schedule preferences inmediateAttention'
	);
	// Creamos un array con la cantidad de dias
	const length = Array.from(Array(31), (_, x) => x);
	// Creamos un array con la cantidad de horas
	const hours = Array.from(Array(24), (_, x) =>
		dayjs
			.tz()
			.hour(x)
			.minute(0)
			.format('HH:mm')
	);
	// Obtenemos sessiones del psicologo
	let specSessions = await Sessions.find({
		specialist: idSpecialist,
	});

	// Filtramos que cada session sea de usuarios con pagos success y no hayan expirado
	specSessions = specSessions.filter(item =>
		item.plan.some(plan => {
			return (
				plan.payment === 'success' &&
				dayjs().isBefore(dayjs(plan.expiration))
			);
		})
	);

	// Formato de array debe ser [date, date, ...date]
	const daySessions = specSessions
		.flatMap(item => {
			return item.plan.flatMap(plan => {
				return plan.session.length
					? plan.session.map(session => session.date)
					: [];
			});
		})
		.filter(date => dayjs(date, 'MM/DD/YYYY HH:mm').isSameOrAfter(dayjs()));

	// Veificamos el tipo de calendario que se debe mostrar
	let minimumNewSession = 0;
	if (type === 'schedule')
		minimumNewSession = dayjs
			.tz(dayjs().add(specialist.preferences.minimumNewSession, 'h'))
			.format();
	else if (type === 'reschedule')
		minimumNewSession = dayjs
			.tz(
				dayjs().add(
					specialist.preferences.minimumRescheduleSession,
					'h'
				)
			)
			.format();

	// Se obtiene la disponibilidad del psicologo
	sessions = length.map(el => {
		const day = dayjs.tz(dayjs().add(el, 'days'));
		const temporal = dayjs.tz(day).format('L');

		return {
			id: el,
			value: day.format(),
			day: day.format('DD MMM'),
			date: day.format('L'),
			text: day.format(),
			available: hours.filter(hour => {
				return (
					dayjs
						.tz(dayjs(`${temporal} ${hour}`, 'MM/DD/YYYY HH:mm'))
						.isAfter(dayjs.tz(minimumNewSession)) &&
					formattedSchedule(specialist.schedule, day, hour) &&
					!daySessions.some(
						date =>
							dayjs(date, 'MM/DD/YYYY HH:mm').format('L') ===
								dayjs(day).format('L') &&
							hour ===
								dayjs(date, 'MM/DD/YYYY HH:mm').format('HH:mm')
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
	let specialist = [];
	if (ids && Array.isArray(ids) && ids.length) {
		specialist = await Specialist.find({ _id: { $in: ids } }).select(
			'schedule preferences inmediateAttention'
		);
	} else
		specialist = await Specialist.find({}).select(
			'schedule preferences inmediateAttention'
		);
	// Para que nos de deje modificar el array de mongo
	specialist = JSON.stringify(specialist);
	specialist = JSON.parse(specialist);

	// creamos un array con la cantidad de dias
	const length = Array.from(Array(31), (_, x) => x);
	// creamos un array con la cantidad de horas
	const hours = Array.from(Array(24), (_, x) =>
		dayjs
			.tz()
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
				dayjs(date, 'MM/DD/YYYY HH:mm').isSameOrAfter(dayjs())
			);

	// Obtenemos sessiones del psicologo
	let allSessions = await Sessions.find({}).populate(
		'specialist',
		'_id schedule preferences inmediateAttention'
	);

	// Filtramos que cada session sea de usuarios con pagos success y no hayan expirado
	allSessions = allSessions.filter(item =>
		item.plan.some(plan => {
			return (
				plan.payment === 'success' &&
				dayjs().isBefore(dayjs(plan.expiration))
			);
		})
	);

	// Mapeamos los psicologos para agregarle las sessiones filtrando por psicologo
	allSessions = specialist.map(item => ({
		...item,
		sessions: setDaySessions(
			allSessions.filter(
				element =>
					element.specialist._id.toString() === item._id.toString()
			)
		),
	}));

	// Obtenemos la disponibilidad de todos los psicolgos
	sessions = allSessions.map(item => {
		const minimumNewSession = dayjs
			.tz(dayjs().add(item.preferences.minimumNewSession, 'h'))
			.format();
		let schedule = item.schedule;

		return {
			specialist: item._id,
			sessions: length.map(el => {
				const day = dayjs.tz(dayjs().add(el, 'days'));
				const temporal = dayjs.tz(day).format('L');
				return {
					specialist: item._id,
					value: day.format(),
					day: day.format('DD MMM'),
					date: day.format('L'),
					text: day.format(),
					available: hours.filter(hour => {
						return (
							dayjs
								.tz(
									dayjs(
										`${temporal} ${hour}`,
										'MM/DD/YYYY HH:mm'
									)
								)
								.isAfter(dayjs.tz(minimumNewSession)) &&
							formattedSchedule(schedule, day, hour) &&
							!item.sessions.some(
								date =>
									dayjs(date, 'MM/DD/YYYY HH:mm').format(
										'L'
									) === temporal &&
									hour ===
										dayjs(date, 'MM/DD/YYYY HH:mm').format(
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
	if (user.role != 'specialist')
		return conflictResponse('No eres psicologo');

	const payments = await paymentInfoFunction(user.specialist);
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
	// Se obtiene la session a reprogramar, se obtiene el tiempo minimo para reprogramar
	let currentSession = await Sessions.findOne({
		_id: sessionsId,
	}).populate('specialist', 'preferences');
	const {
		minimumRescheduleSession,
	} = currentSession.specialist.preferences;

	// Se obtiene las sessiones del plan, luego se filtra la session a reprogramar
	currentSession = currentSession.plan
		.flatMap(plan => {
			return plan.session;
		})
		.filter(s => s._id.toString() === id.toString())[0];

	// Si la session esta programada despues de la fecha actual quitando el tiempo minimo para reprogramar
	if (
		dayjs().isAfter(
			dayjs(currentSession.date, 'MM/DD/YYYY HH:mm').subtract(
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

	// Se le da formato a la fecha nueva, se actualiza la fecha de la session
	const date = `${newDate.date} ${newDate.hour}`;
	newDate.date = dayjs
		.tz(dayjs(newDate.date, 'MM/DD/YYY'))
		.format('DD/MM/YYYY');
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
	).populate('specialist user');

	// Se obtiene la ultima session del plan y se verifica si existen sessiones pendientes
	let session = getLastSessionFromPlan(sessions, id, '');

	if (session.remainingSessions === 0) {
		// Si no existen sessiones pendientes, se da fecha de expiracion a la session 50 minutos despues de la ultima session
		const expiration = dayjs
			.tz(
				dayjs(session.lastSession, 'YYYY/MM/DD HH:mm')
					.add(50, 'minutes')
					.add(3, 'hours')
			)
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

	// Se envia correo de reprogramacion
	if (userLogged.role === 'user') {
		await mailServiceSchedule.sendRescheduleToUser(
			sessions.user,
			sessions.specialist,
			newDate
		);
		await mailServiceSchedule.sendRescheduleToSpec(
			sessions.user,
			sessions.specialist,
			newDate,
			sessions.roomsUrl
		);
	} else {
		await mailServiceSchedule.sendRescheduleToUserBySpec(
			sessions.user,
			sessions.specialist,
			newDate,
			sessions.roomsUrl
		);
		await mailServiceSchedule.sendRescheduleToSpecBySpec(
			sessions.user,
			sessions.specialist,
			newDate,
			sessions.roomsUrl
		);
	}
	// Se les cambia la fecha de la sesión a los correos de recordatorio
	const mailsToReprogram = await Email.find({
		type: {
			$in: [
				'reminder-user-day',
				'reminder-user-hour',
				'reminder-spec-day',
				'reminder-spec-hour',
			],
		},
		userRef: sessions.user._id,
		specRef: sessions.specialist._id,
		sessionRef: id,
	});
	if (mailsToReprogram.length) {
		mailsToReprogram.forEach(async mail => {
			await Email.findByIdAndUpdate(mail._id, {
				sessionDate: dayjs(date, 'MM/DD/YYYY HH:mm').format(
					'ddd, DD MMM YYYY HH:mm:ss ZZ'
				),
				wasScheduled: false,
				scheduledAt: null,
			}).catch(err => console.log(err));
		});
	}

	// Se hace el trackeo de la reprogramacion en segment
	if (
		process.env.API_URL.includes('hablaqui.cl') ||
		process.env.DEBUG_ANALYTICS === 'true'
	) {
		analytics.track({
			userId: userLogged._id.toString(),
			event: 'user-reschedule-session',
			properties: {
				user: userLogged._id,
				specialistId: sessions.specialist._id.toString(),
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

const deleteCommitment = async (planId, specId) => {
	// Se busca si existe el psicologo
	const spec = await Specialist.findById(specId);
	if (!spec) {
		return conflictResponse('No existe el psicólogo');
	}
	// Se busca en mongo y borra la session agendada del plan
	const updatedSessions = await Sessions.findOneAndUpdate(
		{
			specialist: spec._id,
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

// Devuelve todas las sesiones, excepto las expiradas
const getAllSessions = async spec => {
	// Obtenemos solamente las sesiones que no han expirado, se filtran las sesiones
	// que no sean compromisos, y se suman la cantidad de sesiones restantes
	const sessions = await getAllSessionsFunction(spec);
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

const paymentsInfoFromId = async spec => {
	// Se obtienen los pagos de las sesiones
	const user = await Specialist.findById(spec);
	if (!user) return conflictResponse('No es psicologo');
	const payments = await paymentInfoFunction(spec);
	return okResponse('Obtuvo todo sus pagos', { payments });
};

const getAllSessionsFormatted = async () => {
	// Se obtienen todas las sessiones de mongo
	const sessions = await Sessions.find().populate('specialist user');
	if (!sessions) {
		return conflictResponse('No hay sesiones');
	}
	// Se formatean las sesiones para que se puedan mostrar en el front
	const formattedSessions = sessions.flatMap(sessionDocument => {
		if (sessionDocument.plan.length == 0) {
			return;
		}
		return sessionDocument.plan.flatMap(plan => {
			if (plan.session.length == 0) {
				return;
			}
			const lastNameUser = !sessionDocument.user.lastName
				? ''
				: ' ' + sessionDocument.user.lastName;
			const lastNameSpec = !sessionDocument.specialist.lastName
				? ''
				: ' ' + sessionDocument.specialist.lastName;

			return plan.session.flatMap(session => {
				// Se retorna un objeto con los datos que se quieren mostrar
				return {
					date: dayjs(session.date).format('DD/MM/YYYY HH:mm'),
					sessionNumber: session.sessionNumber,
					specialist:
						sessionDocument.specialist.name + lastNameSpec,
					user: sessionDocument.user.name + lastNameUser,
					totalSessions: plan.totalSessions,
					userPhone: sessionDocument.user.phone,
					specialistPhone: sessionDocument.specialist.phone,
					emailUser: sessionDocument.user.email,
					emailSpecialist: sessionDocument.specialist.email,
					statusSession: session.status,
					expirationPlan: dayjs(plan.expiration).format(
						'DD/MM/YYYY'
					),
					paymentPlan: plan.payment,
				};
			});
		});
	});
	// Se retorna una respuesta con las sesiones formateadas
	return okResponse('Sesiones obtenidas', { formattedSessions });
};

const sessionsService = {
	getSessions,
	getRemainingSessions,
	cancelSession,
	checkPlanTask,
	createPlan,
	createSession,
	customNewSession,
	getFormattedSessionsForMatch,
	getFormattedSessions,
	formattedSessionsAll,
	paymentsInfo,
	reschedule,
	updateSessions,
	deleteCommitment,
	getAllSessions,
	paymentsInfoFromId,
	getAllSessionsFormatted,
};

export default Object.freeze(sessionsService);