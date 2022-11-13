import Psychologist from '../models/psychologist';
import Appointments from '../models/appointments';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import Coupon from '../models/coupons';
import Sessions from '../models/sessions';
import moment from 'moment';
moment.tz.setDefault('America/Santiago');

const getNextSessions = async () => {
	/*
	Retorna las proximas sesiones de los psicologos.
	De momento esta función no tiene entradas.
	*/
	// Se obtienen las sesiones de todos los psicologos
	let sessions = await Sessions.find().populate('psychologist user');

	// Se filtran las sesiones que no tienen psicologo ni usuario
	sessions = sessions.filter(s => s.user !== null && s.psychologist !== null);

	// Se obtienen el último plan activo con sesiones.
	const plans = sessions
		.flatMap(s => {
			// Se obtiene el último plan de la sesion, se verifica que el plan esté pagado y no haya expirado
			const plan = s.plan.pop();
			const planActived =
				plan.payment === 'success' &&
				moment(plan.expiration).isAfter(moment());
			// Devuelve un objeto con el último plan
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

	let flatSession = sessions.flatMap(s => {
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

const getMountToPay = async user => {
	if (user.role !== 'superuser')
		return conflictResponse('No puedes emplear esta acción');
	const psychologists = await Psychologist.find();
	let amounts = [];

	for (let psy in psychologists) {
		let sessions = await Sessions.find({
			psychologist: psychologists[psy]._id,
		});
		sessions = sessions.filter(s => !!s.user);
		const plans = sessions
			.flatMap(s => s.plan)
			.filter(p => p.title !== 'Plan inicial' && p.payment === 'success');
		let session = plans.flatMap(p => {
			return {
				sessions: p.session.filter(
					item =>
						!item.paidToPsychologist && item.status === 'success'
				),
				price: p.sessionPrice,
				coupon: p.usedCoupon,
			};
		});
		let total = 0;
		for (let i = 0; i < session.length; i++) {
			if (session[i].coupon) {
				const coupon = await Coupon.findOne({
					code: session[i].coupon,
				});
				if (coupon.discountType === 'percentage')
					session[i].price =
						session[i].price / (coupon.discount / 100);
				else session[i].price += coupon.discount;
			}
			total += session[i].price * session[i].sessions.length;
		}
		session = session.flatMap(item =>
			item.sessions.flatMap(s => {
				return {
					date: moment(s.date, 'MM/DD/YYYY HH:mm').format(
						'DD/MM/YYYY HH:mm'
					),
					_id: s._id,
					status: s.status,
					sessionNumber: s.sessionNumber,
					price: item.price,
					coupon: item.coupon,
				};
			})
		);
		amounts.push({
			_id: psychologists[psy]._id,
			name: psychologists[psy].name,
			lastName: psychologists[psy].lastName,
			email: psychologists[psy].email,
			username: psychologists[psy].username,
			total,
			session,
		});
	}

	return okResponse('Planes', { amounts });
};

const retoolService = {
	getNextSessions,
	getSessionsPayment,
	fixSpecialities,
	getMountToPay,
};

export default Object.freeze(retoolService);
