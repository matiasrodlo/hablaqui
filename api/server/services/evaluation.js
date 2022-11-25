'use strict';

import Psychologist from '../models/psychologist';
import Evaluation from '../models/evaluation';
import Sessions from '../models/sessions';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import { getAllEvaluationsFunction } from '../utils/functions/evaluationFunction';
import mailServicePsy from '../utils/functions/mails/psychologistStatus';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

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

const getEvaluationsPsy = async user => {
	if (user.role !== 'psychologist')
		return conflictResponse('No eres psicólogo');

	// Verifica que el psicologo tenga evaluaciones, si tiene las obtiene y las devuelve
	const psy = user.psychologist;
	let evaluations = await Evaluation.find({ psychologist: psy });
	if (!evaluations)
		return okResponse('Evaluaciones devueltas', {
			evaluations: [],
			global: 0,
			internet: 0,
			puntuality: 0,
			attention: 0,
		});

	evaluations = await getAllEvaluationsFunction(psy);
	// Filtra las que han sido aprobadas
	evaluations = evaluations.filter(
		evaluation => evaluation.approved === 'approved'
	);

	return okResponse('Evaluaciones devueltas', {
		evaluations,
	});
};

const getAllEvaluations = async user => {
	if (user.role !== 'superuser') return conflictResponse('No admin');
	// Obtiene todas las evaluaciones de un psicologo incluso las que no han sido aprobadas
	let evaluations = await Evaluation.find().populate('user psychologist');

	evaluations = evaluations
		.flatMap(item =>
			item.evaluations.map(ev => {
				return {
					evsId: item._id,
					evId: ev._id,
					send: dayjs(ev.createdAt).format('DD/MM/YYYY HH:mm'),
					updated: dayjs(ev.updatedAt).format('DD/MM/YYYY HH:mm'),
					approved: ev.approved,
					comment: ev.comment,
					global: ev.global,
					puntuality: ev.puntuality,
					attention: ev.attention,
					internet: ev.internet,
					like: ev.like,
					improve: ev.improve,
					psychologist:
						item.psychologist.name +
						' ' +
						item.psychologist.lastName,
					username: item.psychologist.username,
					user: item.user.name + ' ' + item.user.lastName,
				};
			})
		)
		.sort((a, b) => new Date(a.send) - new Date(b.send));
	return okResponse('Todas las sesiones devueltas', {
		evaluations,
	});
};

const approveEvaluation = async (user, evaluationsId, evaluationId) => {
	if (user.role !== 'superuser') return conflictResponse('No admin');
	// Encuentra la evaluacion y la aprueba
	const evaluation = await Evaluation.findOneAndUpdate(
		{ _id: evaluationsId, 'evaluations._id': evaluationId },
		{
			$set: {
				'evaluations.$.approved': 'approved',
				'evaluations.$.moderatingDate': dayjs().format(),
			},
		},
		{ new: true }
	).populate('psychologist user');

	const psy = evaluation.psychologist._id;

	const evaluationApproved = evaluation.evaluations.find(
		ev => ev.approved === 'approved'
	);
	// Obtiene las puntuaciones promedio registradas para el psicologo
	let rating = evaluation.psychologist.attentionRating;
	let internetRating = evaluation.psychologist.internetRating;
	let puntualityRating = evaluation.psychologist.puntualityRating;
	let attentionRating = evaluation.psychologist.attentionRating;
	let totalEvaluations = evaluation.psychologist.totalEvaluations + 1;

	// Se realiza el recalculo de los rating
	rating = (rating + evaluationApproved.global) / totalEvaluations;
	internetRating =
		(internetRating + evaluationApproved.internet) / totalEvaluations;
	puntualityRating =
		(puntualityRating + evaluationApproved.puntuality) / totalEvaluations;
	attentionRating =
		(attentionRating + evaluationApproved.attention) / totalEvaluations;

	// Actualiza el rating total del psicologo y lo redondea a 2 decimales
	await Psychologist.findOneAndUpdate(
		{ _id: psy },
		{
			$set: {
				rating: rating.toFixed(2),
				internetRating: internetRating.toFixed(2),
				puntualityRating: puntualityRating.toFixed(2),
				attentionRating: attentionRating.toFixed(2),
				totalEvaluations: totalEvaluations,
			},
		}
	);

	// Envia correo donde se aprueba la evaluación
	await mailServicePsy.sendApproveEvaluationToUser(
		evaluation.user,
		evaluation.psychologist
	);

	await mailServicePsy.sendApproveEvaluationToPsy(
		evaluation.user,
		evaluation.psychologist
	);

	return okResponse('Evaluación aprobada', { evaluation });
};

const refuseEvaluation = async (user, evaluationsId, evaluationId) => {
	if (user.role !== 'superuser') return conflictResponse('No admin');
	// Encuentra la evaluacion y la rechaza
	const evaluations = await Evaluation.findOneAndUpdate(
		{ _id: evaluationsId, 'evaluations._id': evaluationId },
		{
			$set: {
				'evaluations.$.approved': 'refuse',
				'evaluations.$.moderatingDate': dayjs().format(),
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

	if (countSessions < 3)
		return conflictResponse('No puede escribir un comentario');

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
			evaluations: [evaluation],
		});
	}

	const psy = await Psychologist.findById(psyId);

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
