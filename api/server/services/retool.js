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
				userPhone: s.user.phone ? s.user.phone : '--',
				psyPhone: s.psychologist.phone ? s.psychologist.phone : '--',
				userEmail: s.user.email,
				psyEmail: s.psychologist.email,
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
					_id: s._id,
					sessionNumber: s.sessionNumber + '/' + plan.totalSessions,
					date: s.date,
					user: p.user,
					userPhone: p.userPhone,
					psyPhone: p.psyPhone,
					userEmail: p.userEmail,
					psyEmail: p.psyEmail,
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
