'use strict';

import { conflictResponse, okResponse } from '../utils/responses/functions';
import Chat from '../models/chat';
import { logInfo } from '../config/pino';
import Email from '../models/email';
import moment from 'moment-timezone';
moment.tz.setDefault('America/Santiago');
import Analytics from 'analytics-node';

const startConversation = async (psychologistId, user) => {
	const hasChats = await Chat.findOne({
		psychologist: psychologistId,
		user: user,
	});
	if (!hasChats) {
		const newChat = await Chat.create({
			user: user._id,
			psychologist: psychologistId,
		});
		return okResponse('chat inicializado', { newChat });
	}
	return okResponse('chat inicializado anteriormente');
};

const getMessages = async (user, psy) => {
	let messages = await Chat.findOne({
		psychologist: psy,
		user: user,
	}).populate('user psychologist');

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
	const data = {
		userId,
		psychologistId,
		_id: updatedChat._id,
		content: [...updatedChat.messages].pop(),
	};

	if (user.role === 'user') {
		await emailChatNotification(data, 'send-by-user');
	} else if (user.role === 'psychologist')
        await emailChatNotification(data, 'send-by-psy');
    
    const  analytics = new Analytics(process.env.SEGMENT_API_KEY);
	analytics.track({
		userId: user._id.toString(),
		event: 'message-sent',
	});

	return { chat: updatedChat, emit: data };
};

const emailChatNotification = async (data, type) => {
	const messageId = data.content._id.toString();
	const createdAt = data.content.createdAt.toString();

	let email = await Email.findOne({
		userRef: data.userId,
		psyRef: data.psychologistId,
		type: type,
	});

	if (!email) {
		email = await Email.create({
			sessionDate: moment(createdAt).format(),
			wasScheduled: false,
			type: type,
			queuedAt: undefined,
			scheduledAt: undefined,
			userRef: data.userId,
			psyRef: data.psychologistId,
			sessionRef: messageId,
		});
	} else {
		email = await Email.findOneAndUpdate(
			{
				userRef: data.userId,
				psyRef: data.psychologistId,
				type: type,
			},
			{
				$set: {
					wasScheduled: false,
					sessionRef: messageId,
					sessionDate: moment(createdAt).format(),
				},
			}
		);
	}
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

export default Object.freeze(chatService);
