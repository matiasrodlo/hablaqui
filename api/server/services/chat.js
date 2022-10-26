'use strict';

import { conflictResponse, okResponse } from '../utils/responses/functions';
import Chat from '../models/chat';
import { logInfo } from '../config/pino';
import Email from '../models/email';
import Analytics from 'analytics-node';

const createChat = async (user, psychologistId) => {
	const newChat = new Chat({
		user: user,
		psychologist: psychologistId,
	});
	return newChat;
};

const buscarChat = async (user, psy) => {
	const chat = await Chat.findOne({
		user: user,
		psychologist: psy,
	});
	return chat;
};

const startConversation = async (psychologistId, user) => {
	const hasChats = await buscarChat(user, psychologistId);
	if (hasChats) {
		return okResponse('chat inicializado anteriormente');
	}
	const newChat = await createChat(user._id, psychologistId._id);
	return okResponse('chat inicializado', { newChat });
};

const getMessages = async (user, psy) => {
	let messages = await buscarChat(user, psy);

	if (!messages) messages = await createChat(user, psy);

	messages = messages.populate('user psychologist');

	return okResponse('Mensajes conseguidos', {
		messages,
	});
};

const getChats = async user => {
	const roles = ['psychologist', 'user'];
	const spanishRoles = { psychologist: 'psicologo', user: 'usuario' };
	// Es para verificar que sea un rol valido
	if (!roles.includes(user.role)) {
		return conflictResponse(
			'Ha ocurrido un error intentando recuperar tus chats'
		);
	}
	// Se encuentra el rol y se devuelven los chats
	const chatss = await Promise.allSettled(
		roles.find(async rol => {
			if (rol == user.role) {
				logInfo(
					`El ${spanishRoles[rol]} ${user.email} ha conseguido sus chats`
				);
				const chat = await Chat.find({ [rol]: user._id }).populate(
					'user psychologist'
				);
				console.log(chat);
				return chat;
			}
		})
	);
	return okResponse('Chats conseguidos', { chats: chatss });
};

export const sendMessage = async (user, content, userId, psychologistId) => {
	const newMessage = {
		sentBy: user._id,
		message: content,
	};

	const updatedChat = await Chat.findOneAndUpdate(
		{
			user: userId,
			psychologist: psychologistId,
		},
		{
			$set: {
				isLastRead: false,
				lastMessageSendBy: user.role,
			},
			$push: {
				messages: newMessage,
			},
			read: false,
		},
		{ new: true }
	);
	const data = {
		userId,
		psychologistId,
		_id: updatedChat._id,
		content: [...updatedChat.messages].pop(),
	};

	const analytics = new Analytics(process.env.SEGMENT_API_KEY);
	analytics.track({
		userId: user._id.toString(),
		event: 'message-sent',
	});

	return { chat: updatedChat, emit: data };
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

const readMessage = async (user, chatId) => {
	// obtemos el id de la otra persona con que chateamos
	const chat = await Chat.findById(chatId);
	const id = user.role == 'psychologist' ? chat.user : user.psychologist;

	// marcamos como leido todos los mensajes
	await Chat.updateOne(
		{ _id: chatId, sentBy: id },
		{
			$set: {
				'messages.$[].read': true,
				isLastRead: true,
			},
		},
		{ new: true }
	);

	return okResponse('Mensajes leidos', {});
};

const chatService = {
	startConversation,
	getMessages,
	getChats,
	sendMessage,
	createReport,
	readMessage,
};

export default Object.freeze(chatService);
