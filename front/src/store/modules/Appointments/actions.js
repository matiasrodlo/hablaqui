import axios from '@/plugins/axios';
import { snackBarError } from '@/utils/snackbar';

export default {
	async getAppointments({ commit }) {
		try {
			const { data } = await axios('/appointments/all');
			commit('setAppointments', data.appointments);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
};
