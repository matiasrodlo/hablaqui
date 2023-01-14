'use strict';

import { Router } from 'express';
import passport from 'passport';
import chatController from '../controllers/chat';

const chatRouter = Router();

/**
 * @description: Inicia una conversacion entre dos personas
 * @method POST
 * @route /api/v1/chat/start-conversation/:specialistId
 * @param {Object} user - Usuario logeado (que iniciara la conversacion)
 * @param {String} params.specialistId - Id del especialista con el que se conversara.
 * @returns: Objecto de chat (sin mensajes, pero iniciado)
 * @access: authenticated
 */
chatRouter.post(
	'/chat/start-conversation/:specialistId',
	[passport.authenticate('jwt', { session: true })],
	chatController.startConversation
);

/**
 * @description: Consigue todos los chats del usuario loggeado.
 * @method GET
 * @route /api/v1/chat/get-chats
 * @returns: Objecto de chat
 * @access: authenticated
 */
chatRouter.get(
	'/chat/get-chats',
	[passport.authenticate('jwt', { session: true })],
	chatController.getChats
);

/**
 * @description: Consigue todos los mensajes de un solo chat.
 * @method GET
 * @route /api/v1/chat/get-messages/:spec/:user
 * @param {String} params.spec - Id del especialista
 * @param {String} params.user - Id del user
 * @access: authenticated
 */
chatRouter.get(
	'/chat/get-messages/:spec/:user',
	[passport.authenticate('jwt', { session: true })],
	chatController.getMessages
);

/**
 * @description: Envia un mensaje a ese chat.
 * @method POST
 * @route /api/v1/chat/send-message/:specialistId/:userId
 * @param {String} body.content - Cuerpo del mensaje
 * @returns: Objeto de chat con el nuevo mensaje incluido
 * @access: authenticated
 */
chatRouter.post(
	'/chat/send-message/:specialistId/:userId',
	[passport.authenticate('jwt', { session: true })],
	chatController.sendMessage
);

/**
 * Ya no deberia de existir.
 * No se usa
 */
chatRouter.post(
	'/chat/create-report/:specialistId/:userId',
	[passport.authenticate('jwt', { session: true })],
	chatController.createReport
);

/**
 * @description: Marca un mensaje como leido
 * @method PATCH
 * @route /api/v1/chat/read-message/:messageId
 * @param {String} params.messageId - Id del mensaje que se marcara como leido
 * @returns: Objeto de chat con el nuevo mensaje incluido
 * @access: authenticated
 */
chatRouter.patch(
	'/chat/read-message/:messageId',
	[passport.authenticate('jwt', { session: true })],
	chatController.readMessage
);

export default Object.freeze(chatRouter);
