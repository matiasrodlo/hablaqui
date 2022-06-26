'use strict';

import mercadopago from 'mercadopago';
import { okResponse, conflictResponse } from '../utils/responses/functions';
import Psychologist from '../models/psychologist';
import Recruitment from '../models/recruitment';
import { logInfo } from '../config/pino';
import { api_url, landing_url, mercadopago_key } from '../config/dotenv';
import recruitmentService from './recruitment';
import User from '../models/user';
import email from '../models/email';
import mailService from './mail';
import Sessions from '../models/sessions';
import moment from 'moment';
moment.tz.setDefault('America/Santiago');

var Analytics = require('analytics-node');
var analytics = new Analytics(process.env.SEGMENT_API_KEY);

mercadopago.configure({
	access_token: mercadopago_key,
});

const createPreference = async body => {
	let newPreference = {
		items: [
			{
				title: body.description,
				description: body.description,
				currency_id: 'CLP',
				unit_price: Number(body.price),
				quantity: 1,
			},
		],
		back_urls: {
			success: `${landing_url}/dashboard/pagos/success?sessionsId=${body.sessionsId}&planId=${body.planId}&token=${body.token}`,
			// redirection to profile psychologist
			failure: `${landing_url}/${body.psychologist}`,
			pending: `${landing_url}/${body.psychologist}`,
		},
		auto_return: 'approved',
		binary_mode: true,
	};

	const responseBody = await mercadopago.preferences.create(newPreference);
	const resBody = responseBody.body;
	return resBody;
};

/**
 * Casos:
 * 1- postulante o psicologo
 * 2- plan free o premium
 * @param {Object} body
 * @returns {Obeject} payment
 */
const createPsychologistPreference = async body => {
	const id = body.psychologistId || body.recruitedId;
	const isPsychologist = !!body.psychologistId;
	let preference = {};
	if (body.plan === 'premium')
		preference.init_point = await setPlanPremium(body, isPsychologist, id);
	else {
		preference = await setPlanFree(id, isPsychologist);
	}
	return okResponse('Preferecia creada', { preference });
};

const setPlanPremium = async (body, isPsychologist, id) => {
	let newPreference = {
		items: [
			{
				title: body.title,
				description: body.description,
				currency_id: 'CLP',
				unit_price: Number(body.price),
				quantity: 1,
			},
		],
		back_urls: {
			success: `${api_url}api/v1/mercadopago/${
				isPsychologist ? 'psychologist' : 'recruited'
			}-pay/${id}?period=${body.period}`,
			failure: `${landing_url}/pago/failure-pay`,
			pending: `${landing_url}/pago/pending-pay`,
		},
		auto_return: 'approved',
		binary_mode: true,
	};
	const responseBody = await mercadopago.preferences.create(newPreference);
	const resBody = responseBody.body;
	const { init_point } = resBody;
	return init_point;
};

const setPlanFree = async (id, isPsychologist) => {
	let response;
	if (isPsychologist) response = await Psychologist.findById(id);
	else response = await Recruitment.findById(id);

	if (!response)
		return conflictResponse('No se encontró el postulante o psicologo');

	if (response.psyPlans && response.psyPlans.length) {
		const currentPlan = response.psyPlans.pop();
		if (currentPlan.tier === 'free') {
			return okResponse('Ya tienes el plan gratuito');
		} else if (
			currentPlan.tier === 'premium' &&
			moment(currentPlan.expirationDate).isAfter(moment())
		) {
			return okResponse('Tienes un plan premium vigente');
		} else
			response.psyPlans = response.psyPlans.map(item => ({
				...item,
				planStatus: 'expired',
			}));
	}

	if (!response.psyPlans) response.psyPlans = [];
	response.psyPlans = [
		...response.psyPlans,
		{
			tier: 'free',
			paymentStatus: 'success',
			planStatus: 'active',
			expirationDate: '',
			subscriptionPeriod: '',
			price: 0,
		},
	];
	if (
		process.env.API_URL.includes('hablaqui.cl') ||
		process.env.DEBUG_ANALYTICS === 'true'
	) {
		let planData = [
			{
				item_id: 1,
				item_name: 'Plan de psicólogo gratuito',
				item_price: 0,
				item_quantity: 1,
			},
		];
		const userID = User.findOne({ email: response.email })._id;
		analytics.track({
			userId: userID.toString(),
			event: 'psy-free-plan',
			properties: {
				currency: 'CLP',
				products: planData,
				order_id: response.psyPlans[
					response.psyPlans.length - 1
				]._id.toString(),
				total: 0,
			},
		});
	}
	return await response.save();
};

const successPay = async params => {
	const { sessionsId, planId } = params;
	const foundPlan = await Sessions.findOneAndUpdate(
		{
			_id: sessionsId,
			'plan._id': planId,
		},
		{
			$set: {
				'plan.$.payment': 'success',
				'plan.$.datePayment': moment().format(),
			},
		},
		{ new: true }
	);
	const planData = foundPlan.plan.filter(
		plan => plan._id.toString() === planId
	)[0];
	const sessionData = planData.session[0];
	// Email scheduling for appointment reminder for the user
	await email.create({
		sessionDate: moment(sessionData.date, 'MM/DD/YYYY HH:mm'),
		wasScheduled: false,
		type: 'reminder-user',
		queuedAt: undefined,
		scheduledAt: undefined,
		userRef: foundPlan.user,
		psyRef: foundPlan.psychologist,
		sessionRef: sessionData._id,
	});
	// Email scheduling for appointment reminder for the psychologist
	await email.create({
		sessionDate: moment(sessionData.date, 'MM/DD/YYYY HH:mm'),
		wasScheduled: false,
		type: 'reminder-psy',
		queuedAt: undefined,
		scheduledAt: undefined,
		userRef: foundPlan.user,
		psyRef: foundPlan.psychologist,
		sessionRef: sessionData._id,
	});
	const user = await User.findById(foundPlan.user);
	const psy = await Psychologist.findById(foundPlan.psychologist);
	// Send appointment confirmation for user and psychologist
	await mailService.sendAppConfirmationUser(user, psy, planData.totalPrice);
	await mailService.sendAppConfirmationPsy(psy, user, planData.totalPrice);

	await mailService.sendScheduleToUser(
		user,
		psy,
		moment(sessionData.date, 'MM/DD/YYYY HH:mm'),
		foundPlan.roomsUrl,
		`1/${planData.totalSessions}`
	);
	await mailService.sendScheduleToPsy(
		user,
		psy,
		moment(sessionData.date, 'MM/DD/YYYY HH:mm'),
		foundPlan.roomsUrl,
		`1/${planData.totalSessions}`
	);

	logInfo('Se ha realizado un pago');
	return okResponse('Pago aprobado');
};

