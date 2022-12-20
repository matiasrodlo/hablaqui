'use strict';

import '../config/config.js'; // confing.js establece las variables de entorno para el trabajo local
import bcrypt from 'bcryptjs'; //  bcryptjs es función de hashing de contraseñas
import User from '../models/user'; // user.js contiene la definición del modelo de usuario para mongodb
import Sessions from '../models/sessions'; // sessions.js contiene la definición del modelo de sesión para mongodb
import { sign } from 'jsonwebtoken'; // el nombre lo dice todo
import { logError, logInfo } from '../config/pino'; // pino.js es un logger para nodejs
import { actionInfo } from '../utils/logger/infoMessages'; // recibe información sobre la acción que el usuario realiza
import { conflictResponse, okResponse } from '../utils/responses/functions'; // funciones para generar respuestas http
import mailServiceAccount from '../utils/functions/mails/accountsShares';
import Analytics from 'analytics-node';

const analytics = new Analytics(process.env.SEGMENT_API_KEY);

const generateJwt = user => {
	// Se crea el payload para el token, se genera con la clave secreta y el payload, se le asigna la expiración y se devuelve
	const payload = {
		username: user.name,
		sub: user._id,
	};

	return sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRATION,
	});
};

const login = async user => {
	// Hace el trackeo de la acción de login con segment
	if (
		process.env.API_URL.includes('hablaqui.cl') ||
		process.env.DEBUG_ANALYTICS === 'true'
	) {
		analytics.track({
			userId: user._id.toString(),
			event: 'login',
			properties: {
				name: user.name,
				lastName: user.lastName,
				email: user.email,
				role: user.role,
			},
		});
	}
	// comentado por JESUS marzo/24/2022 porque interrumpe el flujo
	//el objeto user debe contener, ahora, un elemento isVerified que indica si
	// la cuenta está o no verificada
	// if (user.role === 'user' && !user.isVerified)
	// 	return conflictResponse('Verifica tu correo');
	return okResponse(`Bienvenido ${user.name}`, {
		token: generateJwt(user),
		user: await generateUser(user),
	});
};

const logout = async user => {
	// Hace el trackeo de la acción de logout con segment
	if (
		process.env.API_URL.includes('hablaqui.cl') ||
		process.env.DEBUG_ANALYTICS === 'true'
	) {
		analytics.track({
			userId: user._id.toString(),
			event: 'logout',
			properties: {
				name: user.name,
				lastName: user.lastName,
				email: user.email,
				role: user.role,
			},
		});
	}
	return okResponse('Sesión cerrada exitosamente');
};

const getSessions = async user => {
	// Verifica el rol del usuario y devuelve las sesiones correspondientes
	if (user.role === 'user') {
		return await Sessions.find({ user: user._id });
	}

	if (user.role === 'specialist')
		return await Sessions.find({ psychologist: user.psychologist });

	return null;
};

const generateUser = async user => {
	// Genera el objeto de usuario que se devuelve en las respuestas
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
		isVerified: user.isVerified,
	};
};

const register = async payload => {
	// Verifica si el usuario ya existe, si no crea un nuevo usuario
	if (await User.exists({ email: payload.email })) {
		return conflictResponse('Correo electronico en uso');
	}
	if (payload.role === 'specialist')
		if (await User.exists({ rut: payload.rut }))
			return conflictResponse('Rut en uso');
	const newUser = {
		...payload,
		isInvited: false,
		email: payload.email.toLowerCase(),
		password: bcrypt.hashSync(payload.password, 10),
	};
	const user = await User.create(newUser);
	// Enviar correo de verificación
	const token = generateJwt(user);
	const verifyurl = `${process.env.VUE_APP_LANDING}verificacion-email?id=${user._id}&token=${token}`;

	if (process.env.NODE_ENV === 'development')
		logInfo(actionInfo(payload.email, `url: ${verifyurl}`));
	// logInfo es una función que imprime en consola la información del usuario y la url de verificación
	// else await mailServiceAccount.sendVerifyEmail(user, verifyurl); // si el entorno no es development envía el correo de verificación

	// Segment identification
	if (
		process.env.API_URL.includes('hablaqui.cl') ||
		process.env.DEBUG_ANALYTICS === 'true'
	) {
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
	}

	// Se envia el correo de bienvenida
	logInfo(actionInfo(user.email, 'Sé registro exitosamente'));
	if (user.role === 'user') {
		// si el rol del usuario es user
		await mailServiceAccount.sendWelcomeNewUser(user); // envía el correo de bienvenida al usuario
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
		expiresIn: process.env.PASSWORD_RECOVERY_JWT_EXPIRATION,
	});
};

const getUserByEmail = async email => {
	return await User.findOne({ email: email });
};

const sendPasswordRecover = async email => {
	// Busca el usuario por email y verifica si existe, genera un token y lo envia por correo
	const user = await getUserByEmail(email);
	if (!user) {
		return conflictResponse('Este usuario no existe');
	}
	const token = generatePasswordRecoverJwt(user);

	const recoveryUrl = `${process.env.VUE_APP_LANDING}password-reset?token=${token}`;

	mailServiceAccount.sendPasswordRecovery(user, recoveryUrl); // envía el correo de recuperación de contraseña

	//Correo para recuperar contraseña
	if (process.env.NODE_ENV === 'development')
		logInfo(actionInfo(email, `url: ${recoveryUrl}`));
	else logInfo(actionInfo(email, 'solicito una recuperación de contraseña'));

	return okResponse('Sé le ha enviado un correo electronico');
};

const changeUserPassword = async (user, newPassword, res) => {
	// Cambia la contraseña del usuario
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

const changeVerifiedStatus = async id => {
	// Busca el usuario, verifica que exista, cambia el estado de verificación y lo guarda
	const user = await User.findById(id);

	if (!user) return conflictResponse('Este usuario no existe');

	user.isVerified = true; // cambia el estado de verificación del usuario a true
	await user.save(); // guarda el usuario
	if (user.role === 'user') await mailServiceAccount.sendWelcomeNewUser(user); // envía el correo de bienvenida al usuario

	return okResponse('Cuenta verificada');
};

/*
const googleAuthCallback = (req, res) => {
	// googleAuthCallback es una función que maneja la respuesta de google
	const frontendUrL = process.env.FRONTEND_URL; // la url del frontend
	const jwt = generateJwt(req.user); // el token de autenticación
	//Esta es la unica manera segura de enviarle el jwt al front
	//La otra forma era enviar un html con js incluido, pero el jwt se quedaba asignado en la ruta de la api.
	res.redirect(frontendUrL + '/?token=' + jwt); // redirecciona a la url del frontend con el token de autenticación
};
*/

const authService = {
	login,
	logout,
	generateJwt,
	generateUser,
	register,
	sendPasswordRecover,
	changeUserPassword,
	getSessions,
	changeVerifiedStatus,
};

export default Object.freeze(authService);
