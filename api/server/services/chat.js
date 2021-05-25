import { conflictResponse, okResponse } from '../utils/responses/functions';
import Chat from '../models/chat';
import { logInfo } from '../config/pino';

const startConversation = async (psychologistId, user) => {
	let newChat = await Chat.create({
		user: user._id,
		psychologist: psychologistId,
	});
	return okResponse('chat inicializado', { newChat });
};

const getMessages = async user => {
	if (user.role == 'psychologist') {
		logInfo(`El psicologo ${user.email} ha conseguido sus chats`);
		return okResponse('Chats conseguidos', {
			chats: await Chat.find({ psychologist: user.psychologist._id }),
		});
	}
	if (user.role == 'user') {
		logInfo(`El usuario ${user.email} ha conseguido sus chats`);
		return okResponse('Chat conseguidos', {
			chats: await Chat.find({ user: user._id }),
		});
	}
	return conflictResponse(
		'Ha ocurrido un error intentando recuperar tus chats'
	);
};

const sendMessage = async (user, content, userId, psychologistId) => {
	const newMessage = {
		sentByUser: user.role == 'user' ? true : false,
		message: content,
	};

	const updatedChat = await Chat.findOneAndUpdate(
		{
			user: userId,
			psychologist: psychologistId,
		},
		{
			$push: {
				messages: newMessage,
			},
		},
		{ new: true }
	);

	return okResponse('Mensaje enviado', { chat: updatedChat });
};

const chatService = {
	startConversation,
	getMessages,
	sendMessage,
};

export default Object.freeze(chatService);
