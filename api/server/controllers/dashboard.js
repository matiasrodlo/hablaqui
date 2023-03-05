'use strict';

import dashboardService from '../services/dashboard';
import { restResponse } from '../utils/responses/functions';
import { errorCallback } from '../utils/functions/errorCallback';

const retoolController = {
	async getNextSessions(req, res) {
		try {
			const { data, code } = await dashboardService.getNextSessions();
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
	async getSessionsPayment(req, res) {
		try {
			const { startDate, endDate } = req.params;
			const { data, code } = await dashboardService.getSessionsPayment(
				startDate,
				endDate
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
	async fixSpecialities(req, res) {
		try {
			const { data, code } = await dashboardService.fixSpecialities();
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
	async getMountToPay(req, res) {
		try {
			const { user } = req;
			const { data, code } = await dashboardService.getMountToPay(user);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
	async specialistVisibility(req, res) {
		try {
			const { specId, visibility } = req.params;
			const { data, code } = await dashboardService.specialistVisibility(
				specId,
				visibility
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
	async getUsers(req, res) {
		try {
			const { data, code } = await dashboardService.getUsers();
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
	async heatlhCheck(req, res) {
		try {
			return restResponse('OK', 200, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	}
};

export default Object.freeze(retoolController);
