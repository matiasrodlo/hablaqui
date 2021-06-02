import axios from '@/plugins/axios';
import { snackBarError, snackBarSuccess } from '@/utils/snackbar';

export default {
	async startConversation({ commit }, { idPsychologist }) {
		try {
			await axios(`/chat/start-conversation/${idPsychologist}`, {
				method: 'POST',
			});
			snackBarSuccess('Articulo creado exitosamente')(commit);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async getMessages({ commit }) {
		try {
			await axios('/chat/get-messages', {
				method: 'get',
			});
			snackBarSuccess('Articulo creado exitosamente')(commit);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
	async sendMessage({ commit }, { payload, psychologistId, userId }) {
		try {
			await axios(`/chat/send-message/${psychologistId}/${userId}`, {
				method: 'POST',
				data: payload,
			});
			snackBarSuccess('Articulo creado exitosamente')(commit);
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
			snackBarSuccess('Articulo creado exitosamente')(commit);
		} catch (e) {
			snackBarError(e)(commit);
		}
	},
};
