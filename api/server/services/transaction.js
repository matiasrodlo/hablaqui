'use strict';

import Transaction from '../models/transaction';
import Sessions from '../models/sessions';
import Psychologist from '../models/psychologist';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import mailService from './mail';
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

//Funciones----------------------

const priceFormatter = price => {
	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
	});

	return formatter.format(price);
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

const transactionService = {
	completePaymentsRequest,
	createPaymentsRequest,
	getTransactions,
};

export default Object.freeze(transactionService);
