'use strict';

import matchModel from '../models/match';
import { okResponse, conflictResponse } from '../utils/responses/functions';

const createAnswers = async (user, answers) => {
	// Crea las respuestas de un usuario
	const newAnswers = {
		...answers,
		user: user._id,
	};
	const created = await matchModel.create(newAnswers);
	return okResponse('Respuestas guardadas', { answers: created });
};

const getAnswers = async user => {
	// Obtiene las respuestas de un usuario
	const found = await matchModel.findOne({ user: user._id });
	if (!found) return conflictResponse('No se encontraron respuestas');
	return okResponse('Respuestas encontradas', { answers: found });
};

const updateAnswers = async (user, answers) => {
	// Actualiza las respuestas de un usuario
	const updated = await matchModel.findOneAndUpdate(
		{ user: user._id },
		{ $set: answers }
	);
	return okResponse('Respuestas actualizadas', { answers: updated });
};

const deleteAnswers = async user => {
	// Elimina las respuestas de un usuario
	const deleted = await matchModel.findOneAndDelete({ user: user._id });
	return okResponse('Respuestas eliminadas', { answers: deleted });
};

const matchService = {
	createAnswers,
	getAnswers,
	updateAnswers,
	deleteAnswers,
};

export default Object.freeze(matchService);
