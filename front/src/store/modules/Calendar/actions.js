import axios from '@/plugins/axios';
import { snackBarError } from '@/utils/snackbar';

export default {
	async get_events({ commit }) {
		try {
			const { data } = await axios('/calendar/get-events/:token');
			return data.events;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async save_token({ commit }, token) {
		try {
			localStorage.setItem('calendarToken', token);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
};
