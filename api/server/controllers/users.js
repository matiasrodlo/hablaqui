import userService from '../services/users';
import { errorCallback } from '../utils/functions/errorCallback';
import { restResponse } from '../utils/responses/functions';

const userController = {
	async getUser(req, res) {
		try {
			const { user } = req;
			const { data, code } = await userService.getProfile(user._id);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res);
		}
	},
	async updateProfile(req, res) {
		try {
			const { user } = req;
			const profile = req.body;
			const { data, code } = await userService.updateProfile(
				user,
				profile
			);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error actualizando perfil');
		}
	},
	async passwordRecovery(req, res) {
		try {
			const { user } = req;
			const { password } = req.body;
			const { data, code } = await userService.passwordRecovery(
				user,
				password
			);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error actualizando contraseña');
		}
	},
	async updatePassword(req, res) {
		try {
			const { user } = req;
			const { oldPassword, newPassword } = req.body;
			const { data, code } = await userService.updatePassword(
				user,
				oldPassword,
				newPassword
			);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error actualizando contraseña');
		}
	},
	async updatePlan(req, res) {
		try {
			const { user } = req;
			const { newPlan } = req.body;
			const { data, code } = await userService.updatePlan(user, newPlan);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error actualizando el plan');
		}
	},

	async updatePsychologist(req, res) {
		try {
			const { user } = req;
			const { newPsychologist } = req.body;
			const { data, code } = await userService.updatePlan(
				user,
				newPsychologist
			);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error actualizando el psicologo');
		}
	},

	async updateAvatar(req, res) {
		try {
			const { user, file } = req;
			const { data, code } = await userService.updateAvatar(
				user,
				file.cloudStoragePublicUrl
			);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error actualizando el avatar');
		}
	},

	async getSessions(req, res) {
		try {
			const { user } = req;
			const { data, code } = await userService.getSessions(user);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error consiguiendo las sesiones');
		}
	},
};

export default userController;
