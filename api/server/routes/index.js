'use strict'

import appointmentsRouter from './appointments'
import authRoutes from './auth'
import specialistsRouter from './specialist'
import mercadopagoRouter from './mercadopago'
import userRoutes from './user'
import chatRouter from './chat'
import couponRouter from './coupon'
import recruitmentRouter from './recruitment'
import cronRouter from './cron'
import dashboardRouter from './dashboard'
import sessionsRouter from './sessions'
import evaluationRouter from './evaluation'
import transactionRouter from './transaction'
import scriptsRouter from './scripts'

const apiVersion = '/api/v1'

export default app => {
	app.use(apiVersion, appointmentsRouter);
	app.use(apiVersion, authRoutes);
	app.use(apiVersion, chatRouter);
	app.use(apiVersion, couponRouter);
	app.use(apiVersion, mercadopagoRouter);
	app.use(apiVersion, specialistsRouter);
	app.use(apiVersion, recruitmentRouter);
	app.use(apiVersion, userRoutes);
	app.use(apiVersion, cronRouter);
	app.use(apiVersion, dashboardRouter);
	app.use(apiVersion, sessionsRouter);
	app.use(apiVersion, evaluationRouter);
	app.use(apiVersion, transactionRouter);
	app.use(apiVersion, scriptsRouter);
	app.use('/health-check', (req, res) => res.status(200).json({ status: true }));
};
