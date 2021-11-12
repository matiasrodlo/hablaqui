'use strict';

import { errorCallback } from '../utils/functions/errorCallback';
import mercadopago from 'mercadopago';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import Psychologist from '../models/psychologist';
import { logInfo } from '../config/pino';
import { api_url, landing_url, mercadopago_key } from '../config/dotenv';
import psychologistService from './psychologist';
import recruitmentService from './recruitment';
import User from '../models/user';
import email from '../models/email';
import mailService from './mail';
import Sessions from '../models/sessions';
import moment from 'moment';

mercadopago.configure({
	access_token: mercadopago_key,
});

const createPreference = async (body, res) => {
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
	return okResponse('preference created', { resBody });
};
const createPsychologistPreference = async (body, res) => {
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
			success: `${api_url}api/v1/mercadopago/psychologist-pay/${body.psychologist}?period=${body.period}`,
			failure: `${landing_url}/pago/failure-pay`,
			pending: `${landing_url}/pago/pending-pay`,
		},
		auto_return: 'approved',
	};

	const responseBody = await mercadopago.preferences.create(newPreference);
	const resBody = responseBody.body;
	return okResponse('preference created', { resBody });
};

const successPay = async params => {
	const { planId } = params;
	const foundPlan = await Sessions.findById(planId);
	foundPlan.plan[foundPlan.plan.length - 1].payment = 'success';
	await foundPlan.save();

	const sessionData = foundPlan.plan[foundPlan.plan.length - 1].session[0];
	const originalDate = sessionData.date.split(' ');
	const date = originalDate[0].split('/');
	const dateFormatted = `${date[2]}-${date[0]}-${date[1]}T${originalDate[1]}:00-03:00`;
	// Email scheduling for appointment reminder for the user
	await email.create({
		mailgunId: undefined,
		sessionDate: dateFormatted,
		wasScheduled: false,
		type: 'reminder-user',
		queuedAt: undefined,
		scheduledAt: undefined,
		userRef: foundPlan.userRef,
		psyRef: foundPlan.psyRef,
		sessionRef: sessionData._id,
	});
	// Email scheduling for appointment reminder for the psychologist
	await email.create({
		mailgunId: undefined,
		sessionDate: dateFormatted,
		wasScheduled: false,
		type: 'reminder-psy',
		queuedAt: undefined,
		scheduledAt: undefined,
		userRef: foundPlan.userRef,
		psyRef: foundPlan.psyRef,
		sessionRef: sessionData._id,
	});
	const user = await User.findById(foundPlan.userRef);
	const psy = await Psychologist.findById(foundPlan.psyRef);
	// Send appointment confirmation for user and psychologist
	await mailService.sendAppConfirmationUser(user, dateFormatted);
	await mailService.sendAppConfirmationPsy(psy, user, dateFormatted);

	logInfo('Se ha realizado un pago');
	return okResponse('sesion actualizada');
};

const psychologistPay = async (params, query) => {
	const { psychologistId } = params;
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

	const foundPsychologist = await Psychologist.findOneAndUpdate(
		{ _id: psychologistId },
		{ $push: { myPlans: newPlan } },
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
			$set: { 'plan.$.payment': 'success' },
		},
		{ new: true }
	);
	return okResponse('plan actualizado', { body: updatePlan });
};

const createCustomSessionPreference = async (userId, psyId, planId) => {
	let foundSession = await Sessions.findOne({
		user: userId,
		psychologist: psyId,
	});

	let foundPlan = foundSession.plan.filter(e => e._id == planId);
	logInfo(foundPlan[0].totalPrice);
	let newPreference = {
		items: [
			{
				title: 'Sesion personalizada',
				description: 'Sesion personalizada creada por psicologo',
				currency_id: 'CLP',
				unit_price: foundPlan[0].totalPrice,
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
	return okResponse('preference created', { resBody });
};

const createRecruitedPreference = async (body, res) => {
	let newPreference = {
		items: [
			{
				title: 'Plan Premium de Hablaqui',
				description: 'Plan Premium de Hablaqui',
				currency_id: 'CLP',
				unit_price: Number(body.price),
				quantity: 1,
			},
		],
		back_urls: {
			success: `${api_url}api/v1/mercadopago/recruited-pay/${body.recruitment}?period=${body.period}`,
			failure: `${landing_url}/pago/failure-pay`,
			pending: `${landing_url}/pago/pending-pay`,
		},
		auto_return: 'approved',
	};

	const responseBody = await mercadopago.preferences.create(newPreference);
	const resBody = responseBody.body;
	return okResponse('preference created', { resBody });
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
	createRecruitedPreference,
	successPay,
	psychologistPay,
	recruitedPay,
	createCustomSessionPreference,
	customSessionPay,
};

export default Object.freeze(mercadopagoService);