const psychologistPay = async (params, query) => {
	const { psychologistId } = params;
	const { period } = query;
	let expirationDate;
	if (period === 'anual') {
		expirationDate = moment()
			.add({ months: 12 })
			.toISOString();
	}
	if (period === 'mensual') {
		expirationDate = moment()
			.add({ months: 1 })
			.toISOString();
	}
	const pricePaid = period === 'mensual' ? 69990 : 55900 * 12;
	const newPlan = {
		tier: 'premium',
		paymentStatus: 'success',
		planStatus: 'active',
		expirationDate,
		price: pricePaid,
		subscriptionPeriod: period,
	};

	const foundPsychologist = await Psychologist.findOneAndUpdate(
		{ _id: psychologistId },
		{ $push: { psyPlans: newPlan } },
		{ new: true }
	);
	if (
		process.env.API_URL.includes('hablaqui.cl') ||
		process.env.DEBUG_ANALYTICS === 'true'
	) {
		let planData = [
			{
				item_id: 2,
				item_name: 'Plan de psicólogo premium',
				item_price: pricePaid,
				item_quantity: 1,
			},
		];
		const userID = User.findOne({ email: foundPsychologist.email })._id;
		analytics.track({
			userId: userID.toString(),
			event: 'psy-premium-plan',
			properties: {
				currency: 'CLP',
				products: planData,
				order_id: foundPsychologist.psyPlans[
					foundPsychologist.psyPlans.length - 1
				]._id.toString(),
				total: pricePaid,
			},
		});
	}
	await mailService.sendPsychologistPay(foundPsychologist, period, pricePaid);
	return okResponse('plan actualizado', { foundPsychologist });
};
//Para correo de evento confirmacion de pago
const customSessionPay = async params => {
	const { userId, psyId, planId } = params;
	const updatePlan = await Sessions.findOneAndUpdate(
		{
			'plan._id': planId,
			user: userId,
			psychologist: psyId,
		},
		{
			$set: {
				'plan.$.payment': 'success',
				'plan.$.datePayment': moment().format(),
			},
		},
		{ new: true }
	).populate('psychologist user');
	const plan = updatePlan.plan.filter(
		plan => plan._id.toString() === planId
	)[0];
	await mailService.sendSuccessCustomSessionPaymentPsy(
		updatePlan.user,
		updatePlan.psychologist,
		plan.totalPrice,
		updatePlan.roomsUrl,
		plan.session[0].date
	);
	await mailService.sendSuccessCustomSessionPaymentUser(
		updatePlan.user,
		updatePlan.psychologist,
		plan.totalPrice,
		updatePlan.roomsUrl,
		plan.session[0].date
	);
	return okResponse('plan actualizado', { body: updatePlan });
};

const createCustomSessionPreference = async params => {
	const { userId, psyId, planId } = params;
	const foundPlan = await Sessions.findOne({
		'plan._id': planId,
		user: userId,
		psychologist: psyId,
	});
	const planData = foundPlan.plan[foundPlan.plan.length - 1];
	let newPreference = {
		items: [
			{
				title: 'Sesion personalizada',
				description: 'Sesion personalizada creada por psicologo',
				currency_id: 'CLP',
				unit_price: planData.totalPrice,
				quantity: 1,
			},
		],
		back_urls: {
			success: `${api_url}api/v1/mercadopago/custom-session-pay/${userId}/${psyId}/${planId}`,
			failure: `${landing_url}/pago/failure-pay`,
			pending: `${landing_url}/pago/pending-pay`,
		},
		auto_return: 'approved',
		binary_mode: true,
	};

	const responseBody = await mercadopago.preferences.create(newPreference);
	const resBody = responseBody.body;
	const { init_point } = resBody;
	return okResponse('preference created', { init_point });
};

const recruitedPay = async (params, query) => {
	const { recruitedId } = params;
	const { period } = query;
	let expirationDate;
	if (period == 'anual') {
		expirationDate = moment()
			.add({ months: 12 })
			.toISOString();
	}
	if (period == 'mensual') {
		expirationDate = moment()
			.add({ months: 1 })
			.toISOString();
	}
	const pricePaid = period == 'mensual' ? 39990 : 31920 * 12;
	const newPlan = {
		tier: 'premium',
		expirationDate,
		price: pricePaid,
		subscriptionPeriod: period,
	};
	await recruitmentService.updatePlan(recruitedId, newPlan);
	return okResponse('plan actualizado/creado');
};

const mercadopagoService = {
	createPreference,
	createPsychologistPreference,
	successPay,
	psychologistPay,
	recruitedPay,
	createCustomSessionPreference,
	customSessionPay,
};

export default Object.freeze(mercadopagoService);
