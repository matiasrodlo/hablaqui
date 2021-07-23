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

const apiVersion = '/api/v1';

export default app => {
	app.use(apiVersion, userRoutes);
	app.use(apiVersion, authRoutes);
	app.use(apiVersion, psychologistsRouter);
	app.use(apiVersion, appointmentsRouter);
	app.use(apiVersion, dataRouter);
	app.use(apiVersion, mercadopagoRouter);
	app.use(apiVersion, blogRouter);
	app.use(apiVersion, chatRouter);
	app.use(apiVersion, mailSubscribersRouter);
	app.use(apiVersion, couponRouter);
};
