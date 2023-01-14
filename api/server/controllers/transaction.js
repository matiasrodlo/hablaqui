'use strict';

import transactionService from '../services/transaction';
import { restResponse } from '../utils/responses/functions';
import { errorCallback } from '../utils/functions/errorCallback';

const transactionController = {
	async completePaymentsRequest(req, res) {
		try {
			const { spec } = req.params;
			const {
				data,
				code,
			} = await transactionService.completePaymentsRequest(spec);
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
	async generateTransaction(req, res) {
		try {
			const { user } = req;
			const { total, session, idSpec } = req.body;
			const { data, code } = await transactionService.generateTransaction(
				user,
				total,
				session,
				idSpec
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
	async getAllTransactions(req, res) {
		try {
			const { user } = req;
			const { data, code } = await transactionService.getAllTransactions(
				user
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error procesando la solicitud');
		}
	},
};

export default Object.freeze(transactionController);
