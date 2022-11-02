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
	}).populate('user psychologist');
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
			user: userId, // que tenga como usuario al usuario que se recibe como parámetro siendo de tipo ObjectId
			psychologist: psychologistId, // y que tenga como psicologo al psicologo que se recibe como parámetro siendo de tipo ObjectId
		},
		{
			$push: {
				// añade un nuevo mensaje al chat
				messages: newMessage, // con el nuevo mensaje
			},
			read: false, // y que el chat no esté leído
		},
		{ new: true } // devuelve el documento actualizado
	);
	const data = {
		// crea un objeto con los datos del mensaje
		userId, // con el id del usuario
		psychologistId, // con el id del psicologo
		_id: updatedChat._id, // con el id del chat
		content: [...updatedChat.messages].pop(), // Quita el último mensaje del array de mensajes, y devuelve el contenido del último mensaje
	};

	await emailChatNotification(
		// envía un email de notificación al psicologo
		data, // con los datos del mensaje
		user.role === 'psychologist' ? 'send-by-psy' : 'send-by-user' // si el usuario es un psicologo envía un email de notificación de que el psicologo ha enviado un mensaje, si no envía un email de notificación de que el usuario ha enviado un mensaje
	);

	const analytics = new Analytics(process.env.SEGMENT_API_KEY); // crea un nuevo objeto de analytics, SEGMENT_API_KEY es una variable de entorno que contiene la clave de segment
	analytics.track({
		// envía un evento a segment
		userId: user._id.toString(), // con el id del usuario
		event: 'message-sent', // con el evento de mensaje enviado
	});

	return { chat: updatedChat, emit: data }; // retorna el chat actualizado y los datos del mensaje
};

const emailChatNotification = async (data, type) => {
	// función para enviar un email de notificación, recibe los datos del mensaje y el tipo de notificación
	const payload = {
		// crea un objeto con los datos del mensaje
		userRef: data.userId, // con el id del usuario
		psyRef: data.psychologistId, // con el id del psicologo
		type: type, // con el tipo de notificación
		wasScheduled: false, // y que no estaba programado
		sessionRef: data.content._id.toString(), // con el id del mensaje
		sessionDate: data.content.createdAt, // con la fecha de creación del mensaje
	};
	await Email.updateOne(
		// busca un email en la base de datos
		{
			userRef: data.userId, // que tenga como usuario al usuario que se recibe como parámetro siendo de tipo ObjectId
			psyRef: data.psychologistId, // y que tenga como psicologo al psicologo que se recibe como parámetro siendo de tipo ObjectId
			type: type, // y que tenga como tipo de notificación el tipo de notificación que se recibe como parámetro
		},
		payload, // con los datos del mensaje
		{ upsert: true } // duda
	);
};

const createReport = async (
	// función para crear un reporte, recibe el id del usuario, el id del psicologo, el id del chat, el contenido del reporte y el motivo del reporte
	user, // el usuario que reporta
	psychologistId, // el id del psicologo
	userId, // el id del usuario
	reportType, // el tipo de reporte
	issue // el motivo del reporte
) => {
	const newReport = {
		// crea un nuevo reporte
		reportedBy: user._id, // con el id del usuario que lo reporta
		reportType, // con el tipo de reporte
		issue, // con el motivo del reporte
	};

	const updatedChat = await Chat.findOneAndUpdate(
		// busca un chat en la base de datos para actualizarlo
		{
			user: userId, // que tenga como usuario al usuario que se recibe como parámetro siendo de tipo ObjectId
			psychologist: psychologistId, // y que tenga como psicologo al psicologo que se recibe como parámetro siendo de tipo ObjectId
		},
		{
			$push: {
				// añade un nuevo reporte al chat
				reports: newReport, // con el nuevo reporte
			},
		},
		{ new: true } // devuelve el documento actualizado
	);

	logInfo(
		// registra un log de información
		`El usuario ${user.email} de tipo ${user.role} ha hecho un reporte`
	);
	return okResponse('Reporte creado', { chat: updatedChat }); // retorna un mensaje de éxito y el chat actualizado
};

const readMessage = async (user, chatId) => {
	// obtemos el id de la otra persona con que chateamos
	const chat = await Chat.findById(chatId); // busca un chat en la base de datos
	const id = user.role == 'psychologist' ? chat.user : user.psychologist; // Si el usuario es un psicologo, el id es el id del usuario, si no, el id es el id del psicologo

	// marcamos como leido todos los mensajes
	await Chat.updateOne(
		// busca un chat en la base de datos para actualizarlo
		{ _id: chatId, sentBy: id }, // busca el chat con el id que se recibe como parámetro y que el mensaje haya sido enviado por el id que se obtuvo anteriormente
		{
			$set: { 'messages.$[].read': true }, // le cambia el estado de leído a todos los mensajes
		},
		{ new: true } // devuelve el documento actualizado
	);

	return okResponse('Mensajes leidos', {}); // retorna un mensaje de éxito
};

const chatService = {
	// crea un objeto con las funciones del servicio
	startConversation,
	getMessages,
	getChats,
	sendMessage,
	createReport,
	readMessage,
};

export default Object.freeze(chatService); // exporta el objeto con las funciones del servicio
