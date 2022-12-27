'use strict';

import appointmentsRouter from './appointments';
import authRoutes from './auth';
import psychologistsRouter from './psychologist';
import mercadopagoRouter from './mercadopago';
import userRoutes from './user';
import chatRouter from './chat';
import couponRouter from './coupon';
import recruitmentRouter from './recruitment';
import cronRouter from './cron';
import dashboardRouter from './dashboard';
import sessionsRouter from './sessions';
import evaluationRouter from './evaluation';
import matchRouter from './match';
import transactionRouter from './transaction';

const apiVersion = '/api/v1';

export default app => {
	app.use(apiVersion, appointmentsRouter);
	app.use(apiVersion, authRoutes);
	app.use(apiVersion, chatRouter);
	app.use(apiVersion, couponRouter);
	app.use(apiVersion, mercadopagoRouter);
	app.use(apiVersion, psychologistsRouter);
	app.use(apiVersion, recruitmentRouter);
	app.use(apiVersion, userRoutes);
	app.use(apiVersion, cronRouter);
	app.use(apiVersion, dashboardRouter);
	app.use(apiVersion, sessionsRouter);
	app.use(apiVersion, evaluationRouter);
	app.use(apiVersion, matchRouter);
	app.use(apiVersion, transactionRouter);
};
