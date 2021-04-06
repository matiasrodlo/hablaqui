import authService from '../services/auth';
import { restResponse } from '../utils/responses/functions';
import { errorCallback } from '../utils/functions/errorCallback';

const authController = {
	async register(req, res) {
		try {
			const { body } = req;
			const { data, code } = await authService.register(body, res);
			return restResponse(data, code, res);
		} catch (error) {
			errorCallback(error, res, 'Error obteniendo los psicologos');
		}
	},
	generateJwt(req, res) {
		const { user } = req;
		const token = authService.generateJwt(user);
		const response = {
			token,
		};
		res.json(response);
	},
	sendPasswordRecover(req, res) {
		const { email } = req.body;
		return authService.sendPasswordRecover(email, res);
	},
	changeUserPassword(req, res) {
		const { password } = req.body;
		const user = req.user;
		return authService.changeUserPassword(user, password, res);
	},
	googleAuthCallback(req, res) {
		authService.googleAuthCallback(req, res);
	},
};

export default Object.freeze(authController);
