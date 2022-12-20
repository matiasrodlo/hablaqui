'use strict';

import { conflictResponse, okResponse } from '../utils/responses/functions';
import Chat from '../models/chat';
import { logInfo } from '../config/pino';
import Email from '../models/email';
import Analytics from 'analytics-node';

const createChat = async (user, psychologistId) => {
	const newChat = await Chat.create({
		psychologist: psychologistId,
		user: user,
	});
	return newChat;
};

const buscarChat = async (user, psy) => {
	const chat = await Chat.findOne({
		user: user,
		psychologist: psy,
	}).populate('user psychologist');
	return chat;
};

const startConversation = async (psychologistId, user) => {
	const hasChats = await buscarChat(user, psychologistId);
	if (hasChats) {
		return okResponse('chat inicializado anteriormente');
	}
	const newChat = await createChat(user._id, psychologistId);
	return okResponse('chat inicializado', { newChat });
};

const getMessages = async (user, psy) => {
	let messages = await buscarChat(user, psy);

	if (!messages) messages = await createChat(user, psy);

	return okResponse('Mensajes conseguidos', {
		// retorna un mensaje de éxito y los mensajes
		messages,
	});
};

const getChats = async user => {
	const roles = ['psychologist', 'user'];
	const idRoles = ['psychologist', '_id'];
	const spanishRoles = { psychologist: 'psicologo', user: 'usuario' };
	let chat;
	// Es para verificar que sea un rol valido
	if (!roles.includes(user.role)) {
		return conflictResponse(
			'Ha ocurrido un error intentando recuperar tus chats'
		);
	}
	// Se encuentra el rol y se devuelven los chats
	for (let i in roles) {
		if (roles[i] == user.role) {
			logInfo(
				`El ${spanishRoles[roles[i]]} ${
					user.email
				} ha conseguido sus chats`
			);
			chat = await Chat.find({ [roles[i]]: user[idRoles[i]] }).populate(
				'user psychologist'
			);
		}
	}
	return okResponse('Chats conseguidos', { chats: chat });
};

export const sendMessage = async (user, content, userId, psychologistId) => {
	// función para enviar un mensaje, recibe el usuario, el contenido del mensaje, el id del usuario y el id del psicologo
	const newMessage = {
		// crea un nuevo mensaje
		sentBy: user._id, // con el id del usuario que lo envía
		message: content, // y el contenido del mensaje
	};

	const updatedChat = await Chat.findOneAndUpdate(
		// busca un chat en la base de datos
		{
			user: userId,
			psychologist: psychologistId,
		},
		{
			$push: {
				messages: newMessage,
			},
			read: false,
		},
		{ new: true }
	);

	// Se guardan los datos en data para poder guardarlos en el modelo de email
	const data = {
		userId,
		psychologistId,
		_id: updatedChat._id,
		content: [...updatedChat.messages].pop(),
	};
	await emailChatNotification(
		data,
		user.role === 'specialist' ? 'send-by-psy' : 'send-by-user'
	);

	// Envía un evento a segment
	const analytics = new Analytics(process.env.SEGMENT_API_KEY);
	analytics.track({
		userId: user._id.toString(),
		event: 'message-sent',
	});

	return { chat: updatedChat, emit: data };
};

const emailChatNotification = async (data, type) => {
	// Crea un payload con los datos de data y guarda en el modelo de email
	const payload = {
		userRef: data.userId,
		psyRef: data.psychologistId,
		type: type,
		wasScheduled: false,
		sessionRef: data.content._id.toString(),
		sessionDate: data.content.createdAt,
	};
	await Email.updateOne(
		{
			userRef: data.userId,
			psyRef: data.psychologistId,
			type: type,
		},
		payload,
		{ upsert: true }
	);
};

const createReport = async (
	user,
	psychologistId,
	userId,
	reportType,
	issue
) => {
	// Crea un nuevo reporte del chat y lo guarda en el modelo de chat
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
	// Se obtiene el documento de chat, verifica el rol del usuario y marca el chat como leido
	const chat = await Chat.findById(chatId);
	const id = user.role == 'specialist' ? chat.user : user.psychologist;

	await Chat.updateOne(
		{ _id: chatId, sentBy: id },
		{
			$set: { 'messages.$[].read': true, isLastRead: true },
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

export default Object.freeze(chatService); // exporta el objeto con las funciones del servicio
