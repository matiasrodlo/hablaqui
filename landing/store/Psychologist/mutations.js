import moment from 'moment';
import updateObjectInArray from '@/plugins/updateArray';

export default {
	setPsychologists(state, value) {
		state.psychologists = value;
	},
	setSessions(state, value) {
		state.sessions = value;
	},
	setPayments(state, value) {
		state.payments = value;
	},
	setCustomSessions(state, value) {
		state.sessions.push(value);
	},
	setOneSessions(state, { payload, id }) {
		state.sessions = updateObjectInArray(
			state.sessions,
			payload.find(session => session._id === id)
		);
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
