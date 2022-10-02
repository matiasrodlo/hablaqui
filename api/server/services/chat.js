'use strict';

import { conflictResponse, okResponse } from '../utils/responses/functions'; // funciones para generar respuestas http
import Chat from '../models/chat'; // chat.js contiene la definición del modelo de chat para mongodb
import { logInfo } from '../config/pino'; // Se importa el log de info para poder imprimir en la consola
import Email from '../models/email'; // email.js contiene la definición del modelo de email para mongodb
import Analytics from 'analytics-node'; // Analytics-node sirve para integrar analiticas en cualquier aplicación con segment

const startConversation = async (psychologistId, user) => {
	// función que recibe el id del psicologo y el usuario, función que inicializa una conversación
	const hasChats = await Chat.findOne({
		psychologist: psychologistId,
		user: user,
	});
	if (!hasChats) {
		// si no existe un chat con el psicologo y el usuario crea un nuevo chat
		const newChat = await Chat.create({
			user: user._id,
			psychologist: psychologistId,
		});
		return okResponse('chat inicializado', { newChat });
	}
	return okResponse('chat inicializado anteriormente');
};

const getMessages = async (user, psy) => {
	// función para obtener los mensajes de un chat y hace que devuelva del documento de chat el usuario y el psicologo
	let messages = await Chat.findOne({
		psychologist: psy,
		user: user,
	}).populate('user psychologist'); //

	if (!messages)
		messages = await Chat.create({
			user: user,
			psychologist: psy,
		});

	return okResponse('Mensajes conseguidos', {
		messages,
	});
};

const getChats = async user => {
	// función para obtener los chats de un psicologo o de un usuario
	if (user.role == 'psychologist') {
		logInfo(`El psicologo ${user.email} ha conseguido sus chats`);
		return okResponse('Chats conseguidos', {
			chats: await Chat.find({
				psychologist: user.psychologist._id,
			}).populate('user psychologist'),
		});
	}
	if (user.role == 'user') {
		logInfo(`El usuario ${user.email} ha conseguido sus chats`);
		return okResponse('Chat conseguidos', {
			chats: await Chat.find({ user: user._id }).populate(
				'user psychologist'
			),
		});
	}
	return conflictResponse(
		'Ha ocurrido un error intentando recuperar tus chats'
	);
};

export const sendMessage = async (user, content, userId, psychologistId) => {
	// Crea un nuevo mensaje, busca el chat y lo actualiza
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
		user.role === 'psychologist' ? 'send-by-psy' : 'send-by-user'
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
	const id = user.role == 'psychologist' ? chat.user : user.psychologist;

	await Chat.updateOne(
		{ _id: chatId, sentBy: id },
		{
			$set: { 'messages.$[].read': true },
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
