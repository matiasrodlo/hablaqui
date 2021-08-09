export default {
	setPsychologists(state, value) {
		state.psychologists = value;
	},
	setSessions(state, value) {
		state.sessions = value;
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
