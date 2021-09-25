import cronService from '../services/cron';
import { restResponse } from '../utils/responses/functions';
import { errorCallback } from '../utils/functions/errorCallback';

const cronController = {
	/*
	async scheduleEmails(req, res) {
		try {
			const { data, code } = await cronService.scheduleEmails();
			return restResponse(data, code, res);
		} catch (err) {
			errorCallback(res, err);
		}
	},*/
};

export default Object.freeze(cronController);
