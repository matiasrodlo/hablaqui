import '../config/config.js';
import bcrypt from 'bcrypt';
import User from '../models/user';
import { sign } from 'jsonwebtoken';
import { logError, logInfo } from '../config/pino';
import { actionInfo } from '../utils/logger/infoMessages';

const generateJwt = user => {
	const payload = {
		username: user.name,
		sub: user._id,
	};

	return sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRATION,
	});
};

const generatePasswordRecoverJwt = user => {
	const payload = {
		username: user.name,
		sub: user._id,
	};

	return sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.PASSWORD_RECOVERY_JWT_EXPIRATION,
	});
};

const getUserByEmail = async email => {
	return await User.findOne({ email: email });
};

const register = async (user, res) => {
	const newUser = new User({
		name: user.name,
		email: user.email.toLowerCase(),
		password: bcrypt.hashSync(user.password, 10),
		role: user.role,
		idPerson: user.idPerson,
		company: user.company,
		analyst: user.analyst,
	});

	try {
		const user = await newUser.save();
		logInfo(actionInfo(user.email, 'se registro con exito'));
		return res.status(201).json({ token: generateJwt(user), user });
	} catch (error) {
		logError(error);
		return res.status(409).json({
			status: false,
			error,
		});
	}
};

const sendPasswordRecover = async (email, res) => {
	const user = await getUserByEmail(email);
	if (!user) {
		return res.sendStatus(404);
	} else {
		const token = generatePasswordRecoverJwt(user);
		logInfo(actionInfo(email, 'solicito una recuperación de contraseña'));
		return res.sendStatus(200);
	}
};

const changeUserPassword = async (user, newPassword, res) => {
	try {
		await User.findByIdAndUpdate(user._id, {
			password: bcrypt.hashSync(newPassword, 10),
		});
		logInfo(actionInfo(user.email, 'cambio su contraseña'));
		res.sendStatus(200);
	} catch (e) {
		/*We handle the possible not found User error*/
		logError(e);
		res.sendStatus(404);
	}
};

const googleAuthCallback = (req, res) => {
	const frontendUrL = process.env.FRONTEND_URL;
	const jwt = generateJwt(req.user);
	//Esta es la unica manera segura de enviarle el jwt al front
	//La otra forma era enviar un html con js incluido, pero el jwt se quedaba asignado en la ruta de la api.
	res.redirect(frontendUrL + '/?token=' + jwt);
};

const authService = {
	generateJwt,
	register,
	sendPasswordRecover,
	changeUserPassword,
	googleAuthCallback,
};

export default Object.freeze(authService);
