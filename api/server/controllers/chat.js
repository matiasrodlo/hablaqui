import { send_lodging_confirmation_sms_service_url } from '../config/dotenv';
import chatService from '../services/chat';
import { errorCallback } from '../utils/functions/errorCallback';
import { restResponse } from '../utils/responses/functions';

const chatController = {
	async startConversation(req, res) {
		try {
			const { params, user } = req;
			const { data, code } = await chatService.startConversation(
				params.psychologistId,
				user
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error iniciando el chat');
		}
	},
	async getMessages(req, res) {
		const { user } = req;
		const { data, code } = await chatService.getMessages(user);
		return restResponse(data, code, res);
	},
	async sendMessage(req, res) {
		const { psychologistId, userId } = req.params;
		const { content } = req.body;
		const { user } = req;
		const { data, code } = await chatService.sendMessage(
			user,
			content,
			psychologistId,
			userId
		);

		return restResponse(data, code, res);
	},
	async createReport(req, res) {
		const { psychologistId, userId } = req.params;
		const { reportType, issue } = req.body;
		const { user } = req;
		const { data, code } = await chatService.createReport(
			user,
			psychologistId,
			userId,
			reportType,
			issue
		);

		return restResponse(data, code, res);
	},
	async sendFile(req, res) {
		const { psychologistId, userId } = req.params;
		const { user, file } = req;
		const { data, code } = await chatService.sendFile(
			user,
			file,
			psychologistId,
			userId
		);

		return restResponse(data, code, res);
	},
};

export default Object.freeze(chatController);
