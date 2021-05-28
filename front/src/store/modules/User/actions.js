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
			commit('setUser', data.user);
			commit('setToken', data.token);
			commit('setLoggedIn');
			if (data.user.role == 'psychologist') {
				router.push({ name: 'perfil' });
			} else {
				// Psi seleccionado en boton agenda cita online
				const psi = JSON.parse(localStorage.getItem('psi'));
				// si no tiene plan y tiene psi pre-seleccionado
				if (!data.user.myPlan && psi) {
					router.push({ name: 'plan' });
					// si no tiene plan y no hay psi seleccionado
				} else if (!data.user.myPlan) {
					router.push({ name: 'evaluacion' });
					// o entonces enviamos a perfil
				} else {
					localStorage.removeItem('psi');
					router.push({ name: 'perfil' });
				}
			}
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
			commit('setUser', data.user);
			commit('setToken', data.token);
			commit('setLoggedIn');
			// Psi seleccionado en boton agenda cita online
			const psi = JSON.parse(localStorage.getItem('psi'));
			// si no tiene plan y tiene psi pre-seleccionado
			if (!data.user.myPlan && psi) {
				router.push({ name: 'plan' });
				// si no tiene plan y no hay psi seleccionado
			} else if (!data.user.myPlan) {
				localStorage.removeItem('psi');
				router.push({ name: 'evaluacion' });
				// o entonces enviamos a perfil
			} else {
				localStorage.removeItem('psi');
				router.push({ name: 'perfil' });
			}
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
