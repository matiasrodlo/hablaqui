import axios from '@/plugins/axios';
import { snackBarError } from '@/utils/snackbar';

export default {
	async saveToken({ commit }, code) {
		try {
			const { data } = await axios('/calendar/success', {
				method: 'POST',
				data: { code },
			});
			localStorage.setItem('calendarToken', JSON.stringify(data.token));
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
};
