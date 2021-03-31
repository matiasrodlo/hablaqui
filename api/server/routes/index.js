import appointmentsRouter from './appointments';
import authRoutes from './auth';
import dataRouter from './data';
import psychologistsRouter from './psychologist';
import sessionRouter from './session';
import userRoutes from './user';

const apiVersion = '/api/v1';

export default app => {
	app.use(apiVersion, userRoutes);
	app.use(apiVersion, authRoutes);
	app.use(apiVersion, psychologistsRouter);
	app.use(apiVersion, appointmentsRouter);
	app.use(apiVersion, dataRouter);
	app.use(apiVersion, sessionRouter);
};
