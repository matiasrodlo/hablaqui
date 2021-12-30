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
			success: `${api_url}api/v1/mercadopago/success-pay/${body.plan}`,
			failure: `${landing_url}/pago/failure-pay`,
			pending: `${landing_url}/pago/pending-pay`,
		},
		auto_return: 'approved',
	};

	const responseBody = await mercadopago.preferences.create(newPreference);
	const resBody = responseBody.body;
	return okResponse('preference created', resBody);
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
			hablaquiFee: 0.2,
			paymentFee: 0.0399,
		},
	];
	return await response.save();
};

const successPay = async params => {
	try {
		const { planId } = params;
		const currentSessions = await Sessions.findById(planId);
		const plan = currentSessions.plan[
			currentSessions.plan.length - 1
		]._id.toString();
		const foundPlan = await Sessions.findOneAndUpdate(
			{
				_id: planId,
				'plan._id': plan,
			},
			{
				$set: {
					'plan.$.payment': 'success',
					'plan.$.datePayment': moment().toISOString(),
				},
			},
			{ new: true }
		);
		const sessionData =
			foundPlan.plan[foundPlan.plan.length - 1].session[0];
		const originalDate = sessionData.date.split(' ');
		const date = originalDate[0].split('/');
		const dateFormatted = `${date[2]}-${date[0]}-${date[1]}T${originalDate[1]}:00-03:00`;
		// Email scheduling for appointment reminder for the user
		await email.create({
			sessionDate: dateFormatted,
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
			sessionDate: dateFormatted,
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
		await mailService.sendAppConfirmationUser(user, dateFormatted);
		await mailService.sendAppConfirmationPsy(psy, user, dateFormatted);

		logInfo('Se ha realizado un pago');
		return okResponse('sesion actualizada');
	} catch (err) {
		logInfo(err.stack);
		return conflictResponse('Error al actualizar sesion');
	}
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
		hablaquiFee: 0,
		paymentFee: 0.0399,
		expirationDate,
		price: pricePaid,
		subscriptionPeriod: period,
	};

	const foundPsychologist = await Psychologist.findOneAndUpdate(
		{ _id: psychologistId },
		{ $push: { psyPlans: newPlan } },
		{ new: true }
	);
	return okResponse('plan actualizado', { foundPsychologist });
};

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
				'plan.$.datePayment': moment(),
			},
		},
		{ new: true }
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
	logInfo('el' + JSON.stringify(foundPlan));
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
		hablaquiFee: 0,
		paymentFee: 0.0399,
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
