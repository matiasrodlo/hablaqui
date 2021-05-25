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
	'/chat/get-messages',
	[passport.authenticate('jwt', { session: true })],
	chatController.getMessages
);

chatRouter.post(
	'/chat/send-message/:psychologistId/:userId',
	[passport.authenticate('jwt', { session: true })],
	chatController.sendMessage
);

export default Object.freeze(chatRouter);
