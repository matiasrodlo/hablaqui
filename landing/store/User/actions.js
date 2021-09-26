import { snackBarError, snackBarSuccess } from '@/utils/snackbar';

export default {
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
