import { remove } from 'js-cookie';

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
	logoutUser(state) {
		remove('authentication-cookie');
		state.user = null;
		state.token = null;
		state.loggedIn = false;
	},
};
