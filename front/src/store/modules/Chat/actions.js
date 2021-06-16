import axios from '@/plugins/axios';
import { snackBarError, snackBarSuccess } from '@/utils/snackbar';

export default {
	async startConversation({ commit }, idPsychologist) {
		try {
			await axios(`/chat/start-conversation/${idPsychologist}`, {
				method: 'POST',
			});
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getMessages({ commit }) {
		try {
			const { data } = await axios('/chat/get-chats', {
				method: 'GET',
			});
			commit('setChats', data.chats);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async sendMessage({ commit }, { payload, psychologistId, userId }) {
		try {
			const { data } = await axios(`/chat/send-message/${psychologistId}/${userId}`, {
				method: 'POST',
				data: { content: payload },
			});
			commit('setChat', data.chat);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getChat({ commit }, receiver) {
		try {
			const { data } = await axios(`/chat/get-messages/${receiver}`, {
				method: 'GET',
			});
			commit('setChat', data.messages);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async createReport({ commit }, { reportType, issue, psychologistId, userId }) {
		try {
			await axios(`/chat/create-report/${psychologistId}/${userId}`, {
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
			await axios(`/chat/read-message/${chatId}`, {
				method: 'PATCH',
			});
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
};
