import authRoutes from './auth';
import psychologistsRouter from './psychologist';
import userRoutes from './user';

const apiVersion = '/api/v1';

export default app => {
	app.use(apiVersion, userRoutes);
	app.use(apiVersion, authRoutes);
	app.use(apiVersion, psychologistsRouter);
};
