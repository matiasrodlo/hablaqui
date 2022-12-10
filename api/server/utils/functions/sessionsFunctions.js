import Sessions from '../../models/sessions';
import { priceFormatter } from './priceFormatter';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

const extractPrice = price => {
	const priceArray = price.split(',');
	let priceNumber = priceArray[0].replace('$', '');
	priceNumber = priceNumber + priceArray[1];
	return priceNumber;
};

export const paymentInfoFunction = async psyId => {
	let allSessions = await Sessions.find({
		psychologist: psyId,
	}).populate('user');

	// Filtramos que cada session sea de usuarios con pagos success y no hayan expirado
	allSessions = allSessions.filter(item =>
		item.plan.some(plan => {
			return (
				plan.payment === 'success' &&
				plan.title !== 'compromiso privado'
			);
		})
	);
	const validPayments = allSessions.flatMap(item => {
		if (item.user)
			return item.plan.flatMap(plans => {
				// Cantidad de dinero a restar
				let amountDueTotal = 0;
				let amountDue = 0;
				let paymentPlanDate = dayjs
					.tz(dayjs(plans.datePayment))
					.format('DD/MM/YYYY');

				let sessions = plans.session.map(session => {
					let transDate =
						session.paymentDate &&
						dayjs(session.paymentDate, 'MM/DD/YYYY').isValid()
							? dayjs(session.paymentDate, 'MM/DD/YYYY').format(
									'DD/MM/YYYY'
							  )
							: session.requestDate &&
							  dayjs(session.requestDate).isValid()
							? 'Pendiente'
							: 'Por cobrar';
					transDate =
						session.status === 'pending'
							? 'Por realizar'
							: transDate;
					return {
						_id: session._id,
						datePayment: dayjs(
							session.date,
							'MM/DD/YYYY HH:mm'
						).format('DD/MM/YYYY'),
						name: item.user.name ? item.user.name : '',
						lastname: item.user.lastName ? item.user.lastName : '',
						date: dayjs(session.date, 'MM/DD/YYYY HH:mm').format(
							'DD/MM/YYYY HH:mm'
						),
						sessionsNumber: `${session.sessionNumber} de ${plans.totalSessions}`,
						amount: priceFormatter(+plans.sessionPrice),
						hablaquiPercentage: 0,
						mercadoPercentage: (
							plans.sessionPrice * 0.0351
						).toFixed(2),
						percentage: '3.51%',
						total: priceFormatter(
							+(plans.sessionPrice * (1 - 0.0351)).toFixed(0)
						),
						status: session.status,
						transDate,
					};
				});

				const lastSession = sessions[sessions.length - 1];
				const pendingsToPay = sessions.filter(
					s => s.transDate === 'Pendiente'
				).length;

				const pendingsToDo = sessions.filter(
					s => s.transDate === 'Por realizar'
				).length;

				const receivable = sessions.filter(
					session => session.transDate === 'Por cobrar'
				).length;

				for (
					let i = sessions.length + 1;
					i <= plans.totalSessions;
					i++
				) {
					let session = {
						_id: null,
						datePayment: '---',
						name: item.user.name ? item.user.name : '',
						lastname: item.user.lastName ? item.user.lastName : '',
						date: '---',
						sessionsNumber: `${i} de ${plans.totalSessions}`,
						amount: priceFormatter(+plans.sessionPrice),
						hablaquiPercentage: 0,
						mercadoPercentage: (
							plans.sessionPrice * 0.0351
						).toFixed(2),
						percentage: '3.51%',
						total: priceFormatter(
							+(plans.sessionPrice * (1 - 0.0351)).toFixed(0)
						),
						status: 'pending',
						transDate: 'Por agendar',
					};
					if (Date.parse(plans.expiration) < Date.now()) {
						session.transDate = 'Expirado';
						amountDueTotal += Number(extractPrice(session.total));
						amountDue += Number(extractPrice(session.amount));
						session.total = '$0';
						session.amount = '$0';
						session.mercadoPercentage = '0';
					}
					sessions.push(session);
				}
				const expirated = sessions.filter(
					session => session.transDate === 'Expirado'
				).length;

				if (
					expirated > 0 &&
					pendingsToPay === 0 &&
					receivable === 0 &&
					pendingsToDo === 0
				) {
					paymentPlanDate = 'Expirado';
				}

				/*sessions = sessions.filter(
					session => session.status === 'success'
				);*/

				const lastname = item.user.lastName ? item.user.lastName : '';
				return {
					idPlan: plans._id,
					sessionsId: item._id,
					name: item.user.name
						? item.user.name + ' ' + lastname
						: lastname,
					lastname,
					plan: plans.title,
					payment: plans.payment,
					suscription: plans.period,
					user: item.user._id,
					datePayment: paymentPlanDate,
					amount: priceFormatter(+plans.totalPrice - amountDue),
					finalAmount: priceFormatter(
						+(
							plans.totalPrice * (1 - 0.0351) -
							amountDueTotal
						).toFixed(0)
					),
					sessions,
					transState:
						pendingsToPay > 0
							? 'Pendiente'
							: receivable > 0
							? 'Por cobrar'
							: pendingsToDo > 0
							? 'Por realizar'
							: 'Cobrado',
					sessionsNumber: lastSession
						? lastSession.sessionsNumber
						: '- de ' + sessions.length,
				};
			});
	});
	const payments = validPayments.filter(item => {
		return (
			item &&
			item.payment === 'success' &&
			item.plan !== 'compromiso privado' &&
			item.suscription !== 'Plan inicial'
		);
	});
	return payments;
};

