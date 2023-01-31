'use strict';

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
				user.id,
				profile
			);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error actualizando perfil');
		}
	},
	async updateSpecialist(req, res) {
		try {
			const { user, newSpecialist, oldSpecialist } = req.body;
			const { data, code } = await userService.updateSpecialist(
				user,
				newSpecialist,
				oldSpecialist
			);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error actualizando especialista');
		}
	},
	async updateOne(req, res) {
		try {
			const { id } = req.params;
			const profile = req.body;
			const { data, code } = await userService.updateProfile(id, profile);
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
	async uploadAvatar(req, res) {
		try {
			const { body, file, user } = req;
			const { data, code } = await userService.uploadAvatar({
				...body,
				avatar: file.avatar,
				avatarThumbnail: file.avatarThumbnail,
				userLogged: {
					role: user.role,
					email: user.email,
				},
			});
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(
				e,
				res,
				'Error actualizando/subiendo imágen de perfil'
			);
		}
	},
	async setUserOnline(req, res) {
		try {
			const { user } = req;
			const { data, code } = await userService.setUserOnline(user);

			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error actualizando el estado');
		}
	},
	async setUserOffline(req, res) {
		try {
			const { user } = req;
			const { data, code } = await userService.setUserOffline(user);

			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res, 'Error actualizando el estado');
		}
	},
	async registerUser(req, res) {
		try {
			const { user, body } = req;
			const { data, code } = await userService.registerUser(user, body);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error registrando un usuario');
		}
	},
	async changeSpecialist(req, res) {
		try {
			const { sessionId } = req.params;
			const { data, code } = await userService.changeSpecialist(
				sessionId
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error añadiendo la evaluación');
		}
	},
};

export default userController;
