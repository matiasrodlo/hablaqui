export default {
	setPsychologists(state, value) {
		state.psychologists = value;
	},
	setResumeView(state, value) {
		state.resumeView = value;
	},
	setLoading(state) {
		state.loading = !state.loading;
	},
};
