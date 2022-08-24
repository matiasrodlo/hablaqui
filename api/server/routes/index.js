'use strict';

import appointmentsRouter from './appointments';
import authRoutes from './auth';
import dataRouter from './data';
import psychologistsRouter from './psychologist';
import mercadopagoRouter from './mercadopago';
import mailSubscribersRouter from './mailSubscribers';
import userRoutes from './user';
import blogRouter from './blog';
import chatRouter from './chat';
import couponRouter from './coupon';
import recruitmentRouter from './recruitment';
import cronRouter from './cron';
import retoolRouter from './retool';
import sessionsRouter from './sessions';
import evaluationRouter from './evaluation';

const apiVersion = '/api/v1';

export default app => {
	app.use(apiVersion, appointmentsRouter);
	app.use(apiVersion, authRoutes);
	app.use(apiVersion, blogRouter);
	app.use(apiVersion, chatRouter);
	app.use(apiVersion, couponRouter);
	app.use(apiVersion, dataRouter);
	app.use(apiVersion, mailSubscribersRouter);
	app.use(apiVersion, mercadopagoRouter);
	app.use(apiVersion, psychologistsRouter);
	app.use(apiVersion, recruitmentRouter);
	app.use(apiVersion, userRoutes);
	app.use(apiVersion, cronRouter);
	app.use(apiVersion, retoolRouter);
	app.use(apiVersion, sessionsRouter);
	app.use(apiVersion, evaluationRouter);
};
