import { Router } from 'express';
import mailSubscribers from '../controllers/mailSubscribers';
const mailSubscribersRouter = Router();

mailSubscribersRouter.post(
	'/mail-subscription/register/:email',
	mailSubscribers.addMail
);
mailSubscribersRouter.delete(
	'/mail-subscription/delete',
	mailSubscribers.removeMail
);

export default Object.freeze(mailSubscribersRouter);
