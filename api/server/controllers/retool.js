'use strict';

import retoolService from '../services/retool';
import { restResponse } from '../utils/responses/functions';
import { errorCallback } from '../utils/functions/errorCallback';

const retoolController = {
	async getNextSessions(req, res) {
		try {
			const { data, code } = await retoolService.getNextSessions();
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
	async getSessionsPayment(req, res) {
		try {
			const { startDate, endDate } = req.body;
			const { data, code } = await retoolService.getSessionsPayment(
				startDate,
				endDate
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
};

export default Object.freeze(retoolController);
