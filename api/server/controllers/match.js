'use strict';

import matchService from '../services/match';
import { restResponse } from '../utils/responses/functions';
import { errorCallback } from '../utils/functions/errorCallback';

const createAnswers = async (req, res) => {
	// Crea las respuestas de un usuario
	const { userId } = req.params;
	const payload = req.body;
	try {
		const { data, code } = await matchService.createAnswers(
			userId,
			payload
		);
		return restResponse(data, code, res);
	} catch (error) {
		errorCallback(res, error);
	}
};

const getAnswers = async (req, res) => {
	// Obtiene las respuestas de un usuario
	const { userId } = req.params;
	try {
		const { data, code } = await matchService.getAnswers(userId);
		return restResponse(data, code, res);
	} catch (error) {
		errorCallback(res, error);
	}
};

const updateAnswers = async (req, res) => {
	// Actualiza las respuestas de un usuario
	const { userId } = req.params;
	const payload = req.body;
	try {
		const { data, code } = await matchService.updateAnswers(
			userId,
			payload
		);
		return restResponse(data, code, res);
	} catch (error) {
		errorCallback(res, error);
	}
};

const deleteAnswers = async (req, res) => {
	// Elimina las respuestas de un usuario
	const { userId } = req.params;
	try {
		const { data, code } = await matchService.deleteAnswers(userId);
		return restResponse(data, code, res);
	} catch (error) {
		errorCallback(res, error);
	}
};

const matchController = {
	createAnswers,
	getAnswers,
	updateAnswers,
	deleteAnswers,
};

export default Object.freeze(matchController);
