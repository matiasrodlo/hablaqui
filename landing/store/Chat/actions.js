import { snackBarError, snackBarSuccess } from '@/utils/snackbar';

export default {
	async startConversation({ commit }, idPsychologist) {
		try {
			await this.$axios(`/chat/start-conversation/${idPsychologist}`, {
				method: 'POST',
			});
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getMessages({ commit }) {
		try {
			const { data } = await this.$axios('/chat/get-chats', {
				method: 'GET',
			});
			commit('setChats', data.chats);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async sendMessage({ commit }, { payload, psychologistId, userId }) {
		try {
			const { data } = await this.$axios(`/chat/send-message/${psychologistId}/${userId}`, {
				method: 'POST',
				data: { content: payload },
			});
			commit('setChat', data.chat);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getChat({ commit }, { psy, user }) {
		try {
			const { data } = await this.$axios(`/chat/get-messages/${psy}/${user}`, {
				method: 'GET',
			});
			commit('setChat', data.messages);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async createReport({ commit }, { reportType, issue, psychologistId, userId }) {
		try {
			await this.$axios(`/chat/create-report/${psychologistId}/${userId}`, {
				method: 'POST',
				data: { reportType, issue },
			});
			snackBarSuccess('Reporte enviado')(commit);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async updateMessage({ commit }, chatId) {
		try {
			await this.$axios(`/chat/read-message/${chatId}`, {
				method: 'PATCH',
			});
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
};
