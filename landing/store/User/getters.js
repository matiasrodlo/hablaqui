import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc, timezone);
dayjs.tz.setDefault('America/Santiago');

export default {
	user: (state, getters, rootState) => rootState.auth.user,
	token: state => state.token,
	loggedIn: state => state.loggedIn,
	onBoarding: state => state.onBoarding,
	stepLinks: state => state.stepLinks,
	step: state => state.step,
	listenerUserOnline: state => state.listenerUserOnline,
	plan: (state, getters, rootState) => {
		const user = rootState.auth.user;
		if (!user || user.role !== 'user') return null;
		// Obtenemos un array con todo los planes solamente
		const plans = rootState.auth.user.sessions.flatMap(item =>
			item.plan.map(plan => ({
				...plan,
				idSessions: item._id,
				psychologist: item.psychologist,
				user: item.user,
				// numero de sessiones concluidas
				success: item.numberSessionSuccess,
				// dias de diferencia entre el dia que expiró y hoy
				diff: dayjs(plan.expiration).diff(dayjs(), 'days'),
			}))
		);
		const min = Math.max(...plans.map(el => el.diff).filter(el => el <= 0));
		const max = Math.max(...plans.map(el => el.diff).filter(el => el >= 0));

		// retornamos el plan success y sin expirar
		let plan = plans.find(
			item => item.payment === 'success' && dayjs().isBefore(dayjs(item.expiration))
		);
		// retornamos el ultimo plan succes y que expiro
		if (!plan) plan = plans.find(item => item.diff === min);
		// retornamos el siguiente plan pendiente
		if (!plan) plan = plans.find(item => item.diff === max);
		return plan;
	},
};
