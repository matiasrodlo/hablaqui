import moment from 'moment';

export default {
	user: state => state.user,
	token: state => state.token,
	loggedIn: state => state.loggedIn,
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

		// retornamos el plan success y sin expirar
		let plan = plans.find(
			item => item.payment === 'success' && moment().isBefore(moment(item.expiration))
		);
		// retornamos el ultimo plan succes y que expiro
		if (!plan) plan = plans.find(item => item.diff === min);
		// retornamos el siguiente plan pendiente
		if (!plan) plan = plans.find(item => item.diff === max);
		return plan;
	},
};
