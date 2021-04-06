export default {
	setUser(state, value) {
		state.user = value;
	},
	setToken(state, value) {
		state.token = value;
	},
	setLoggedIn(state) {
		state.loggedIn = !!state.user && !!state.token;
	},
};
