import userService from '../services/users';
import { errorCallback } from '../utils/functions/errorCallback';
import { restResponse } from '../utils/responses/functions';

const userController = {
	async sendNotificationPush(req, res) {
		try {
			const { user } = req;
			const { idPerson } = req.params;
			const { lodgingId, subtitle, type, handler } = req.body;
			const { data, code } = await userService.sendNotificationPush(
				user,
				idPerson,
				subtitle,
				'Hola',
				type,
				handler,
				lodgingId
			);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res);
		}
	},
	async deleteSharingWithMeUser(req, res) {
		try {
			const { user } = req;
			const { email } = req.body;
			const { data, code } = await userService.deleteSharingWithMeUser(user, email);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error removiendo usuario compartido');
		}
	},
	async getProfile(req, res) {
		try {
			const { user } = req;
			const { data, code } = await userService.getProfile(user._id);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res);
		}
	},
	async getUsers(req, res) {
		try {
			const { user } = req;
			const { data, code } = await userService.getUsers(user.email);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error obteniendo usuarios');
		}
	},
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
			//If the request doesnt have a file we
			const { data, code } = await userService.updateProfile(user, profile);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error actualizando perfil');
		}
	},
	async updateAvatar(req, res) {
		try {
			if (req.file) {
				const { user } = req;
				const avatar = req.file.cloudStoragePublicUrl;
				const { data, code } = await userService.updateAvatar(user, avatar);
				restResponse(data, code, res);
			} else return res.sendStatus(201);
		} catch (e) {
			errorCallback(e, res, 'Error actualizando avatar');
		}
	},
	async deleteAll(req, res) {
		try {
			const { data, code } = await userService.deleteAll(res);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res);
		}
	},
	async deleteOne(req, res) {
		try {
			await userService.deleteOne(req, res);
		} catch (e) {
			errorCallback(e, res);
		}
	},
	async updatePassword(req, res) {
		try {
			const { user } = req;
			const { password } = req.body;
			const { data, code } = await userService.updatePassword(user, password);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error actualizando contraseña');
		}
	},
	async sharePlaceAndPersons(req, res) {
		try {
			const { user } = req;
			const { email } = req.body;
			const { data, code } = await userService.sharePlaceAndPersons(user, email);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error al compartir lugar y persona');
		}
	},
	async deleteSharingWithUser(req, res) {
		try {
			const { user } = req;
			const { email } = req.body;
			const { data, code } = await userService.deleteSharingWithUser(user, email);
			restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error removiendo usuario compartido');
		}
	},
};

export default userController;
