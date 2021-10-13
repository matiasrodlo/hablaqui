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

mercadopago.configure({
	access_token: mercadopago_key,
});

const createPreference = async (body, res) => {
	let newPreference = {
		items: [
			{
				title: body.description,
				currency_id: 'CLP',
				unit_price: Number(body.price),
				quantity: 1,
			},
		],
		back_urls: {
			success: `${api_url}api/v1/mercadopago/success-pay/${body.psychologistToUpdate}/${body.userToUpdate}/${body.sessionToUpdate}`,
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
				currency_id: 'CLP',
				unit_price: Number(body.price),
				quantity: 1,
			},
		],
		back_urls: {
			success: `${api_url}api/v1/mercadopago/psychologist-pay/${body.psychologist}/${body.period}`,
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
	const { psyId, userId, sessionId } = params;
	const foundPsychologist = await Psychologist.findOneAndUpdate(
		{
			_id: psyId,
			sessions: { $elemMatch: { _id: sessionId } },
		},
		{ $set: { 'sessions.$.statePayments': 'successful' } },
		{ new: true }
	);
	let foundUser = await User.findById(userId);
	foundUser.plan[foundUser.plan.length - 1 || 0].status = 'success';
	foundUser.psychologist = psyId;
	foundUser.save();

	// Email scheduling for appointment reminder for the user
	const sessionData = foundPsychologist.sessions.filter(
		session => session._id.toString() == sessionId
	)[0];

	await email.create({
		mailgunIdL: undefined,
		sessionDate: sessionData.date,
		wasScheduled: false,
		type: 'reminder-user',
		queuedAt: undefined,
		scheduledAt: undefined,
		userRef: userId,
		psyRef: psyId,
		sessionRef: sessionId,
	});
	// Email scheduling for appointment reminder for the psychologist
	await email.create({
		mailgunIdL: undefined,
		sessionDate: sessionData.date,
		wasScheduled: false,
		type: 'reminder-psy',
		queuedAt: undefined,
		scheduledAt: undefined,
		userRef: userId,
		psyRef: psyId,
		sessionRef: sessionId,
	});
	// Send appointment confirmation for user and psychologist
	await mailService.sendAppConfirmationUser(foundUser, sessionData.date);
	await mailService.sendAppConfirmationPsy(
		foundPsychologist,
		foundUser,
		sessionData.date
	);

	logInfo('Se ha realizado un pago');
	return okResponse('sesion actualizada');
};

const psychologistPay = async params => {
	const { psychologistId, period } = params;
	let expirationDate;
	if (period == 'anual') {
		expirationDate = moment().add({ months: 12 }).toISOString;
	}
	if (period == 'mensual') {
		expirationDate = moment().add({ months: 1 }).toISOString;
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
