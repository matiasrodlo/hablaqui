import { snackBarError, snackBarSuccess } from '@/utils/snackbar';

export default {
	// Antiguo endpoint desde vue js
	// async login({ commit }, payload) {
	// 	try {
	// 		const { data } = await this.$axios('/auth/login', {
	// 			method: 'post',
	// 			data: payload,
	// 		});
	// 		commit('setUser', data.user);
	// 		commit('setToken', data.token);
	// 		commit('setLoggedIn');
	// 		// clear old data
	// 		localStorage.removeItem('match');
	// 		localStorage.removeItem('psi');
	// 		return !!data.user && !!data.token;
	// 	} catch (e) {
	// 		snackBarError(e)(commit);
	// 	}
	// },
	// async register({ commit }, payload) {
	// 	try {
	// 		delete payload.repeatPassword;
	// 		const { data } = await this.$axios('/auth/register', {
	// 			method: 'post',
	// 			data: payload,
	// 		});
	// 		commit('setUser', data.user);
	// 		commit('setToken', data.token);
	// 		commit('setLoggedIn');
	// 		snackBarSuccess(data.message)(commit);
	// 		return !!data.user && !!data.token;
	// 	} catch (error) {
	// 		snackBarError(error)(commit);
	// 	}
	// },
	async updateUser({ commit }, payload) {
		try {
			delete payload.finishedSessions;
			const { data } = await this.$axios('/user/update/profile', {
				method: 'put',
				data: payload,
			});
			snackBarSuccess(data.message)(commit);
			return data.user;
		} catch (error) {
			snackBarError(error)(commit);
		}
	},
	async upateAvatar({ commit }, payload) {
		try {
			const { data } = await this.$axios('/user/update/avatar', {
				method: 'put',
				data: payload,
			});
			snackBarSuccess(data.message)(commit);
			return data.user;
		} catch (error) {
			snackBarError(error)(commit);
		}
	},
	async upatePassword({ commit }, payload) {
		try {
			delete payload.repeatNewPassword;
			const { data } = await this.$axios('/user/update/password', {
				method: 'patch',
				data: payload,
			});
			snackBarSuccess(data.message)(commit);
		} catch (error) {
			snackBarError(error)(commit);
		}
	},
};
