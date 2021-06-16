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
	'/chat/get-messages/:receiver',
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
	'/chat/read-message/:chatId',
	[passport.authenticate('jwt', { session: true })],
	chatController.readMessage
);

export default Object.freeze(chatRouter);
