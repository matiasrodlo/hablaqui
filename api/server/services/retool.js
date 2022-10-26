import Psychologist from '../models/psychologist';
import Appointments from '../models/appointments';
import { okResponse } from '../utils/responses/functions';
import Sessions from '../models/sessions';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween, utc, timezone);
dayjs.tz.setDefault('America/Santiago');

const getNextSessions = async () => {
	let sessions = await Sessions.find().populate('psychologist user');
	//console.log(sessions);
	sessions = sessions.filter(s => s.user !== null && s.psychologist !== null);
	const plans = sessions
		.flatMap(s => {
			const plan = s.plan.pop();
			const planActived =
				plan.payment === 'success' &&
				dayjs(plan.expiration).isAfter(dayjs());

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
				const isNextSession =
					s.status !== 'success' && dayjs(s.date).isAfter(dayjs());
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
					isNextSession,
				};
			});
		})
		.filter(ns => ns.isNextSession)
		.sort((a, b) => new Date(a.date) - new Date(b.date));
	return okResponse('psicologos obtenidos', { nextSessions });
};

const getSessionsPayment = async (startDate, endDate) => {
	let sessions = await Sessions.find().populate('psychologist user');
	sessions = sessions.filter(s => !!s.psychologist);

	let flatSession = sessions.flatMap(s => {
		const plan = s.plan.pop();
		return plan.session.flatMap(ss => {
			return {
				_id: s.psychologist._id.toString(),
				psy: s.psychologist.name + ' ' + s.psychologist.lastName,
				psyPhone: s.psychologist.phone ? s.psychologist.phone : '--',
				psyEmail: s.psychologist.email,
				price: plan.sessionPrice,
				date: ss.date,
				status: ss.status,
			};
		});
	});

	flatSession = flatSession.filter(s =>
		dayjs(s.date).isBetween(dayjs(startDate), dayjs(endDate))
	);

	let auxFlatSession = [];
	flatSession.forEach(s => {
		const resp = auxFlatSession.find(e => e && e._id === s._id);
		if (!resp) auxFlatSession.push(s);
		else auxFlatSession[auxFlatSession.indexOf(resp)].price += s.price;
	});

	return okResponse('psicologos obtenidos', { psyPayments: auxFlatSession });
};

const fixSpecialities = async () => {
	let psychologists = await Psychologist.find();
	let appointments = await Appointments.find();
	appointments = JSON.stringify(appointments);
	appointments = JSON.parse(appointments);
	let arrayAppointments = [];

	appointments.forEach(item => {
		arrayAppointments.push(item.name);
	});

	for (let j = 0; j < psychologists.length; j++) {
		const arraySpecialities = [];
		for (let i = 0; i < psychologists[j].specialties.length; i++) {
			const index = arrayAppointments.indexOf(
				psychologists[j].specialties[i]
			);
			if (index !== -1)
				arraySpecialities.push(psychologists[j].specialties[i]);
		}
		psychologists[j].specialties = arraySpecialities;
		await psychologists[j].save();
	}
	return okResponse('app', { psychologists });
};

const retoolService = {
	getNextSessions,
	getSessionsPayment,
	fixSpecialities,
};

export default Object.freeze(retoolService);
