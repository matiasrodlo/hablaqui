import moment from 'moment';
import updateObjectInArray from '@/plugins/updateArray';

export default {
	setPsychologists(state, value) {
		state.psychologists = Object.freeze(value);
	},
	setPsychologist(state, value) {
		state.psychologist = value;
	},
	setPsychologistsPagination(state, value) {
		state.psychologists = [...state.psychologists, ...value];
	},
	setLoadingPsychologist(state, value) {
		state.loadingPsychologist = value;
	},
	setTransactions(state, value) {
		state.transactions = value;
	},
	setPage(state, value) {
		state.page = value;
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
			text: moment(session.text).format('ddd'),
			day: moment(session.day, 'DD MMM').format('DD MMM'),
		}));
	},
	setSessionsFormattedAll(state, items) {
		moment.locale('es');
		state.sessionsFormattedAll = items.map(item => {
			return {
				psychologist: item.psychologist,
				sessions: item.sessions.map(el => ({
					...el,
					text: moment(el.text).format('ddd'),
					day: moment(el.day, 'DD MMM').format('DD MMM'),
				})),
			};
		});
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
