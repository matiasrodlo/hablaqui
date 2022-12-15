'use strict';

import Transaction from '../models/transaction';
import Sessions from '../models/sessions';
import Psychologist from '../models/psychologist';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import { getAllSessionsFunction } from '../utils/functions/getAllSessionsFunction';
import { priceFormatter } from '../utils/functions/priceFormatter';
import mailServicePsy from '../utils/functions/mails/psychologistStatus';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import Analytics from 'analytics-node';
import 'dayjs/locale/es';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.tz.setDefault('America/Santiago');

const analytics = new Analytics(process.env.SEGMENT_API_KEY);

const completePaymentsRequest = async psy => {
	// Se obtienen todas las sessiones del psicologo, obtiene el documento de psicologo con su id
	let sessions = await getAllSessionsFunction(psy);
	const user = await Psychologist.findById(psy);
	const now = dayjs().format();

	// Se busca el documentro de transacciones con el id del psy, si no existe se crea
	const transactions = await Transaction.findOne({ psychologist: psy });
	if (!transactions) {
		await Transaction.create({
			psychologist: psy,
			transactionsRequest: [],
			transactionCompleted: [],
		});
	}

	// Filtra las sesiones obtenidas en base a un plan que haya sido pagado por el consultante
	// y que este en un estado pending, respecto a la solicitud de retiro que haya pedido el psicólogo
	sessions = sessions.filter(
		session =>
			session.status === 'success' &&
			session.statusPlan === 'success' &&
			session.request === 'pending'
	);

	// Se actualiza la fecha del pago y el estado de la solicitud de retiro
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

	// Cuenta la cantidad de sesiones
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

	// Se actualiza el documento de transacciones con la nueva transacción
	await Transaction.findOneAndUpdate(
		{ psychologist: psy },
		{ $push: { transactionCompleted: transaction } }
	);

	//Enviar correo de dinero depositado a psy
	await mailServicePsy.sendCompletePaymentRequest(user, total, now);

	return okResponse('Peticion completada', {
		total: total,
		sessions: sessions,
	});
};

const createPaymentsRequest = async user => {
	if (user.role === 'user')
		return conflictResponse('No estas autorizado para esta operacion');
	// Se obtiene las sessiones del psy
	const psy = user.psychologist;
	let sessions = await getAllSessionsFunction(psy);
	const now = dayjs().format();

	// Se busca el modelo de transacciones con el id del psy, si no existe se crea
	const transactions = await Transaction.findOne({ psychologist: psy });
	if (!transactions) {
		await Transaction.create({
			psychologist: psy,
			transactionsRequest: [],
			transactionCompleted: [],
		});
	}
	// Filtra las sesiones obtenidas en base a un plan que haya sido pagado por el consultante,
	// que este en un estado none (implicando que la solicitud de retiro por parte de un psicólogo no se ha hecho)
	// y que la sesión no sea un Compromiso privado
	sessions = sessions.filter(
		session =>
			session.status === 'success' &&
			session.statusPlan === 'success' &&
			session.request === 'none' &&
			session.name !== 'Compromiso privado '
	);

	// Se obtiene el total de las sesiones ya filtradas
	const total = sessions.reduce(
		(sum, value) =>
			typeof value.total == 'number' ? sum + value.total : sum,
		0
	);

	// Esto se podría deber a que el psicólogo no tiene sesiones pagadas
	if (total === 0)
		return conflictResponse(
			'No puedes hacer una petición con saldo 0 disponible'
		);

	// Se actualiza cada una de las sessiones con la solicitud pendiente y la fecha de solicitud (now)
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

	// Se hace el trackeo en segment
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
	await mailServicePsy.sendPaymentRequest(user, total, now);

	return okResponse('Peticion hecha', {
		total: total,
		sessions: sessions,
	});
};

const getTransactions = async user => {
	if (user.role === 'user')
		return conflictResponse('No estas autorizado para esta operacion');
	const psy = user.psychologist;

	// Se obtienen las sessiones del psy y se obtiene el documento de transacciones con el id del psy
	let sessions = await getAllSessionsFunction(psy);
	let transactions = await Transaction.findOne({ psychologist: psy });

	// Si existe el documento de transacciones se obtiene el total de las transacciones en solicitud
	if (transactions) transactions = transactions.transactionsRequest;
	else transactions = [];

	sessions = sessions.filter(
		session =>
			session.status === 'success' &&
			session.statusPlan === 'success' &&
			session.name !== 'Compromiso privado '
	);

	// Se obtiene el total de dinero ya pagado
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

	// Se obtiene el total de dinero a cobrar
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

	// Se obtiene el total de las sesiones realizadas y las sessiones a cobrar
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

const generateTransaction = async (user, total, session, idPsy) => {
	if (user.role !== 'superuser') return conflictResponse('No tienes permiso');
	if (session.length === 0)
		return conflictResponse('No hay sesiones para pagar');
	// Actualizar las sesiones como pagadas
	await session.forEach(async s => {
		await Sessions.updateOne(
			{
				'plan.session._id': s._id,
			},
			{
				$set: {
					'plan.$[].session.$[session].paidToPsychologist': true,
				},
			},
			{ arrayFilters: [{ 'session._id': s._id }] }
		);
	});
	// Guarda la transaccion en mongo
	let transaction = await Transaction.create({
		total,
		sessions: session,
		psychologist: idPsy,
	});
	// Se obtiene la informacion del psy y se envia el correo
	let psy = await Psychologist.findById(idPsy);
	// Se obtiene el lunes de la semana pasada y el domingo
	const period = {
		start: dayjs
			.tz()
			.subtract(1, 'week')
			.startOf('week')
			.add(1, 'day')
			.format('DD/MM/YYYY'),
		end: dayjs
			.tz()
			.subtract(1, 'week')
			.endOf('week')
			.format('DD/MM/YYYY'),
	};
	await mailServicePsy.sendPaymentSummary(psy, period, total, session.length);
	return okResponse('Pago completado', { transaction });
};

const getAllTransactions = async user => {
	if (user.role !== 'superuser') return conflictResponse('No tienes permiso');

	let transactions = await Transaction.find().populate('psychologist');

	transactions = transactions
		.map(t => {
			return {
				createdAt: dayjs(t.createdAt).format('DD/MM/YYYY HH:mm'),
				session: t.sessions.map(s => {
					return {
						...s,
						date: dayjs(s.date, 'MM/DD/YYYY HH:mm').format(
							'DD/MM/YYYY HH:mm'
						),
					};
				}),
				total: t.total,
				name: t.psychologist.name,
				lastName: t.psychologist.lastName,
				username: t.psychologist.username,
				email: t.psychologist.email,
				psyId: t.psychologist._id,
			};
		})
		.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
	return okResponse('Todas las transacciones', { transactions });
};

const transactionService = {
	completePaymentsRequest,
	createPaymentsRequest,
	getTransactions,
	generateTransaction,
	getAllTransactions,
};

export default Object.freeze(transactionService);
