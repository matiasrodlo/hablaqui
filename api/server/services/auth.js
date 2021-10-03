'use strict';

import '../config/config.js';
import bcrypt from 'bcrypt';
import User from '../models/user';
import { sign } from 'jsonwebtoken';
import { logError, logInfo } from '../config/pino';
import { actionInfo } from '../utils/logger/infoMessages';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import mailService from '../services/mail';
import crypto from 'crypto';

const generateJwt = user => {
	const payload = {
		username: user.name,
		sub: user._id,
	};

	return sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRATION,
	});
};

const login = async user => {
	let userDB = await User.findOne(user.email);
	// Check whether the user has been verified or not. If not, we return a conflict response.
	if (!userDB.isEmailVerified) {
		return conflictResponse('Correo no verificado');
	}
	return okResponse(`Bienvenido ${user.name}`, {
		user,
		token: generateJwt(user),
	});
};

const register = async payload => {
	if (await User.exists({ email: payload.email })) {
		return conflictResponse('Correo electronico en uso');
	}

	const newUser = {
		...payload,
		email: payload.email.toLowerCase(),
		password: bcrypt.hashSync(payload.password, 10),
	};
	const user = await User.create(newUser);
	logInfo(actionInfo(user.email, 'Sé registro exitosamente'));
	if (user.role === 'user') {
		await mailService.sendWelcomeNewUser(user);
		const token = {
			token: crypto.randomBytes(20).toString('hex'),
			user: user._id,
			type: 'verifyEmail',
			createdAt: undefined,
		};
		// To find the id later {"token._id": ObjectId('')}
		await User.findByIdAndUpdate(user._id, { token: token });
	}
	return okResponse(`Bienvenido ${user.name}`, {
		user,
		token: generateJwt(user),
	});
};

// const generatePasswordRecoverJwt = user => {
// 	const payload = {
// 		username: user.name,
// 		sub: user._id,
// 	};

// 	return sign(payload, process.env.JWT_SECRET, {
// 		expiresIn: process.env.PASSWORD_RECOVERY_JWT_EXPIRATION,
// 	});
// };

const getUserByEmail = async email => {
	return await User.findOne({ email: email });
};

const sendPasswordRecover = async (email, res) => {
	const user = await getUserByEmail(email);
	if (!user) {
		return res.sendStatus(404);
	} else {
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
	login,
	generateJwt,
	register,
	sendPasswordRecover,
	changeUserPassword,
	googleAuthCallback,
};

export default Object.freeze(authService);
