import userService from '../services/users';
import { errorCallback } from '../utils/functions/errorCallback';
import { restResponse } from '../utils/responses/functions';

const userController = {
	async getUser(req, res) {
		try {
			const { id } = req.params;
			const { data, code } = await userService.getProfile(id);
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
