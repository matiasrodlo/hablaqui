'use strict';

import cronService from '../services/cron';
import { restResponse } from '../utils/responses/functions';
import { errorCallback } from '../utils/functions/errorCallback';

const cronController = {
	async emailSchedule(req, res) {
		try {
			const token = req.params.authToken;
			const { data, code } = await cronService.emailSchedule(token);
			return restResponse(data, code, res);
		} catch (err) {
			errorCallback(err, res);
		}
	},
	async sessionStatus(req, res) {
		try {
			const token = req.params.authToken;
			const { data, code } = await cronService.sessionStatus(token);
			return restResponse(data, code, res);
		} catch (err) {
			errorCallback(err, res);
		}
	},
	async scheduleChatEmails(req, res) {
		try {
			const token = req.params.authToken;
			const { data, code } = await cronService.scheduleChatEmails(token);
			return restResponse(data, code, res);
		} catch (err) {
			errorCallback(err, res);
		}
	},
	async limitToPayPlan(req, res) {
		try {
			const token = req.params.authToken;
			const { data, code } = await cronService.limitToPayPlan(token);
			return restResponse(data, code, res);
		} catch (err) {
			errorCallback(err, res);
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
			errorCallback(err, res);
		}
	},
	async reminderPayment(req, res) {
		try {
			const token = req.params.authToken;
			const { data, code } = await cronService.reminderPayment(token);
			return restResponse(data, code, res);
		} catch (err) {
			errorCallback(err, res);
		}
	},
};

export default Object.freeze(cronController);
