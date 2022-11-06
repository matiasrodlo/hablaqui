import moment from 'moment-timezone';
moment.tz.setDefault('America/Santiago');

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
				diff: moment(plan.expiration).diff(moment(), 'days'),
			}))
		);
		const min = Math.max(...plans.map(el => el.diff).filter(el => el <= 0));
		const max = Math.max(...plans.map(el => el.diff).filter(el => el >= 0));

		const filterPlans = plans.filter(
			item => item.payment === 'success' && moment().isBefore(moment(item.expiration))
		);
		const totalSessions = filterPlans.reduce(
			(sum, value) =>
				typeof value.totalSessions === 'number' ? sum + value.totalSessions : sum,
			0
		);

		const appoinmentSessions = filterPlans.reduce(
			(sum, value) =>
				typeof value.session.length === 'number' ? sum + value.session.length : sum,
			0
		);
		let sortedPlans = filterPlans
			.filter(item => item.remainingSessions !== 0)
			.sort((a, b) => a.diff - b.diff);

		if (!sortedPlans.length && filterPlans.length > 0)
			sortedPlans = [filterPlans.sort((a, b) => a.diff - b.diff).pop()];

		// retornamos el plan success y sin expirar
		// retornamos el ultimo plan succes y que expiro
		if (!sortedPlans) sortedPlans = [plans.find(item => item.diff === min)];
		// retornamos el siguiente plan pendiente
		if (!sortedPlans) sortedPlans = [plans.find(item => item.diff === max)];
		return { sortedPlans, totalSessions, appoinmentSessions };
	},
};
