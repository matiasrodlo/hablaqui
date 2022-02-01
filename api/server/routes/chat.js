'use strict';

import { Router } from 'express';
import passport from 'passport';
import chatController from '../controllers/chat';
import permission from '../middleware/permission';
import cors from 'cors';

const { corsApi } = permission;

const chatRouter = Router();

/**
 * @description: Inicia una conversacion entre dos personas
 * @param {Object} user - Usuario logeado (que iniciara la conversacion)
 * @param {String} params.psychologistId - Id del psicologo con el que se conversara.
 * @returns: Objecto de chat (sin mensajes, pero iniciado)
 * @access: authenticated
 */
chatRouter.post(
	'/chat/start-conversation/:psychologistId',
	[cors(corsApi), passport.authenticate('jwt', { session: true })],
	chatController.startConversation
);

/**
 * @description: Consigue todos los chats del usuario loggeado.
 * @returns: Objecto de chat
 * @access: authenticated
 */
chatRouter.get(
	'/chat/get-chats',
	[cors(corsApi), passport.authenticate('jwt', { session: true })],
	chatController.getChats
);

/**
 * @description: Consigue todos los mensajes de un solo chat.
 * @param {String} params.psy - Id del psicologo
 * @param {String} params.user - Id del user
 * @access: authenticated
 */
chatRouter.get(
	'/chat/get-messages/:psy/:user',
	[cors(corsApi), passport.authenticate('jwt', { session: true })],
	chatController.getMessages
);

/**
 * @description: Envia un mensaje a ese chat.
 * @param {String} body.content - Cuerpo del mensaje
 * @returns: Objeto de chat con el nuevo mensaje incluido
 * @access: authenticated
 */
chatRouter.post(
	'/chat/send-message/:psychologistId/:userId',
	[cors(corsApi), passport.authenticate('jwt', { session: true })],
	chatController.sendMessage
);

/**
 * Ya no deberia de existir.
 */
chatRouter.post(
	'/chat/create-report/:psychologistId/:userId',
	[cors(corsApi), passport.authenticate('jwt', { session: true })],
	chatController.createReport
);

/**
 * @description: Marca un mensaje como leido
 * @param {String} params.messageId - Id del mensaje que se marcara como leido
 * @returns: Objeto de chat con el nuevo mensaje incluido
 * @access: authenticated
 */
chatRouter.patch(
	'/chat/read-message/:messageId',
	[cors(corsApi), passport.authenticate('jwt', { session: true })],
	chatController.readMessage
);

export default Object.freeze(chatRouter);
