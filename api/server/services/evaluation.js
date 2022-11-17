'use strict';

import Psychologist from '../models/psychologist';
import Evaluation from '../models/evaluation';
import Sessions from '../models/sessions';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import {
	getScores,
	getAllEvaluationsFunction,
} from '../utils/functions/evaluationFunction';
import mailServicePsy from '../utils/functions/mails/psychologistStatus';
import moment from 'moment';
moment.tz.setDefault('America/Santiago');

const addRating = async (user, newRating, comment, psychologist) => {
	// Verifica que el usuario sea un psicologo, crea el rating y lo agrega al psicologo
	if (user.psychologist != psychologist)
		return conflictResponse('Este no es tu psicologo');

	const rating = {
		author: user._id,
		comment,
		stars: newRating,
	};

	const updatedPsychologist = await Psychologist.findByIdAndUpdate(
		psychologist,
		{ $push: { ratings: rating } },
		{ new: true }
	);

	return okResponse('Rating actualizado', {
		psychologist: updatedPsychologist,
	});
};

const getRating = async psychologist => {
	// Obtiene el rating de un psicologo, verifica que el psicologo tenga al
	// menos una evaluacion y obtiene el promedio del rating
	const foundPsychologist = await Psychologist.findById(psychologist);
	if (!foundPsychologist.ratings || foundPsychologist.ratings.length == 0)
		return okResponse('El psicologo no tiene evaluaciones aun.');

	let total = 0;
	for (let i = 0; i < foundPsychologist.ratings.length; i++) {
		total += foundPsychologist.ratings[i].stars;
	}

	return okResponse('Rating conseguido', {
		rating: total / foundPsychologist.ratings.length,
	});
};

const getEvaluationsPsy = async (username, page) => {
	moment.locale('es');

	// Cantidad total de documentos de evaluaciones sobre el psicologo en cuestion
	const count = await Evaluation.countDocuments({
		username: username,
	});

	const pageOptions = {
		totalPages: Math.ceil(count / 2),
		page: page ? parseInt(page) : 0,
		limit: 2,
	};

	if (page > pageOptions.totalPages)
		return okResponse('ultima pagina obtenida');

	// Obtiene un lote de evaluarionces de psicologos
	let evaluations = await Evaluation.find({ username: username })
		.skip(
			pageOptions.page > 0
				? (pageOptions.page - 1) * pageOptions.limit
				: 0
		)
		.limit(pageOptions.limit)
		.populate('user');

	if (!evaluations)
		return okResponse('Evaluaciones devueltas', {
			evaluations: [],
			global: 0,
			internet: 0,
			puntuality: 0,
			attention: 0,
			total: 0,
		});

	evaluations = evaluations.flatMap(item => {
		const evaluation = item.evaluations.pop();
		return {
			_id: evaluation._id,
			evaluationsId: item._id,
			comment: evaluation.comment,
			approved: evaluation.approved,
			global: evaluation.global,
			puntuality: evaluation.puntuality,
			attention: evaluation.attention,
			internet: evaluation.internet,
			name: item.user.name,
			lastName: item.user.lastName ? item.user.lastName : '',
			userId: item.user._id,
			createdAt: moment(evaluation.createdAt).format('DD [de] MMMM YYYY'),
		};
	});
	// Filtra las que han sido aprobadas
	evaluations = evaluations.filter(
		evaluation => evaluation.approved === 'approved'
	);

	return okResponse('Evaluaciones devueltas', {
		evaluations,
		...getScores(evaluations),
		total: evaluations.length,
	});
};

const getAllEvaluations = async psy => {
	// Obtiene todas las evaluaciones de un psicologo incluso las que no han sido aprobadas
	const evaluations = await getAllEvaluationsFunction(psy);
	return okResponse('Todas las sesiones devueltas', {
		evaluations,
		...getScores(evaluations),
	});
};

