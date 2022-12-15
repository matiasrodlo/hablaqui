'use strict';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Email from '../../models/email';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

/**
 * @description Funcion que crea los correos electronicos para el recordatorio de la sesion
 * @param {Object} payload - Objeto que debe contener como atributo la fecha de la sesion
 * @param {Object} user - Objeto que contiene la informacion del usuario
 * @param {Object} psy - Objeto que contiene la informacion del psicologo
 * @param {Object} sessions - Documento de la sesion
 * @param {String} roomsUrl - Url de la sala de la sesion
 * @param {String} idPlan - Id del plan de la sesion
 */
export const createReminder = async (
	payload,
	user,
	psy,
	sessions,
	roomsUrl,
	idPlan
) => {
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
		userRef: user._id,
		psyRef: psy._id,
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
		userRef: user._id,
		psyRef: psy._id,
		sessionRef: idSessionUltimate,
		url: roomsUrl,
	});
	// Email scheduling for appointment reminder for the psy
	await Email.create({
		sessionDate: dayjs
			.tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(3, 'hours'))
			.format(),
		wasScheduled: false,
		type: 'reminder-psy-hour',
		queuedAt: undefined,
		scheduledAt: undefined,
		userRef: user._id,
		psyRef: psy._id,
		sessionRef: idSessionUltimate,
		url: roomsUrl,
	});
	await Email.create({
		sessionDate: dayjs
			.tz(dayjs(payload.date, 'MM/DD/YYYY HH:mm').add(3, 'hours'))
			.format(),
		wasScheduled: false,
		type: 'reminder-psy-day',
		queuedAt: undefined,
		scheduledAt: undefined,
		userRef: user._id,
		psyRef: psy._id,
		sessionRef: idSessionUltimate,
		url: roomsUrl,
	});
};

/**
 * @description Funcion que crea los correos electronicos para el recordatorio pago de la sesión
 * @param {Object} user - Objeto que contiene la informacion del usuario
 * @param {Object} psy - Objeto que contiene la informacion del psicologo
 * @param {String} sessions - Objecto de la sesion
 */
export const createPaymentReminder = async (user, psy, sessions) => {
	await Email.create({
		sessionDate: dayjs.tz(dayjs(sessions.date).add(3, 'hours')).format(),
		wasScheduled: false,
		type: 'reminder-payment-hour',
		queuedAt: null,
		scheduledAt: null,
		userRef: user._id,
		psyRef: psy._id,
		sessionRef: sessions._id,
	});
	await Email.create({
		sessionDate: dayjs.tz(dayjs(sessions.date).add(3, 'hours')).format(),
		wasScheduled: false,
		type: 'reminder-payment-day',
		queuedAt: null,
		scheduledAt: null,
		userRef: user._id,
		psyRef: psy._id,
		sessionRef: sessions._id,
	});
	await Email.create({
		sessionDate: dayjs.tz(dayjs(sessions.date).add(3, 'hours')).format(),
		wasScheduled: false,
		type: 'promocional-incentive-week',
		queuedAt: null,
		scheduledAt: null,
		userRef: user._id,
		psyRef: psy._id,
		sessionRef: sessions._id,
	});
};
