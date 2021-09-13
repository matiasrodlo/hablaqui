import { Router } from 'express';
import passport from 'passport';
import chatController from '../controllers/chat';

const chatRouter = Router();

/**
 * Inicia una conversacion vacia
 * AUTENTICACION NECESARIA
 */
chatRouter.post(
	'/chat/start-conversation/:psychologistId',
	[passport.authenticate('jwt', { session: true })],
	chatController.startConversation
);

/**
 * Consigue todos los chats del usuario
 * AUTENTICACION NECESARIA
 */
chatRouter.get(
	'/chat/get-chats',
	[passport.authenticate('jwt', { session: true })],
	chatController.getChats
);

/**
 * Consigue todos los chats entre los usuarios especificados
 * AUTENTICACION NECESARIA
 */
chatRouter.get(
	'/chat/get-messages/:psy/:user',
	[passport.authenticate('jwt', { session: true })],
	chatController.getMessages
);

/**
 * Envia mensaje entre ambos usuarios
 * AUTENTICACION NECESARIA
 *
 * req.body = { content: string }
 */
chatRouter.post(
	'/chat/send-message/:psychologistId/:userId',
	[passport.authenticate('jwt', { session: true })],
	chatController.sendMessage
);

/**
 * En desuso.
 */
chatRouter.post(
	'/chat/create-report/:psychologistId/:userId',
	[passport.authenticate('jwt', { session: true })],
	chatController.createReport
);

/**
 * Marca un mensaje como leido
 */
chatRouter.patch(
	'/chat/read-message/:messageId',
	[passport.authenticate('jwt', { session: true })],
	chatController.readMessage
);

/**
 * Pone al usuario loggeado como "en linea"
 * NECESITA AUTENTICACION.
 */
chatRouter.post(
	'/chat/set-status/online',
	[passport.authenticate('jwt', { session: true })],
	chatController.setUserOnline
);

/**
 * Pone al usuario loggeado como "desconectado"
 * NECESITA AUTENTICACION.
 */
chatRouter.post(
	'/chat/set-status/offline',
	[passport.authenticate('jwt', { session: true })],
	chatController.setUserOffline
);

export default Object.freeze(chatRouter);
