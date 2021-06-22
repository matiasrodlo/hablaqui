import { errorCallback } from '../utils/functions/errorCallback';
import { restResponse } from '../utils/responses/functions';
import calendarService from '../services/calendar';

const calendarController = {
	async getEvents(req, res) {
		try {
			const { user } = req;
			const { token } = req.params;
			const { data, code } = await calendarService.getEvents(user, token);
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
};

export default Object.freeze(calendarController);
