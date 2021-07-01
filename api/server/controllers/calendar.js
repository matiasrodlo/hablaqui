import { errorCallback } from '../utils/functions/errorCallback';
import { restResponse } from '../utils/responses/functions';
import calendarService from '../services/calendar';

const calendarController = {
	async getEvents(req, res) {
		try {
			const { user } = req;
			const { data, code } = await calendarService.getEvents(user);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res);
		}
	},

	async createEvent(req, res) {
		try {
			const { user } = req;
			const { date, psychologist } = req.body;
			const payload = {
				date,
				psychologist,
			};
			const { data, code } = await calendarService.createEvent(
				user,
				payload
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res);
		}
	},
	async getOauthUrl(req, res) {
		try {
			const { data, code } = await calendarService.getOauthUrl();
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res);
		}
	},
	async getToken(req, res) {
		try {
			const google_code = req.body.code;
			const { user } = req;
			const { data, code } = await calendarService.getToken(
				user,
				google_code
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res);
		}
	},
	async checkBusyTask(req, res) {
		try {
			const { data, code } = await calendarService.checkBusyTask();
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res);
		}
	},
};

export default Object.freeze(calendarController);
