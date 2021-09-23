import cronService from '../services/cron';
import { restResponse } from '../utils/responses/functions';
import { errorCallback } from '../utils/functions/errorCallback';

const cronController = {
	async scheduleEmails(req, res) {
		try {
			const result = await cronService.scheduleEmails();
			return restResponse(res, result);
		} catch (err) {
			errorCallback(res, err);
		}
	},
};

export default Object.freeze(cronController);
