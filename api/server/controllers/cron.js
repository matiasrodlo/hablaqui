'use strict';

import cronService from '../services/cron';
import { restResponse } from '../utils/responses/functions';
import { errorCallback } from '../utils/functions/errorCallback';

const cronController = {
	async scheduleEmails(req, res) {
		try {
			const token = req.params.authToken;
			const { data, code } = await cronService.scheduleEmails(token);
			return restResponse(data, code, res);
		} catch (err) {
			errorCallback(res, err);
		}
	},
	async sessionStatus(req, res) {
		try {
			const token = req.params.authToken;
			const { data, code } = await cronService.sessionStatus(token);
			return restResponse(data, code, res);
		} catch (err) {
			errorCallback(res, err);
		}
	},
	async scheduleChatEmails(req, res) {
		try {
			const token = req.params.authToken;
			const { data, code } = await cronService.scheduleChatEmails(token);
			return restResponse(data, code, res);
		} catch (err) {
			errorCallback(res, err);
		}
	},
	async limitToPayPlan(req, res) {
		try {
			const token = req.params.authToken;
			const { data, code } = await cronService.limitToPayPlan(token);
			return restResponse(data, code, res);
		} catch (err) {
			errorCallback(res, err);
		}
	},
	async statusInmediateAttention(req, res) {
		try {
			const token = req.params.authToken;
			const { data, code } = await cronService.statusInmediateAttention(
				token
			);
			return restResponse(data, code, res);
		} catch (err) {
			errorCallback(res, err);
		}
	},
	async reminderPayment(req, res) {
		try {
			const token = req.params.authToken;
			const { data, code } = await cronService.reminderPayment(token);
			return restResponse(data, code, res);
		} catch (err) {
			errorCallback(res, err);
		}
	},
};

export default Object.freeze(cronController);
