import axios from '@/plugins/axios';
import { snackBarError, snackBarSuccess } from '@/utils/snackbar';
import router from '@/router';

export default {
	async login({ commit }, payload) {
		try {
			const { data } = await axios('/auth/login', {
				method: 'post',
				data: payload,
			});
			console.log(data);
			commit('setUser', data.user);
			commit('setToken', data.token);
			router.push({ name: 'blog' });
		} catch (e) {
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
			console.log(data);
			commit('setUser', data.user);
			commit('setToken', data.token);
			router.push({ name: 'blog' });
			snackBarSuccess(data.message)(commit);
		} catch (error) {
			snackBarError(error)(commit);
		}
	},
};
