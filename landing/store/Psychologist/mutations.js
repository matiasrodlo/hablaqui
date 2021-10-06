import moment from 'moment';

export default {
	setPsychologists(state, value) {
		state.psychologists = value;
	},
	setSessions(state, value) {
		state.sessions = value;
	},
	setSessionsFormatted(state, sessions) {
		moment.locale('es');
		state.sessionsFormatted = sessions.map(session => ({
			...session,
			text: moment(session.value).format('ddd'),
		}));
	},
	setClients(state, value) {
		state.clients = value;
	},
	setResumeView(state, value) {
		state.resumeView = value;
	},
	setLoading(state) {
		state.loading = !state.loading;
	},
};
