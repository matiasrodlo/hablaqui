import Psychologist from '../models/psychologist';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import Sessions from '../models/sessions';
import moment from 'moment';
moment.tz.setDefault('America/Santiago');

const getNextSessions = async () => {
	let sessions = await Sessions.find().populate('psychologist user');
	//console.log(sessions);
	sessions = sessions.filter(s => s.user !== null && s.psychologist !== null);
	const plans = sessions
		.flatMap(s => {
			const plan = s.plan.pop();
			const planActived =
				plan.payment === 'success' &&
				moment(plan.expiration).isAfter(moment());

			return {
				user: s.user.name + ' ' + s.user.lastName,
				psy: s.psychologist.name + ' ' + s.psychologist.lastName,
				plan,
				planActived,
			};
		})
		.filter(p => p.planActived && p.plan.session.length !== 0);
	const nextSessions = plans
		.flatMap(p => {
			const plan = p.plan;
			return plan.session.flatMap(s => {
				return {
					date: s.date,
					user: p.user,
					psychologist: p.psy,
					status: s.status,
				};
			});
		})
		.filter(ns => ns.status !== 'success')
		.sort((a, b) => new Date(a.date) - new Date(b.date));
	return okResponse('psicologos obtenidos', { nextSessions });
};

const retoolService = {
	getNextSessions,
};

export default Object.freeze(retoolService);