export const formattedSchedule = (schedule, day, hour) => {
	let validHour = false;
	const week = [
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
		'sunday',
	];
	day = dayjs.tz(day).format('dddd');
	week.forEach(weekDay => {
		if (day.toLowerCase() === weekDay)
			if (Array.isArray(schedule[weekDay]))
				validHour = schedule[weekDay].some(interval => {
					return dayjs(hour, 'HH:mm').isBetween(
						dayjs(interval[0], 'HH:mm'),
						dayjs(interval[1], 'HH:mm'),
						undefined,
						'[)'
					);
				});
			else if (schedule[weekDay] === 'busy') validHour = false;
	});

	return validHour;
};

export const getLastSessionFromPlan = (sessions, sessionId, planId) => {
	let session = sessions.plan
		.flatMap(plan => {
			let maxSession = plan.session.map(session =>
				dayjs
					.tz(dayjs(session.date, 'MM/DD/YYYY HH:mm'))
					.format('YYYY/MM/DD HH:mm')
			);
			maxSession = maxSession.sort((a, b) => new Date(b) - new Date(a));
			return plan.session.flatMap(session => {
				return {
					session_id: session._id,
					plan_id: plan._id,
					totalSessions: plan.totalSessions,
					date: session.date,
					datePayment: plan.datePayment,
					lastSession: maxSession[0],
					remainingSessions: plan.remainingSessions,
				};
			});
		})
		.filter(
			session =>
				sessionId === session.session_id.toString() ||
				planId === session.plan_id.toString()
		);

	return session[0];
};

// Utilizado en mi agenda, para llenar el calendario de sesiones user o psicologo
export const setSession = (role, sessions) => {
	return sessions.flatMap(item => {
		let name = '';
		let lastName = '';
		let idUser = item.user && item.user._id ? item.user._id : item._id;

		// Establece nombre de quien pertenece cada sesion
		if (role === 'psychologist') {
			if (item.user && item.user._id) {
				name = item.user.name;
				lastName = item.user.lastName ? item.user.lastName : '';
			} else {
				name = 'Compromiso privado';
				lastName = '';
			}
		} else if (role === 'user') {
			name = item.psychologist.name;
			lastName = item.psychologist.lastName
				? item.psychologist.lastName
				: '';
		}
		return item.plan.flatMap(plan => {
			if (plan.title === 'Mensajería y videollamada')
				plan.title = 'sesion online';
			else if (plan.title === 'Acompañamiento vía mensajería')
				plan.title = 'sesion online';
			else if (plan.title === 'Sesiones por videollamada')
				plan.title = 'sesion online';

			return plan.session.map(session => {
				const start = dayjs(session.date, 'MM/DD/YYYY HH:mm').format(
					'YYYY-MM-DD HH:mm'
				);
				const end = dayjs(session.date, 'MM/DD/YYYY HH:mm')
					.add(60, 'minutes')
					.format('YYYY-MM-DD HH:mm');

				return {
					_id: session._id,
					date: session.date,
					title: plan.title,
					details: `Sesion con ${name}`,
					totalPrice: plan.totalPrice,
					sessionPrice: plan.sessionPrice,
					end,
					idPsychologist: item.psychologist._id,
					idUser,
					name: `${name} ${lastName}`,
					paidToPsychologist: session.paidToPsychologist,
					sessionNumber: session.sessionNumber,
					sessionsId: item._id,
					start,
					status: session.status,
					statusPlan: plan.payment,
					idPlan: plan._id,
					url: item.roomsUrl,
					numberSessionSuccess: item.numberSessionSuccess,
					activePlan:
						plan.payment === 'success' &&
						dayjs().isBefore(dayjs(plan.expiration)),
				};
			});
		});
	});
};
