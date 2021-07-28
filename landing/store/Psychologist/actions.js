import { snackBarError } from '@/utils/snackbar';

export default {
	async getPsychologists({ commit }) {
		try {
			const { psychologists } = await this.$axios.$get('/psychologists/all');
			localStorage.setItem('psychologists', JSON.stringify(psychologists));
			commit('setPsychologists', psychologists);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async registerPsychologist({ commit }, payload) {
		try {
			await this.$axios('/psychologists/register', {
				method: 'POST',
				data: payload,
			});
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async matchPsi({ commit }, payload) {
		try {
			const { data } = await this.$axios('/psychologists/match', {
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
			const { data } = await this.$axios('/mercadopago/create-preference', {
				method: 'POST',
				data: payload,
			});
			return data;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async createSession({ commit }, payload) {
		try {
			const { data } = await this.$axios('/psychologists/session/create', {
				method: 'POST',
				data: { payload },
			});
			return data;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async updateSession({ commit }, payload) {
		try {
			const { psyId, userId, sessionId } = payload;
			const { data } = await this.$axios(
				`/mercadopago/success-pay/${psyId}/${userId}/${sessionId}`,
				{
					method: 'POST',
				}
			);
			return data;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async setSchedule({ commit }, payload) {
		try {
			await this.$axios('/psychologist/set-schedule', {
				method: 'PATCH',
				data: { payload },
			});
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
};
