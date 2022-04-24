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
	async verifyEmail({ commit }, id) {
		try {
			await this.$axios(`/auth/user/verification/${id}`, {
				method: 'put',
			});
		} catch (error) {
			snackBarError(error)(commit);
		}
	},
	async updateOne({ commit }, payload) {
		try {
			delete payload.finishedSessions;
			const { data } = await this.$axios(`/user/update-one/${payload._id}`, {
				method: 'put',
				data: payload,
			});
			snackBarSuccess(data.message)(commit);
			return data.user;
		} catch (error) {
			snackBarError(error)(commit);
		}
	},
	async registerUser({ commit }, payload) {
		try {
			const { data } = await this.$axios('/user/register', {
				method: 'post',
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
			const { data } = await this.$axios('/user/upload/avatar', {
				method: 'put',
				data: payload,
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			snackBarSuccess(data.message)(commit);
			return data;
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
	async setOnline({ commit }) {
		try {
			await this.$axios('/user/set-status/online', {
				method: 'post',
			});
		} catch (error) {
			snackBarError(error)(commit);
		}
	},
	async setOffline({ commit }) {
		try {
			await this.$axios('/user/set-status/offline', {
				method: 'post',
			});
		} catch (error) {
			snackBarError(error)(commit);
		}
	},
};
