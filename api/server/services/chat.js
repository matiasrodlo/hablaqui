import { conflictResponse, okResponse } from '../utils/responses/functions';
import Chat from '../models/chat';
import { logInfo } from '../config/pino';
import pusher from '../config/pusher';
import { pusherCallback } from '../utils/functions/pusherCallback';

const startConversation = async (psychologistId, user) => {
	let newChat = await Chat.create({
		user: user._id,
		psychologist: psychologistId,
	});
	return okResponse('chat inicializado', { newChat });
};

const getMessages = async (user, receiver) => {
	if (user.role == 'psychologist') {
		return okResponse('Mensajes conseguidos', {
			messages: await Chat.findOne({
				psychologist: user._id,
				user: receiver,
			}),
		});
	}
	if (user.role == 'user') {
		return okResponse('Mensajes conseguidos', {
			messages: await Chat.findOne({
				psychologist: receiver,
				user: user._id,
			}),
		});
	}
	return conflictResponse('Ha ocurrido un error');
};
const getChats = async user => {
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

	const data = {
		userId,
		psychologistId,
		content: newMessage,
	};

	pusher.trigger('chat', 'update', data, pusherCallback);

	return okResponse('Mensaje enviado', { chat: updatedChat });
};

const createReport = async (
	user,
	psychologistId,
	userId,
	reportType,
	issue
) => {
	const newReport = {
		reportedBy: user._id,
		reportType,
		issue,
	};

	const updatedChat = await Chat.findOneAndUpdate(
		{
			user: userId,
			psychologist: psychologistId,
		},
		{
			$push: {
				reports: newReport,
			},
		},
		{ new: true }
	);

	logInfo(
		`El usuario ${user.email} de tipo ${user.role} ha hecho un reporte`
	);
	return okResponse('Reporte creado', { chat: updatedChat });
};

const chatService = {
	startConversation,
	getMessages,
	getChats,
	sendMessage,
	createReport,
};

export default Object.freeze(chatService);
