import { Router } from 'express';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

const routerr = Router();

routerr.get('/seba/caca', (req, res) => {
	let date2 = dayjs.tz(dayjs().add(5, 'days')).format();
	let now = dayjs.tz().format();
	console.log(dayjs.tz(date2).diff(dayjs.tz(), 'days'));
	console.log(date2);
	console.log(now);
	res.send('hola');
});
export default routerr;
