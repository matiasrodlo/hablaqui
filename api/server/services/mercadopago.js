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
				title: body.description,
				description: body.description,
				currency_id: 'CLP',
				unit_price: Number(body.price),
				quantity: 1,
			},
		],
		back_urls: {
			success: `${api_url}api/v1/mercadopago/psychologist-pay/${
				body.psychologistToUpdate
			}/${Number(body.price)}`,
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

	// Aqui necesitas cambiarlo, no se muy bien como funciona el tema de correos.
	// Email scheduling for appointment reminder for the user
	// const sessionData = foundPsychologist.sessions.filter(
	// 	session => session._id.toString() == sessionId
	// )[0];

	// await email.create({
	// 	mailgunIdL: undefined,
	// 	sessionDate: sessionData.date,
	// 	wasScheduled: false,
	// 	type: 'reminder-user',
	// 	queuedAt: undefined,
	// 	scheduledAt: undefined,
	// 	userRef: userId,
	// 	psyRef: psyId,
	// 	sessionRef: sessionId,
	// });
	// // Email scheduling for appointment reminder for the psychologist
	// await email.create({
	// 	mailgunIdL: undefined,
	// 	sessionDate: sessionData.date,
	// 	wasScheduled: false,
	// 	type: 'reminder-psy',
	// 	queuedAt: undefined,
	// 	scheduledAt: undefined,
	// 	userRef: userId,
	// 	psyRef: psyId,
	// 	sessionRef: sessionId,
	// });
	// // Send appointment confirmation for user and psychologist
	// await mailService.sendAppConfirmationUser(foundUser, sessionData.date);
	// await mailService.sendAppConfirmationPsy(
	// 	foundPsychologist,
	// 	foundUser,
	// 	sessionData.date
	// );

	logInfo('Se ha realizado un pago');
	return okResponse('sesion actualizada');
};

const psychologistPay = async params => {
	const { psychologistId, price } = params;
	const newPlan = {
		name: 'paid',
		price,
		hablaquiFee: 0,
		paymentFee: 3.99,
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
