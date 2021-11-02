'use strict';

import '../config/config.js';
import bcrypt from 'bcrypt';
import User from '../models/user';
import Sessions from '../models/sessions';
import { sign } from 'jsonwebtoken';
import { logError, logInfo } from '../config/pino';
import { actionInfo } from '../utils/logger/infoMessages';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import mailService from '../services/mail';

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
	return okResponse(`Bienvenido ${user.name}`, {
		token: generateJwt(user),
		user: await generateUser(user),
	});
};

const getSessions = async user => {
	if (user.role === 'user') return await Sessions.findOne({ user: user._id });
	if (user.role === 'psychologist')
		return await Sessions.findOne({ psychologist: user.psychologist });
	return null;
};

const generateUser = async user => {
	return {
		_id: user._id,
		avatar: user.avatar,
		avatarThumbnail: user.avatarThumbnail,
		email: user.email,
		finishedSessions: user.finishedSessions,
		google: user.google,
		googleId: user.googleId,
		hasPaid: user.hasPaid,
		inviteCode: user.inviteCode,
		lastName: user.lastName,
		name: user.name,
		phone: user.phone,
		plan: user.plan,
		psychologist: user.psychologist,
		role: user.role,
		rut: user.rut,
		state: user.state,
		timeZone: user.timeZone,
		sessions: await getSessions(user),
	};
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
	}
	return okResponse(`Bienvenido ${user.name}`, {
		user: await generateUser(user),
		token: generateJwt(user),
	});
};

/**
 * token generator - password recovery
 * @param {Object} user
 * @returns string Token
 */
const generatePasswordRecoverJwt = user => {
	const payload = {
		username: user.name,
		sub: user._id,
	};

	return sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.PASSWORD_RECOVERY_JWT_EXPIRATION, // 40m
	});
};

const getUserByEmail = async email => {
	return await User.findOne({ email: email });
};

const sendPasswordRecover = async email => {
	const user = await getUserByEmail(email);
	if (!user) {
		return conflictResponse('Este usuario no existe');
	}
	const token = generatePasswordRecoverJwt(user);

	const recoveryUrl = `${process.env.FRONTEND_URL}
		/password-reset?token=${token}`;

	// TODO: crear aqui el envio de contraseña al email

	if (process.env.NODE_ENV === 'development')
		logInfo(actionInfo(email, `url: ${recoveryUrl}`));
	else logInfo(actionInfo(email, 'solicito una recuperación de contraseña'));

	return okResponse('Sé le ha enviado un correo electronico');
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
	generateUser,
	register,
	sendPasswordRecover,
	changeUserPassword,
	googleAuthCallback,
	getSessions,
};

export default Object.freeze(authService);
