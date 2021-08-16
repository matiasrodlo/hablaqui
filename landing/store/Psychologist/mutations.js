export default {
	setPsychologists(state, value) {
		state.psychologists = value;
	},
	setSessions(state, value) {
		state.sessions = value;
	},
	setSessionsFormatted(state, value) {
		state.sessionsFormatted = value;
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
