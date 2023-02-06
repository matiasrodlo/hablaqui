import Specialist from '../models/specialist';
import Appointments from '../models/appointments';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import Coupon from '../models/coupons';
import Sessions from '../models/sessions';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import badMutable from 'dayjs/plugin/badMutable';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
dayjs.extend(badMutable);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.tz.setDefault('America/Santiago');

const getNextSessions = async () => {
	/*
	Retorna las proximas sesiones de los especialistas.
	De momento esta función no tiene entradas.
	*/
	// Se obtienen las sesiones de todos los especialistas
	let sessions = await Sessions.find().populate('specialist user');

	// Se filtran las sesiones que no tienen especialista ni usuario
	sessions = sessions.filter(s => s.user !== null && s.specialist !== null);

	// Se obtienen el último plan activo con sesiones.
	const plans = sessions
		.flatMap(s => {
			// Se obtiene el último plan de la sesion, se verifica que el plan esté pagado y no haya expirado
			const plan = s.plan.pop();
			const planActived =
				plan.payment === 'success' &&
				dayjs(plan.expiration).isAfter(dayjs());
			// Devuelve un objeto con el último plan
			return {
				user: s.user.name + ' ' + s.user.lastName,
				spec: s.specialist.name + ' ' + s.specialist.lastName,
				userPhone: s.user.phone ? s.user.phone : '--',
				specPhone: s.specialist.phone ? s.specialist.phone : '--',
				userEmail: s.user.email,
				specEmail: s.specialist.email,
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
					s.status !== 'success' && dayjs(s.date).isAfter(dayjs());
				// Devuelve un objeto con la proxima sesion
				return {
					_id: s._id,
					sessionNumber: s.sessionNumber + '/' + plan.totalSessions,
					date: s.date,
					user: p.user,
					userPhone: p.userPhone,
					specPhone: p.specPhone,
					userEmail: p.userEmail,
					specEmail: p.specEmail,
					specialist: p.spec,
					status: s.status,
					isNextSession,
				};
			});
		})
		.filter(ns => ns.isNextSession)
		.sort((a, b) => new Date(a.date) - new Date(b.date));
	return okResponse('especialistas obtenidos', { nextSessions });
};

const getSessionsPayment = async (startDate, endDate) => {
	/*
	Retorna las sesiones pagadas entre las fechas indicadas.
	Tiene como entrada las fechas de inicio y fin.
	*/
	// Se obtienen las sesiones unido con el especialista
	let sessions = await Sessions.find().populate('specialist user');

	// Se filtran las sesiones que se ha inicializado la variable de especialista
	sessions = sessions.filter(s => !!s.specialist);

	let flatSession = sessions.flatMap(s => {
		// Se obtiene el plan de una sesión
		const plan = s.plan.pop();
		return plan.session.flatMap(ss => {
			// Se deja en un mismo array los datos del especialista, la sesion y el precio del plan
			return {
				_id: s.specialist._id.toString(),
				spec: s.specialist.name + ' ' + s.specialist.lastName,
				specPhone: s.specialist.phone ? s.specialist.phone : '--',
				specEmail: s.specialist.email,
				price: plan.sessionPrice,
				date: ss.date,
				status: ss.status,
			};
		});
	});

	// Se filtra de flatSession las sesiones pagadas entre las fechas indicadas
	flatSession = flatSession.filter(s =>
		dayjs(s.date).isBetween(dayjs(startDate), dayjs(endDate))
	);

	// Se agrupan las sesiones por especialista y se suman los precios
	let auxFlatSession = [];
	flatSession.forEach(s => {
		const resp = auxFlatSession.find(e => e && e._id === s._id);
		if (!resp) auxFlatSession.push(s);
		else auxFlatSession[auxFlatSession.indexOf(resp)].price += s.price;
	});

	return okResponse('especialistas obtenidos', {
		specPayments: auxFlatSession,
	});
};

const fixSpecialities = async () => {
	let specialists = await Specialist.find();
	let appointments = await Appointments.find();
	appointments = JSON.stringify(appointments);
	appointments = JSON.parse(appointments);
	let arrayAppointments = [];

	appointments.forEach(item => {
		arrayAppointments.push(item.name);
	});

	for (let j = 0; j < specialists.length; j++) {
		const arraySpecialities = [];
		for (let i = 0; i < specialists[j].specialties.length; i++) {
			const index = arrayAppointments.indexOf(
				specialists[j].specialties[i]
			);
			if (index !== -1)
				arraySpecialities.push(specialists[j].specialties[i]);
		}
		specialists[j].specialties = arraySpecialities;
		await specialists[j].save();
	}
	return okResponse('app', { specialists });
};

const getMountToPay = async user => {
	if (user.role !== 'superuser')
		return conflictResponse('No puedes emplear esta acción');
	const specialists = await Specialist.find();
	let amounts = [];

	for (let spec in specialists) {
		let sessions = await Sessions.find({
			specialist: specialists[spec]._id,
		}).populate('user');
		sessions = sessions.filter(s => !!s.user);
		const plans = sessions
			.flatMap(s =>
				s.plan.map(p => {
					return {
						title: p.title,
						payment: p.payment,
						session: p.session,
						sessionPrice: p.sessionPrice,
						usedCoupon: p.usedCoupon,
						name: s.user.name,
						email: s.user.email,
					};
				})
			)
			.filter(p => p.title !== 'Plan inicial' && p.payment === 'success');
		let session = plans.flatMap(p => {
			return {
				sessions: p.session.filter(
					item => !item.paidToSpecialist && item.status === 'success'
				),
				price: p.sessionPrice,
				coupon: p.usedCoupon,
				name: p.name,
				email: p.email,
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
					date: dayjs
						.tz(dayjs(s.date, 'MM/DD/YYYY HH:mm'))
						.format('DD/MM/YYYY HH:mm'),
					_id: s._id,
					status: s.status,
					name: item.name,
					email: item.email,
					sessionNumber: s.sessionNumber,
					price: item.price,
					coupon: item.coupon,
				};
			})
		);
		amounts.push({
			_id: specialists[spec]._id,
			name: specialists[spec].name,
			lastName: specialists[spec].lastName,
			email: specialists[spec].email,
			username: specialists[spec].username,
			paymentMethod: specialists[spec].paymentMethod,
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
