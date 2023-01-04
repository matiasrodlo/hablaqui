'use strict';

import scriptsService from '../services/scripts';
import { restResponse } from '../utils/responses/functions';
import { errorCallback } from '../utils/functions/errorCallback';

/**
 * @description - This function is used to register the recruitment details and profile
 * @param {object} req - The request object (Recruitment details)
 * @param {object} res - The response object (Response code and message)
 * @returns {object} - The response object
 */
const changeRole = async (req, res) => {
	try {
		const { data, code } = await scriptsService.changeRole();
		restResponse(data, code, res);
	} catch (e) {
		errorCallback(e, res, 'Error registrando el postulado');
	}
};

/**
 * @description - This function is used to add the profession to psychologist
 * @param {object} req - The request object (Recruitment details)
 * @param {object} res - The response object (Response code and message)
 */
const addProfesion = async (req, res) => {
	try {
		const { data, code } = await scriptsService.addProfesion();
		restResponse(data, code, res);
	} catch (e) {
		errorCallback(e, res, 'Error registrando el postulado');
	}
};

const removeProfesion = async (req, res) => {
	try {
		const { data, code } = await scriptsService.removeProfesion();
		restResponse(data, code, res);
	} catch (e) {
		errorCallback(e, res, 'Error registrando el postulado');
	}
};

const removeRol = async (req, res) => {
	try {
		const { data, code } = await scriptsService.removeRol();
		restResponse(data, code, res);
	} catch (e) {
		errorCallback(e, res, 'Error registrando el postulado');
	}
};

const scriptsController = {
	changeRole,
	addProfesion,
	removeProfesion,
	removeRol,
};

export default Object.freeze(scriptsController);
