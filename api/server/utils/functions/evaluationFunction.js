import Evaluation from '../../models/evaluation';
import moment from 'moment';
moment.tz.setDefault('America/Santiago');

export const getAllEvaluationsFunction = async psy => {
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

export const getScores = evaluations => {
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
