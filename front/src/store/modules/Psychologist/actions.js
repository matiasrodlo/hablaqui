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
	async registerPsychologist({ commit }, payload) {
		try {
			await axios('/psychologists/register', {
				method: 'POST',
				data: payload,
			});
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async matchPsi({ commit }, payload) {
		try {
			const { data } = await axios('/psychologists/match', {
				method: 'POST',
				data: { payload },
			});
			return data.matchedPsychologists;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async mercadopagoPay({ commit }, payload) {
		try {
			const { data } = await axios('/mercadopago/create-preference', {
				method: 'POST',
				data: payload,
			});
			return data;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
};
