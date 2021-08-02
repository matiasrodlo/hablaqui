import { Router } from 'express';
import passport from 'passport';
import chatController from '../controllers/chat';

const chatRouter = Router();

chatRouter.post(
	'/chat/start-conversation/:psychologistId',
	[passport.authenticate('jwt', { session: true })],
	chatController.startConversation
);

chatRouter.get(
	'/chat/get-chats',
	[passport.authenticate('jwt', { session: true })],
	chatController.getChats
);

chatRouter.get(
	'/chat/get-messages/:psy/:user',
	[passport.authenticate('jwt', { session: true })],
	chatController.getMessages
);

chatRouter.post(
	'/chat/send-message/:psychologistId/:userId',
	[passport.authenticate('jwt', { session: true })],
	chatController.sendMessage
);

chatRouter.post(
	'/chat/create-report/:psychologistId/:userId',
	[passport.authenticate('jwt', { session: true })],
	chatController.createReport
);

chatRouter.patch(
	'/chat/read-message/:messageId',
	[passport.authenticate('jwt', { session: true })],
	chatController.readMessage
);

chatRouterr.post('/chat/set-status/online', [passport.authenticate('jwt', { session: true })], chatController.setUserOnline)
chatRouterr.post('/chat/set-status/offline', [passport.authenticate('jwt', { session: true })], chatController.setUserOffline)

export default Object.freeze(chatRouter);
