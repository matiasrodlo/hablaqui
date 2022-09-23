'use strict';

import transactionService from '../services/transaction';
import { restResponse } from '../utils/responses/functions';
import { errorCallback } from '../utils/functions/errorCallback';

const transactionController = {
	async completePaymentsRequest(req, res) {
		try {
			const { psy } = req.params;
			const {
				data,
				code,
			} = await transactionService.completePaymentsRequest(psy);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
	async createPaymentsRequest(req, res) {
		try {
			const { user } = req;
			const {
				data,
				code,
			} = await transactionService.createPaymentsRequest(user);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
	async getTransactions(req, res) {
		try {
			const { user } = req;
			const { data, code } = await transactionService.getTransactions(
				user
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
};

export default Object.freeze(transactionController);
