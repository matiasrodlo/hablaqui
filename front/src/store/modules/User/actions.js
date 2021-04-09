import axios from '@/plugins/axios';
import { snackBarError, snackBarSuccess } from '@/utils/snackbar';
import router from '@/router';

export default {
	async login({ commit }, payload) {
		try {
			console.log('action');
			const { data } = await axios('/auth/login', {
				method: 'post',
				data: payload,
			});
			console.log(data);
			commit('setUser', data.user);
			commit('setToken', data.token);
			commit('setLoggedIn');
			router.push({ name: 'espacio' });
		} catch (e) {
			console.log(e);
			snackBarError(e)(commit);
		}
	},
	async register({ commit }, payload) {
		try {
			delete payload.repeatPassword;
			const { data } = await axios('/auth/register', {
				method: 'post',
				data: payload,
			});
			commit('setUser', data.user);
			commit('setToken', data.token);
			commit('setLoggedIn');
			router.push({ name: 'espacio' });
			snackBarSuccess(data.message)(commit);
		} catch (error) {
			snackBarError(error)(commit);
		}
	},
	async updateUser({ commit }, payload) {
		try {
			const { data } = await axios('/user/update/profile', {
				method: 'put',
				data: payload,
			});
			commit('setUser', data.user);
			snackBarSuccess(data.message)(commit);
		} catch (error) {
			snackBarError(error)(commit);
		}
	},
	async upateAvatar({ commit }, payload) {
		try {
			const { data } = await axios('/user/update/avatar', {
				method: 'put',
				data: payload,
			});
			commit('setUser', data.user);
			snackBarSuccess(data.message)(commit);
		} catch (error) {
			snackBarError(error)(commit);
		}
	},
	async upatePassword({ commit }, payload) {
		try {
			delete payload.repeatNewPassword;
			const { data } = await axios('/user/update/password', {
				method: 'patch',
				data: payload,
			});
			snackBarSuccess(data.message)(commit);
		} catch (error) {
			snackBarError(error)(commit);
		}
	},
};
