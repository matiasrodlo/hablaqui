'use strict';

import matchService from '../services/match';
import { errorCallback } from '../utils/functions/errorCallback';

const createAnswers = async (req, res) => {
	// Crea las respuestas de un usuario
	const userId = req.params.user;
	const { payload } = req;
	try {
		const response = await matchService.createAnswers(userId, payload);
		res.status(response.status).send(response);
	} catch (error) {
		errorCallback(res, error);
	}
};

const getAnswers = async (req, res) => {
	// Obtiene las respuestas de un usuario
	const userId = req.params.id;
	try {
		const response = await matchService.getAnswers(userId);
		res.status(response.status).send(response);
	} catch (error) {
		errorCallback(res, error);
	}
};

const updateAnswers = async (req, res) => {
	// Actualiza las respuestas de un usuario
	const userId = req.params.user;
	const { payload } = req;
	try {
		const response = await matchService.updateAnswers(userId, payload);
		res.status(response.status).send(response);
	} catch (error) {
		errorCallback(res, error);
	}
};

const deleteAnswers = async (req, res) => {
	// Elimina las respuestas de un usuario
	const userId = req.params.user;
	try {
		const response = await matchService.deleteAnswers(userId);
		res.status(response.status).send(response);
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
