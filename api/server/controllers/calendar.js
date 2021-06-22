import { errorCallback } from '../utils/functions/errorCallback';
import { restResponse } from '../utils/responses/functions';
import calendarService from '../services/calendar';

const calendarController = {
	async getEvents(req, res) {
		try {
			const { token } = req.body;
			console.log(req.body);
			console.log(token);
			const { data, code } = await calendarService.getEvents(token);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res);
		}
	},

	async createEvent(req, res) {
		try {
			const { user } = req;
			const { data, code } = await calendarService.createEvent();
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
			const google_code = req.query.code;
			const { data, code } = await calendarService.getToken(google_code);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res);
		}
	},
};

export default Object.freeze(calendarController);
