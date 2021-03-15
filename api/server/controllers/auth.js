import authService from '../services/auth';

const authController = {
	register(req, res) {
		const { body } = req;
		return authService.register(body, res);
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
