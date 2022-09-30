'use strict';

import Psychologist from '../models/psychologist';
import Evaluation from '../models/evaluation';
import Sessions from '../models/sessions';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import {
	getScores,
	getAllEvaluationsFunction,
} from '../utils/functions/evaluationFunction';
import mailService from './mail';
import moment from 'moment';
moment.tz.setDefault('America/Santiago');

const addRating = async (user, newRating, comment, psychologist) => {
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
	evaluations = evaluations.filter(
		evaluation => evaluation.approved === 'approved'
	);

	return okResponse('Evaluaciones devueltas', {
		evaluations,
		...getScores(evaluations),
	});
};

const getAllEvaluations = async psy => {
	const evaluations = await getAllEvaluationsFunction(psy);
	return okResponse('Todas las sesiones devueltas', {
		evaluations,
		...getScores(evaluations),
	});
};

const approveEvaluation = async (evaluationsId, evaluationId) => {
	const evaluation = await Evaluation.findOneAndUpdate(
		{ _id: evaluationsId, 'evaluations._id': evaluationId },
		{
			$set: {
				'evaluations.$.approved': 'approved',
				'evaluations.$.moderatingDate': moment().format(),
			},
		}
	).populate('psychologist user');
	const psy = evaluation.psychologist._id;
	let evaluations = await getAllEvaluationsFunction(psy);
	evaluations = evaluations.filter(
		evaluation => evaluation.approved === 'approved'
	);

	const global =
		evaluations.reduce(
			(sum, value) =>
				typeof value.global == 'number' ? sum + value.global : sum,
			0
		) / evaluations.length;

	await Psychologist.findOneAndUpdate(
		{ _id: psy },
		{
			$set: {
				rating: global.toFixed(2),
			},
		}
	);

	//enviar correo donde se apruba la evaluación
	await mailService.sendApproveEvaluationToUser(
		evaluations.user,
		evaluations.psychologist
	);

	await mailService.sendApproveEvaluationToPsy(
		evaluations.user,
		evaluations.psychologist
	);

	return okResponse('Evaluación aprobada', { evaluation });
};

const refuseEvaluation = async (evaluationsId, evaluationId) => {
	const evaluations = await Evaluation.findOneAndUpdate(
		{ _id: evaluationsId, 'evaluations._id': evaluationId },
		{
			$set: {
				'evaluations.$.approved': 'refuse',
				'evaluations.$.moderatingDate': moment().format(),
			},
		}
	).populate('psychologist user');

	//Enviar correo donde se rechaza la evaluación
	await mailService.sendRefuseEvaluation(
		evaluations.user,
		evaluations.psychologist
	);

	return okResponse('Sesion rechazada', { evaluations });
};
const addEvaluation = async (user, psyId, payload) => {
	if (user.role !== 'user') return conflictResponse('No eres usuario');

	let sessions = await Sessions.findOne({
		psychologist: psyId,
		user: user._id,
	});

	sessions = sessions.plan.flatMap(plan => {
		return plan.session.map(session => {
			return {
				_id: session._id,
				status: session.status,
			};
		});
	});

	const countSessions = sessions.filter(
		session => session.status === 'success'
	).length;

	if (countSessions < 3)
		return conflictResponse('No puede escribir un comentario');

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

	await mailService.sendAddEvaluation(user, psy);
	return okResponse('Evaluación guardada', created);
};

const getEvaluationsById = async userId => {
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
