import calendarRouter from './calendar';

export default function routerConfig(app) {
	app.use('', calendarRouter);
}
