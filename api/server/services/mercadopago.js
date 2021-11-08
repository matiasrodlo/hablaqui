'use strict';

import { errorCallback } from '../utils/functions/errorCallback';
import mercadopago from 'mercadopago';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import Psychologist from '../models/psychologist';
import { logInfo } from '../config/pino';
import { api_url, landing_url, mercadopago_key } from '../config/dotenv';
import psychologistService from './psychologist';
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

	let bodyId = '';
	let error = '';
	await mercadopago.preferences
		.create(newPreference)
		.then(res => {
			bodyId = res.body;
		})
		.catch(e => {
			error = e;
		});

	if (error != '') {
		return errorCallback(error, res, 'error creando la preferencia');
	}
	if (bodyId != '') return okResponse('preference created', { body: bodyId });

	return conflictResponse('Ha ocurrido un error');
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

	let bodyId = '';
	let error = '';
	await mercadopago.preferences
		.create(newPreference)
		.then(res => {
			bodyId = res.body;
		})
		.catch(e => {
			error = e;
		});

	if (error != '') {
		return errorCallback(error, res, 'error creando la preferencia');
	}
	if (bodyId != '') return okResponse('preference created', { body: bodyId });

	return conflictResponse('Ha ocurrido un error');
};

const successPay = async params => {
	const { planId } = params;
	const foundPlan = await Sessions.findById(planId);
	foundPlan.plan[foundPlan.plan.length - 1].payment = 'success';
	await foundPlan.save();

	const sessionData = foundPlan.plan[foundPlan.plan.length - 1].session[0];
	const originalDate = sessionData.date.split(' ');
	const splitted = originalDate.split(' ');
	const date = splitted[0].split('/');
	const dateFormatted = `${date[2]}-${date[0]}-${date[1]}T${splitted[1]}:00-03:00`;
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

	const newPlan = {
		name: 'premium',
		hablaquiFee: 0,
		paymentFee: 3.99,
		expirationDate,
	};
	await psychologistService.updatePlan(psychologistId, newPlan);
	return okResponse('plan actualizado');
};
const mercadopagoService = {
	createPreference,
	createPsychologistPreference,
	successPay,
	psychologistPay,
};

export default Object.freeze(mercadopagoService);
