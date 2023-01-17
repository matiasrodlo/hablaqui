import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { snackBarError, snackBarSuccess } from '@/utils/snackbar';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

export default {
	async getSpecialists({ commit }) {
		try {
			commit('setLoadingSpecialist', true);
			const { specialists } = await this.$axios.$get('/specialists/all');
			commit('setSpecialists', specialists);
			commit('setLoadingSpecialist', false);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getSpecialistsBestMatch({ commit, state }) {
		try {
			commit('setLoadingSpecialist', true);
			const { data } = await this.$axios('/specialists/best-match', {
				method: 'POST',
				data: state.matchMaking,
			});
			if (data.perfectMatch) {
				commit('setSpecialists', data.matchedSpecialists);
			}
			commit('setLoadingSpecialist', false);
			snackBarSuccess('Especialistas recomendados obtenidos')(commit);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getSpecialistsEconomicMatch({ commit }) {
		try {
			commit('setLoadingSpecialist', true);
			const { data } = await this.$axios('/specialists/economic-match', {
				method: 'POST',
				data: state.matchMaking,
			});
			if (data.perfectMatch) {
				commit('setSpecialists', data.matchedSpecialists);
			}
			snackBarSuccess('Especialistas obtenidos')(commit);
			commit('setLoadingPsychologist', false);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getSpecialistsAvailityMatch({ commit }) {
		try {
			commit('setLoadingSpecialist', true);
			const { data } = await this.$axios('/specialists/availity-match', {
				method: 'POST',
				data: state.matchMaking,
			});
			const dateNow2 = dayjs.tz().format();
			console.log(
				'tiempo de respuesta best-match',
				dayjs(dateNow2).diff(dayjs(dateNow), 'second'),
				'segundos'
			);
			if (data.perfectMatch) {
				commit('setSpecialists', data.matchedSpecialists);
			}
			commit('setLoadingPsychologist', false);
			snackBarSuccess('Psicologos obtenidos')(commit);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getSpecialistsEconomicMatch({ commit, state }) {
		try {
			commit('setLoadingPsychologist', true);
			const dateNow = dayjs.tz().format();
			const { data } = await this.$axios('/psychologists/economic-match', {
				method: 'POST',
				data: state.matchMaking,
			});
			const dateNow2 = dayjs.tz().format();
			console.log(
				'tiempo de respuesta economic-match',
				dayjs(dateNow2).diff(dayjs(dateNow), 'second'),
				'segundos'
			);

			if (data.perfectMatch) {
				commit('setSpecialists', data.matchedSpecialists);
			}
			snackBarSuccess('Psicologos obtenidos')(commit);
			commit('setLoadingPsychologist', false);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getSpecialistsAvailityMatch({ commit, state }) {
		try {
			commit('setLoadingPsychologist', true);
			const dateNow = dayjs.tz().format();
			const { data } = await this.$axios('/psychologists/availity-match', {
				method: 'POST',
				data: state.matchMaking,
			});
			const dateNow2 = dayjs.tz().format();
			console.log(
				'tiempo de respuesta availity - match',
				dayjs(dateNow2).diff(dayjs(dateNow), 'second'),
				'segundos'
			);

			if (data.perfectMatch) {
				commit('setSpecialists', data.matchedSpecialists);
			}
			commit('setLoadingPsychologist', false);
			snackBarSuccess('Psicologos obtenidos')(commit);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getTransactions({ commit }) {
		try {
			const { transactions } = await this.$axios.$get('/specialist/transactions/all');
			commit('setTransactions', transactions);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getSessions({ commit }, { idUser }) {
		try {
			const { sessions } = await this.$axios.$get(`/specialists/sessions/${idUser}`);
			commit('setSessions', sessions);
			return sessions;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getFormattedSessions({ commit }, payload) {
		try {
			const { sessions } = await this.$axios.$get(
				`/specialists/formattedSessions/${payload.id}/${payload.type}`
			);
			commit('setSessionsFormatted', sessions);
			return sessions;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	// Obtiene solo agendas de los especialistas soliciotados
	async getSessionsLimit({ commit }, ids) {
		try {
			const { data } = await this.$axios('/specialists/sessionsLimit', {
				method: 'POST',
				data: { ids },
			});
			commit('setSessionsLimit', data.sessions);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getFormattedSessionsAll({ commit }, idSpecialist) {
		try {
			const { sessions } = await this.$axios.$get('/specialists/formattedSessionsAll');
			commit('setSessionsFormattedAll', sessions);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getClients({ commit }, id) {
		try {
			const { users } = await this.$axios.$get(`/specialist/clients/${id}`);
			commit('setClients', users);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async searchClients({ commit }, search) {
		try {
			const { users } = await this.$axios.$get(`/specialist/${search}`);
			commit('setClients', users);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getSpecialist({ commit }, id) {
		try {
			const { specialist } = await this.$axios.$get(`/specialists/one/${id}`);
			return specialist;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getPayments({ commit }) {
		try {
			const { payments } = await this.$axios.$get('/specialist/payments/all');
			commit('setPayments', payments);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async deleteSpecialist({ commit }, id) {
		try {
			const { specialists } = await this.$axios(`/specialist/${id}`, {
				method: 'delete',
			});
			commit('setSpecialists', specialists);
			return specialists;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async updatePaymentMethod({ commit }, payload) {
		try {
			const { data } = await this.$axios(`/specialist/update-payment-method`, {
				method: 'PATCH',
				data: { payload },
			});
			snackBarSuccess('Metodo de pago actualizado')(commit);
			return data.specialist;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async checkUsername({ commit }, username) {
		try {
			const { data } = await this.$axios('/specialist/check-username', {
				method: 'POST',
				data: { username },
			});
			return data.available;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async paymentRequest({ commit }, username) {
		try {
			await this.$axios('/specialist/payment-request', {
				method: 'POST',
			});
			snackBarSuccess('Pago solicitado')(commit);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async updateSpecialist({ commit }, profile) {
		try {
			const { data } = await this.$axios('/specialist/update-profile', {
				method: 'PUT',
				data: { profile },
			});
			snackBarSuccess('Actualizado exitosamente')(commit);
			return data.specialist;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async updateSessions({ commit }, payload) {
		try {
			await this.$axios('/specialists/update/sessions', {
				method: 'PUT',
				data: payload,
			});
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async approveAvatar({ commit }, id) {
		try {
			const { data } = await this.$axios(`/specialist/${id}/approve-avatar`, {
				method: 'PUT',
			});
			snackBarSuccess(data.message)(commit);
			return data.specialist;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async toggleStatus({ commit }) {
		try {
			const { data } = await this.$axios(`/specialist/status/inmediate-attention`, {
				method: 'POST',
			});
			snackBarSuccess(data.message)(commit);
			commit('setSpecialist', data.specialist);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async createCustomSession({ commit }, payload) {
		try {
			const { data } = await this.$axios('/specialist/new-custom-session', {
				method: 'POST',
				data: payload,
			});
			commit('setCustomSessions', data.sessions);
			snackBarSuccess('Sesión agregada')(commit);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},

	async ratingSpecialist({ commit }, { id, payload }) {
		try {
			const response = await this.$axios(`/user/evaluation/${id}`, {
				method: 'POST',
				data: payload,
			});
			snackBarSuccess('Tu evaluacion ha sido envida')(commit);
			return response;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async setReschedule({ commit }, { id, sessionsId, newDate }) {
		try {
			const { data } = await this.$axios(`/specialists/reschedule/${sessionsId}/${id}`, {
				method: 'POST',
				data: { newDate },
			});
			snackBarSuccess('Sesión reprogramada')(commit);
			commit('setOneSessions', { payload: data.sessions, id });
			return data.sessions;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async matchSpec({ commit }, payload) {
		try {
			const { data } = await this.$axios('/specialists/best-match', {
				method: 'POST',
				data: { payload },
			});
			const { matchedSpecialists } = data;
			if (matchedSpecialists[0]) matchedSpecialists[0].type = 'Recomendado';
			if (matchedSpecialists[1]) matchedSpecialists[1].type = 'Disponibilidad';
			if (matchedSpecialists[2]) matchedSpecialists[2].type = 'Economico';
			return matchedSpecialists;
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
	async mercadopagoSuccess({ commit }, { sessionsId, planId }) {
		try {
			await this.$axios(`/mercadopago/success-pay/${sessionsId}/${planId}`, {
				method: 'get',
			});
			snackBarSuccess('Pago aprobado')(commit);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async setPaymentPreferences({ commit }, payload) {
		try {
			const { data } = await this.$axios('/mercadopago/specialist-preference', {
				method: 'POST',
				data: payload,
			});
			if (payload.plan === 'premium')
				snackBarSuccess('Redirigientote a mercado pago')(commit);
			else snackBarSuccess('Plan basico establecido')(commit);
			return data;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async createSession({ commit }, payload) {
		try {
			const { data } = await this.$axios('/specialists/session/create', {
				method: 'POST',
				data: { payload },
			});
			return data;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async cancelSession({ commit }, payload) {
		try {
			const { data } = await this.$axios('/specialist/cancel-session', {
				method: 'delete',
				data: payload,
			});
			commit('setSessions', data.sessions);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async addSession({ commit }, { id, idPlan, payload }) {
		try {
			const { data } = await this.$axios(`/specialists/session/${id}/plan/${idPlan}`, {
				method: 'put',
				data: payload,
			});
			snackBarSuccess('Sesión agregada')(commit);
			commit('setSessions', data.sessions);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async updateSession({ commit }, payload) {
		try {
			const { specId, userId, sessionId } = payload;
			const { data } = await this.$axios(
				`/mercadopago/success-pay/${specId}/${userId}/${sessionId}`,
				{
					method: 'POST',
				}
			);
			return data;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async createMatchMakig({ commit }, payload) {
		try {
			await this.$axios(`/match/create-answers/${payload.userId}`, {
				method: 'POST',
				data: payload,
			});
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async updateMatchMakig({ commit, state }, payload) {
		try {
			const { data } = await this.$axios(`/match/update-answers/${payload.userId}`, {
				method: 'PUT',
				data: { ...state.matchMaking, ...payload },
			});
			commit('setMatchMaking', data.answers);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async deleteMatchMakig({ commit }, userid) {
		try {
			await this.$axios(`/match/delete-answers/${userid}`, {
				method: 'DELETE',
			});
			commit('setMatchMaking', null);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getMatchMakig({ commit }, userId) {
		try {
			const { data } = await this.$axios(`/match/get-answers/${userId}`, {
				method: 'GET',
			});
			commit('setMatchMaking', data.answers);
		} catch (e) {
			console.error(e);
		}
	},
	async setSchedule({ commit }, payload) {
		try {
			const { data } = await this.$axios('/specialist/set-schedule', {
				method: 'PATCH',
				data: { payload },
			});
			console.log(data);
			return data.specialist;
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
};
