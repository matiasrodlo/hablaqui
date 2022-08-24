'use strict';

import Psychologist from '../models/psychologist';
import Evaluation from '../models/evaluation';
import { conflictResponse, okResponse } from '../utils/responses/functions';
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

const getEvaluations = async user => {
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

//funciones
const getAllEvaluationsFunction = async psy => {
	let evaluations = await Evaluation.find({ psychologist: psy }).populate(
		'user'
	);

	evaluations = evaluations.flatMap(item => {
		return item.evaluations.map(evaluation => {
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
				userId: item.user._id,
				moderatingDate: evaluation.moderatingDate,
				createdAt: moment(evaluation.createdAt)
					.tz('America/Santiago')
					.format(),
			};
		});
	});

	return evaluations;
};

const getScores = evaluations => {
	const global =
		evaluations.reduce(
			(sum, value) =>
				typeof value.global == 'number' ? sum + value.global : sum,
			0
		) / evaluations.length;
	const puntuality =
		evaluations.reduce(
			(sum, value) =>
				typeof value.puntuality == 'number'
					? sum + value.puntuality
					: sum,
			0
		) / evaluations.length;
	const attention =
		evaluations.reduce(
			(sum, value) =>
				typeof value.attention == 'number'
					? sum + value.attention
					: sum,
			0
		) / evaluations.length;
	const internet =
		evaluations.reduce(
			(sum, value) =>
				typeof value.internet == 'number' ? sum + value.internet : sum,
			0
		) / evaluations.length;
	return { global, internet, puntuality, attention };
};

const evaluationService = {
	addRating,
	getRating,
	getEvaluations,
	getAllEvaluations,
	approveEvaluation,
	refuseEvaluation,
};
export default Object.freeze(evaluationService);
