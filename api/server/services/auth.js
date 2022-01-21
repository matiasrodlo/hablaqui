'use strict';

import '../config/config.js';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import Sessions from '../models/sessions';
import { sign } from 'jsonwebtoken';
import { logError, logInfo } from '../config/pino';
import { actionInfo } from '../utils/logger/infoMessages';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import mailService from '../services/mail';
import moment from 'moment';

var Analytics = require('analytics-node');
var analytics = new Analytics(process.env.SEGMENT_API_KEY);

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
	if (user.role === 'user') {
		return getFormattedSessions(await Sessions.find({ user: user._id }));
	}

	if (user.role === 'psychologist')
		return getFormattedSessions(
			await Sessions.find({ psychologist: user.psychologist })
		);

	return null;
};

const getFormattedSessions = sessions => {
	sessions = JSON.stringify(sessions);
	sessions = JSON.parse(sessions);
	sessions = sessions.map(item => {
		return {
			_id: item._id,
			psychologist: item.psychologist,
			roomsUrl: item.roomsUrl,
			user: item.user,
			numberSessionSuccess: item.numberSessionSuccess,
			plan: item.plan.map(plan => {
				return {
					...plan,
					activePlan:
						plan.payment === 'success' &&
						moment(plan.expiration).isBefore(moment(Date.now())),
				};
			}),
		};
	});
	return sessions;
};

const generateUser = async user => {
	return {
		_id: user._id,
		avatar: user.avatar,
		avatarThumbnail: user.avatarThumbnail,
		birthDate: user.birthDate,
		direction: user.direction,
		email: user.email,
		finishedSessions: user.finishedSessions,
		google: user.google,
		gender: user.gender,
		googleId: user.googleId,
		hasPaid: user.hasPaid,
		inviteCode: user.inviteCode,
		lastName: user.lastName,
		name: user.name,
		onboarding: user.onboarding,
		phone: user.phone,
		plan: user.plan,
		psychologist: user.psychologist,
		role: user.role,
		rut: user.rut,
		sessions: await getSessions(user),
		state: user.state,
		timeZone: user.timeZone,
	};
};

const register = async payload => {
	if (await User.exists({ email: payload.email })) {
		return conflictResponse('Correo electronico en uso');
	}

	if (payload.role === 'psychologist')
		if (await User.exists({ rut: payload.rut }))
			return conflictResponse('Rut en uso');

	const newUser = {
		...payload,
		email: payload.email.toLowerCase(),
		password: bcrypt.hashSync(payload.password, 10),
	};
	const user = await User.create(newUser);
	// Segment identification
	analytics.identify({
		userId: user._id.toString(),
		traits: {
			name: user.name,
			email: user.email,
			type: user.role,
		},
	});
	analytics.track({
		userId: user._id.toString(),
		event: 'organic-user-signup',
		properties: {
			name: user.name,
			email: user.email,
			type: user.role,
		},
	});

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

	const recoveryUrl = `${process.env.VUE_APP_LANDING}/password-reset?token=${token}`;

	mailService.sendPasswordRecovery(user, recoveryUrl);

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
	getFormattedSessions,
};

export default Object.freeze(authService);
