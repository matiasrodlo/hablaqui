'use strict';

import Transaction from '../models/transaction';
import Sessions from '../models/sessions';
import Psychologist from '../models/psychologist';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import { getAllSessionsFunction } from '../utils/functions/getAllSessionsFunction';
import { priceFormatter } from '../utils/functions/priceFormatter';
import mailService from '../utils/functions/mails/psychologistStatus';
import moment from 'moment';
moment.tz.setDefault('America/Santiago');
var Analytics = require('analytics-node');
var analytics = new Analytics(process.env.SEGMENT_API_KEY);

const completePaymentsRequest = async psy => {
	let sessions = await getAllSessionsFunction(psy);
	const user = await Psychologist.findById(psy);
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
		transactionDate: now,
	};
	await Transaction.findOneAndUpdate(
		{ psychologist: psy },
		{ $push: { transactionCompleted: transaction } }
	);

	//Enviar correo de dinero depositado a psy
	await mailService.sendCompletePaymentRequest(user, total, now);

	return okResponse('Peticion completada', {
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

	const total = sessions.reduce(
		(sum, value) =>
			typeof value.total == 'number' ? sum + value.total : sum,
		0
	);

	if (total === 0)
		return conflictResponse(
			'No puedes hacer una petición con saldo 0 disponible'
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

	const transaction = {
		total,
		sessionsPaid: sessions.length,
		transactionDate: now,
	};
	await Transaction.findOneAndUpdate(
		{ psychologist: psy },
		{ $push: { transactionsRequest: transaction } }
	);

	if (
		process.env.API_URL.includes('hablaqui.cl') ||
		process.env.DEBUG_ANALYTICS === 'true'
	) {
		analytics.track({
			userId: user._id.toString(),
			event: 'psy-withdrawal-request',
			properties: {
				total: total,
				sessions: sessions.length,
			},
		});
	}
	//Crear correo de petición de retiro de dinero
	await mailService.sendPaymentRequest(user, total, now);

	return okResponse('Peticion hecha', {
		total: total,
		sessions: sessions,
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
				session.status === 'success' &&
				session.request === 'none' &&
				session.name !== 'Compromiso privado '
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
		transactions: {
			total: priceFormatter(total),
			totalAvailable: priceFormatter(totalAvailable),
			successSessions,
			sessionsReceivable,
			sessions,
			transactions,
		},
	});
};

const transactionService = {
	completePaymentsRequest,
	createPaymentsRequest,
	getTransactions,
};

export default Object.freeze(transactionService);
