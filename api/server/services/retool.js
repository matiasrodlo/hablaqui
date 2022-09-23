import Psychologist from '../models/psychologist';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import Sessions from '../models/sessions';
import moment from 'moment';
moment.tz.setDefault('America/Santiago');

const getNextSessions = async () => {
	/*
	Retorna las proximas sesiones de los psicologos.
	De momento esta función no tiene entradas.
	*/
	// Se obtienen las sesiones unido con el psicologo
	let sessions = await Sessions.find().populate('psychologist user');

	// Se filtran las sesiones que no tienen psicologo
	sessions = sessions.filter(s => s.user !== null && s.psychologist !== null);

	// Se obtienen los planes que tengan sesiones y se filtran las sesiones que no tienen plan.
	const plans = sessions
		.flatMap(s => {
			// Se obtiene el plan de la sesion, se verifica que el plan esté pagado y no haya expirado
			const plan = s.plan.pop();
			const planActived =
				plan.payment === 'success' &&
				moment(plan.expiration).isAfter(moment());
			// Devuelve un objeto con la sesion y el plan
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

	// Se filtra de plans las proximas sesiones y las ordena por fecha
	const nextSessions = plans
		.flatMap(p => {
			const plan = p.plan;
			return plan.session.flatMap(s => {
				// Se obtiene si una sesion es proxima y se verifica que la sesion no haya expirado.
				const isNextSession =
					s.status !== 'success' && moment(s.date).isAfter(moment());
				// Devuelve un objeto con la proxima sesion
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
	/*
	Retorna las sesiones pagadas entre las fechas indicadas.
	Tiene como entrada las fechas de inicio y fin.
	*/
	// Se obtienen las sesiones unido con el psicologo
	let sessions = await Sessions.find().populate('psychologist user');
	
	// Se filtran las sesiones que se ha inicializado la variable de psicologo
	sessions = sessions.filter(s => !!s.psychologist);

	let flatSession = sessions
		.flatMap(s => {
			// Se obtiene el plan de una sesión
			const plan = s.plan.pop();
			return plan.session.flatMap(ss => {
				// Se deja en un mismo array los datos del psicologo, la sesion y el precio del plan
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

	// Se filtra de flatSession las sesiones pagadas entre las fechas indicadas
	flatSession = flatSession.filter(s =>
		moment(s.date).isBetween(moment(startDate), moment(endDate))
	);

	// Se agrupan las sesiones por psicologo y se suman los precios
	let auxFlatSession = [];
	flatSession.forEach(s => {
		const resp = auxFlatSession.find(e => e && e._id === s._id);
		if (!resp) auxFlatSession.push(s);
		else auxFlatSession[auxFlatSession.indexOf(resp)].price += s.price;
	});

	return okResponse('psicologos obtenidos', { psyPayments: auxFlatSession });
};

const retoolService = {
	getNextSessions,
	getSessionsPayment,
};

export default Object.freeze(retoolService);
