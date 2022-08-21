'use strict';

import { Router } from 'express';
import mailSubscribers from '../controllers/mailSubscribers';
const mailSubscribersRouter = Router();

/**
 * Se necesita pensar de nuevo esta parte, no usar.
 * No se usa
 */
mailSubscribersRouter.post(
	'/mail-subscription/register/:email',
	mailSubscribers.addMail
);

/**
 * No se usa
 */
mailSubscribersRouter.delete(
	'/mail-subscription/delete',
	mailSubscribers.removeMail
);

export default Object.freeze(mailSubscribersRouter);
