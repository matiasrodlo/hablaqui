import store from '~/store';
import axios from '~/plugins/axios';

const login = async payload => {
	try {
		const { data } = await axios('/auth/login', {
			method: 'post',
			data: payload,
		});

		store.commit('User/setUserProfile', null);
		store.commit('User/setRefreshToken', data.refreshToken);
		store.commit('User/setToken', data.token);
		store.commit('User/setProfile', data.user);
		return data;
	} catch (e) {}
};

// const loginWithGoogle = () => {
// 	window.location.href = google_auth_url;
// };

const registerTempUser = async payload => {
	const { data } = await axios('/auth/register-temp', {
		method: 'post',
		data: payload,
	});
	return data;
};

const register = async payload => {
	const { data } = await axios('/auth/register', {
		method: 'post',
		data: {
			payload,
		},
	});
	store.commit('User/setRefreshToken', data.refreshtoken);
	store.commit('User/setToken', data.token);
	store.commit('User/setProfile', data.user);
	return data;
};

const guestRegister = async (payload, token) => {
	const { data } = await axios('/auth/guest/register-guest-person', {
		method: 'post',
		data: payload,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	store.commit('User/setToken', data.token);
	store.commit('User/setProfile', data.user);
	return data;
};

const evaluateGuestPerson = async (personId, token) => {
	const { data } = await axios(`/auth/guest/evaluate-guest-person/${personId}`, {
		method: 'get',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	store.commit('User/setToken', data.token);
	store.commit('User/setProfile', data.user);
	return data;
};

const getToken = () => {
	const vuex = JSON.parse(localStorage.getItem('vuex'));
	if (vuex && vuex.User && vuex.User.token) return vuex.User.token;
	else return null;
};

const setUserWithToken = async ({ token, refreshToken }) => {
	store.commit('User/setToken', token);
	store.commit('User/setRefreshToken', refreshToken);
	const { data } = await axios('/user/profile', { method: 'get' });
	store.commit('User/setProfile', data.profile);
};

const getUser = () => {
	const vuex = JSON.parse(localStorage.getItem('vuex'));
	if (vuex && vuex.User && vuex.User.profile) {
		return vuex.User.profile;
	}
};

const getAdmin = () => {
	const vuex = JSON.parse(localStorage.getItem('vuex'));
	if (vuex && vuex.User) {
		if (vuex.User.profileUser) {
			return vuex.User.profileUser;
		} else return false;
	}
};

const setUser = profile => {
	store.commit('User/setProfile', profile);
};

const setToken = token => {
	store.commit('User/setToken', token);
};

const setRefreshToken = refreshToken => {
	store.commit('User/setRefreshToken', refreshToken);
};

const unSetToken = () => {
	localStorage.removeItem('vuex');
};

const logout = () => {
	try {
		store.commit('User/setToken', null);
		store.commit('User/setRefreshToken', null);
		store.commit('User/setProfile', {});
		localStorage.removeItem('vuex');
	} catch (e) {
		// console.error('Error al cerrar sesion');
	}
};

const loginWith = async function (type, data) {
	switch (type) {
		case 'local':
			return await login(data);
		case 'google':
			// loginWithGoogle();
			break;
		case 'google-after-login':
			await setUserWithToken(data);
			break;
	}
};

const loggedIn = () => {
	const vuex = JSON.parse(localStorage.getItem('vuex'));
	if (vuex && vuex.User) {
		const token = vuex.User.token; // Getting token from localstorage
		const user = vuex.User.profile;
		return !!token && !!user; // handwaiving here
	} else return false;
};

export {
	getAdmin,
	evaluateGuestPerson,
	getToken,
	getUser,
	guestRegister,
	loggedIn,
	loginWith,
	logout,
	registerTempUser,
	register,
	setToken,
	unSetToken,
	setUser,
	setRefreshToken,
};
