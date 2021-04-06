import axios from '@/plugins/axios';
import { snackBarError } from '@/utils/snackbar';

export default {
	async getPsychologists({ commit }) {
		try {
			const { data } = await axios('/psychologists/all');
			commit('setPsychologists', data.psychologists);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
};
