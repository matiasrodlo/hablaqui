export default {
	setUser(state, value) {
		state.user = value;
	},
	setToken(state, value) {
		state.token = value;
	},
	setOnBoarding(state, value) {
		if (value) state.onBoarding = value;
		else state.onBoarding = !state.onBoarding;
	},
	setStep(state, value) {
		state.step = value;
	},
	setLoggedIn(state) {
		state.loggedIn = !!state.user && !!state.token;
	},
	setListenerUserOnline(state, value) {
		state.listenerUserOnline = value;
	},
	reset(state) {
		state.user = {};
		state.token = '';
		state.loggedIn = false;
	},
};
