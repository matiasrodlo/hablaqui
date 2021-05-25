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
			userId,
			psychologistId
		);

		return restResponse(data, code, res);
	},
};

export default Object.freeze(chatController);