const approveEvaluation = async (evaluationsId, evaluationId) => {
	// Encuentra la evaluacion y la aprueba
	const evaluation = await Evaluation.findOneAndUpdate(
		{ _id: evaluationsId, 'evaluations._id': evaluationId },
		{
			$set: {
				'evaluations.$.approved': 'approved',
				'evaluations.$.moderatingDate': moment().format(),
			},
		}
	).populate('psychologist user');
	// Obtiene todas las evaluaciones del psicologo y filtra las aprobadas
	const psy = evaluation.psychologist._id;
	let evaluations = await getAllEvaluationsFunction(psy);
	evaluations = evaluations.filter(
		evaluation => evaluation.approved === 'approved'
	);

	// Recorre todas las evaluaciones y las va acumulando si es un valor numerico,
	// y lo divide por el total de evaluaciones para obtener el promedio
	const global =
		evaluations.reduce(
			(sum, value) =>
				typeof value.global == 'number' ? sum + value.global : sum,
			0
		) / evaluations.length;

	// Actualiza el rating total del psicologo y lo redondea a 2 decimales
	await Psychologist.findOneAndUpdate(
		{ _id: psy },
		{
			$set: {
				rating: global.toFixed(2),
			},
		}
	);

	// Envia correo donde se aprueba la evaluación
	await mailServicePsy.sendApproveEvaluationToUser(
		evaluations.user,
		evaluations.psychologist
	);

	await mailServicePsy.sendApproveEvaluationToPsy(
		evaluations.user,
		evaluations.psychologist
	);

	return okResponse('Evaluación aprobada', { evaluation });
};

const refuseEvaluation = async (evaluationsId, evaluationId) => {
	// Encuentra la evaluacion y la rechaza
	const evaluations = await Evaluation.findOneAndUpdate(
		{ _id: evaluationsId, 'evaluations._id': evaluationId },
		{
			$set: {
				'evaluations.$.approved': 'refuse',
				'evaluations.$.moderatingDate': moment().format(),
			},
		}
	).populate('psychologist user');

	// Enviar correo donde se rechaza la evaluación
	await mailServicePsy.sendRefuseEvaluation(
		evaluations.user,
		evaluations.psychologist
	);

	return okResponse('Sesion rechazada', { evaluations });
};
const addEvaluation = async (user, psyId, payload) => {
	if (user.role !== 'user') return conflictResponse('No eres usuario');

	// Obtiene todas las sessiones del usuario que ha tenido con el psicologo
	let sessions = await Sessions.findOne({
		psychologist: psyId,
		user: user._id,
	});

	// Crea un array con el id y el estatus de las sesiones
	sessions = sessions.plan.flatMap(plan => {
		return plan.session.map(session => {
			return {
				_id: session._id,
				status: session.status,
			};
		});
	});

	// Verifica que la sesion este finalizada
	const countSessions = sessions.filter(
		session => session.status === 'success'
	).length;

	if (countSessions < 1)
		return conflictResponse('No puede escribir un comentario');

	const psy = await Psychologist.findById(psyId);
	// Devuelve las evaluaciones de un usuario en un psicólogo
	const collEvaluation = await Evaluation.findOne({
		psychologist: psyId,
		user: user._id,
	});

	const evaluation = {
		comment: payload.comment,
		global: payload.global,
		puntuality: payload.puntuality,
		attention: payload.attention,
		internet: payload.internet,
		like: payload.like,
		improve: payload.improve,
	};
	let created = {};
	// Si no ha escrito una evaluacion crea una nueva, de lo contrario la actualiza
	if (collEvaluation) {
		created = await Evaluation.findOneAndUpdate(
			{ user: user._id, psychologist: psyId },
			{ $push: { evaluations: evaluation } }
		);
	} else {
		created = await Evaluation.create({
			user: user._id,
			psychologist: psyId,
			username: psy.username,
			evaluations: [evaluation],
		});
	}

	await mailServicePsy.sendAddEvaluation(user, psy);
	return okResponse('Evaluación guardada', created);
};

const getEvaluationsById = async userId => {
	// Obtiene todas las evaluaciones de un psicologo
	let evaluations = await Evaluation.find({ user: userId }).populate(
		'psychologist',
		'_id name lastname code'
	);

	evaluations = evaluations.flatMap(e => {
		return {
			_id: e._id,
			psychologistId: e.psychologist._id,
			name: e.psychologist.name,
			lastname: e.psychologist.lastName,
			code: e.psychologist.code,
			evaluations: e.evaluations,
		};
	});

	return okResponse('evaluaciones', { evaluations });
};

const evaluationService = {
	addRating,
	getRating,
	getEvaluationsPsy,
	getAllEvaluations,
	approveEvaluation,
	refuseEvaluation,
	addEvaluation,
	getEvaluationsById,
};
export default Object.freeze(evaluationService);
