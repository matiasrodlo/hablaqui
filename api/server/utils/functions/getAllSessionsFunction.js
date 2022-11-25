import Sessions from '../../models/sessions';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

export const getAllSessionsFunction = async psy => {
	let sessions = await Sessions.find({
		psychologist: psy,
	}).populate('psychologist user');

	sessions = sessions.flatMap(item => {
		let name = '';
		let lastName = '';

		// Establece nombre de quien pertenece cada sesion
		if (item.user && item.user._id) {
			name = item.user.name;
			lastName = item.user.lastName ? item.user.lastName : '';
		} else {
			name = 'Compromiso privado';
			lastName = '';
		}
		return item.plan.flatMap(plan => {
			return plan.session.map(session => {
				const expiration =
					plan.payment === 'pending' &&
					dayjs().isAfter(dayjs(plan.expiration));
				let requestDate = session.requestDate
					? session.requestDate
					: 'Por cobrar';
				if (requestDate !== 'Por cobrar')
					requestDate = dayjs(requestDate).format('YYYY/MM/DD HH:mm');
				let paymentDate = session.requestDate
					? session.requestDate
					: 'Por cobrar';
				if (paymentDate !== 'Por cobrar')
					paymentDate = dayjs(paymentDate).format('YYYY/MM/DD HH:mm');
				return {
					_id: session._id,
					date: session.date,
					sessionPrice: plan.sessionPrice,
					idPsychologist: item.psychologist._id,
					name: `${name} ${lastName}`,
					paidToPsychologist: session.paidToPsychologist,
					sessionsNumber: `${session.sessionNumber}/${plan.totalSessions}`,
					sessionsId: item._id,
					status: session.status,
					statusPlan: plan.payment,
					suscription: plan.period,
					idPlan: plan._id,
					paymentPlanDate: dayjs(plan.datePayment).format(
						'YYYY/MM/DD HH:mm'
					),
					requestDate,
					paymentDate,
					request: session.request ? session.request : 'none',
					hablaquiPercentage: 0,
					mercadoPercentage: plan.sessionPrice * 0.0351,
					total: +(plan.sessionPrice * (1 - 0.0351)).toFixed(),
					percentage: '3.51%',
					expiration,
				};
			});
		});
	});
	sessions = sessions.filter(session => !session.expiration);
	return sessions;
};
