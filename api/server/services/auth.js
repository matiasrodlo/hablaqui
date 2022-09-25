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

// estaba pensando cambiar los var por let. Además me llama la ateción que se importe de una manera distinta que en chat.js
var Analytics = require('analytics-node'); // Analytics-node sirve para integrar analiticas en cualquier aplicación.
var analytics = new Analytics(process.env.SEGMENT_API_KEY); // SEGMENT_API_KEY es una variable de entorno que contiene la clave de segment

const generateJwt = user => { // genera el token de autenticación
	const payload = { // el payload es el objeto que se codifica en el token
		username: user.name, // el nombre de usuario
		sub: user._id, // el id del usuario
	};

	return sign(payload, process.env.JWT_SECRET, { // sign es una función de jsonwebtoken que genera el token, JTM_SECRET es la clave secreta
		expiresIn: process.env.JWT_EXPIRATION, // 30d
	});
};
// async es una función asíncrona, asincrona significa que no se ejecuta en el orden en que se escribe
const login = async user => { // login es una función que recibe un usuario y devuelve un objeto con la información del usuario y el token de autenticación
	if (
		process.env.API_URL.includes('hablaqui.cl') || // si la url de la api incluye hablaqui.cl o si la variable de entorno DEBUG_ANALYTICS es true
		process.env.DEBUG_ANALYTICS === 'true' // Debug_analytics es una variable de entorno que se usa para debuggear
	) {
		analytics.track({ // track es una función de analytics-node que envía información a segment, segment es una plataforma de analiticas
			userId: user._id.toString(), // el id del usuario
			event: 'login', // el evento que se está enviando
			properties: {
				name: user.name, // el nombre del usuario
				lastName: user.lastName, // el apellido del usuario
				email: user.email, // el correo del usuario
				role: user.role, // el rol del usuario
			},
		});
	}
	// comentado por JESUS marzo/24/2022 porque interrumpe el flujo
	//el objeto user debe contener, ahora, un elemento isVerified que indica si la cuenta está o no verificada
	// if (user.role === 'user' && !user.isVerified)
	// 	return conflictResponse('Verifica tu correo');
	return okResponse(`Bienvenido ${user.name}`, { // okResponse es una función que genera una respuesta http con código 200
		token: generateJwt(user),	// generateJwt es una función que genera el token de autenticación
		user: await generateUser(user), // generateUser es una función que genera el objeto user
	});
};

const logout = async user => {
	if (
		process.env.API_URL.includes('hablaqui.cl') || // si la url de la api incluye hablaqui.cl o si la variable de entorno DEBUG_ANALYTICS es true
		process.env.DEBUG_ANALYTICS === 'true' // Debug_analytics es una variable de entorno que se usa para debuggear
	) {
		analytics.track({ // track es una función de analytics-node que envía información a segment, segment es una plataforma de analiticas
			userId: user._id.toString(), // el id del usuario
			event: 'logout', // el evento que se está enviando
			properties: { // las propiedades del evento
				name: user.name, // el nombre del usuario
				lastName: user.lastName, // el apellido del usuario
				email: user.email, // el correo del usuario
				role: user.role, // el rol del usuario
			},
		});
	}
	return okResponse('Sesión cerrada exitosamente'); // okResponse es una función que genera una respuesta http con código 200
};

const getSessions = async user => { // getSessions es una función que devuelve las sesiones de un usuario
	if (user.role === 'user') { // si el rol del usuario es user
		return await Sessions.find({ user: user._id }); // devuelve las sesiones del usuario, Sessions es el modelo de sesión siendo user el id del usuario
	}

	if (user.role === 'psychologist')
		return await Sessions.find({ psychologist: user.psychologist });

	return null; // si el rol del usuario no es user o psychologist devuelve null
};

const generateUser = async user => { // generateUser es una función que genera el objeto user
	return {
		_id: user._id, // el id del usuario
		avatar: user.avatar, // el avatar del usuario
		avatarThumbnail: user.avatarThumbnail, // el avatarThumbnail del usuario, el avatarThumbnail es una versión más pequeña del avatar
		birthDate: user.birthDate, // la fecha de nacimiento del usuario
		direction: user.direction, // la dirección del usuario
		email: user.email, // el correo del usuario
		finishedSessions: user.finishedSessions, // las sesiones finalizadas del usuario
		google: user.google, // si el usuario se registró con google
		gender: user.gender, // el género del usuario
		googleId: user.googleId, // el id de google del usuario
		hasPaid: user.hasPaid, // si el usuario ha pagado
		inviteCode: user.inviteCode, // el código de invitación del usuario
		lastName: user.lastName, // el apellido del usuario
		name: user.name, // el nombre del usuario
		onboarding: user.onboarding, 
		phone: user.phone, // el teléfono del usuario
		plan: user.plan, // el plan del usuario
		psychologist: user.psychologist, // el psicólogo del usuario
		role: user.role, // el rol del usuario
		rut: user.rut, // el rut del usuario
		sessions: await getSessions(user), // las sesiones del usuario
		state: user.state, // el estado del usuario
		timeZone: user.timeZone, // la zona horaria del usuario
		isVerified: user.isVerified, // si el usuario está verificado
	};
};

const register = async payload => { // register es una función que registra un usuario
	if (await User.exists({ email: payload.email })) { // si existe un usuario con el correo del payload
		return conflictResponse('Correo electronico en uso'); // conflictResponse es una función que genera una respuesta http con código 409
	}
	if (payload.role === 'psychologist') // si el rol del payload es psychologist
		if (await User.exists({ rut: payload.rut })) // si existe un usuario con el rut del payload
			return conflictResponse('Rut en uso'); // conflictResponse es una función que genera una respuesta http con código 409
	const newUser = { // newUser es un objeto que contiene los datos del usuario
		...payload, // los datos del payload
		isInvited: false, // si el usuario es invitado
		email: payload.email.toLowerCase(), // el correo del usuario en minúsculas
		password: bcrypt.hashSync(payload.password, 10), // la contraseña del usuario encriptada
	};
	const user = await User.create(newUser); // crea un usuario con los datos de newUser, User es el modelo de usuario
	// Enviar correo de verificación
	const token = generateJwt(user); // generateJwt es una función que genera el token de autenticación
	const verifyurl = `${process.env.VUE_APP_LANDING}/verificacion-email?id=${user._id}&token=${token}`; // la url de verificación

	if (process.env.NODE_ENV === 'development') // si el entorno es development
		logInfo(actionInfo(payload.email, `url: ${verifyurl}`)); // logInfo es una función que imprime en consola la información del usuario y la url de verificación
	else await mailServiceAccount.sendVerifyEmail(user, verifyurl); // si el entorno no es development envía el correo de verificación

	// Segment identification
	if (
		process.env.API_URL.includes('hablaqui.cl') || // si la url de la api incluye hablaqui.cl
		process.env.DEBUG_ANALYTICS === 'true' // o si el entorno de debug de analytics es true
	) {
		analytics.identify({ // identifica al usuario en segment, segment es una herramienta de análisis de datos
			userId: user._id.toString(), // el id del usuario
			traits: { // las propiedades del usuario
				name: user.name, // el nombre del usuario
				email: user.email, // el correo del usuario
				type: user.role, // el rol del usuario
			},
		});
		analytics.track({ // registra el evento de registro en segment
			userId: user._id.toString(), // el id del usuario
			event: 'organic-user-signup', // el evento de registro
			properties: { // las propiedades del evento
				name: user.name, // el nombre del usuario
				email: user.email, // el correo del usuario
				type: user.role, // el rol del usuario
			},
		});
	}

	logInfo(actionInfo(user.email, 'Sé registro exitosamente')); // logInfo es una función que imprime en consola la información del usuario y el mensaje de registro exitoso
	if (user.role === 'user') { // si el rol del usuario es user
		await mailServiceAccount.sendWelcomeNewUser(user); // envía el correo de bienvenida al usuario
	}
	return okResponse(`Bienvenido ${user.name}`, { // okResponse es una función que genera una respuesta http con código 200
		user: await generateUser(user), // el usuario
		token: generateJwt(user), // el token de autenticación
	});
};

/**
 * token generator - password recovery
 * @param {Object} user
 * @returns string Token
 */
const generatePasswordRecoverJwt = user => { // generatePasswordRecoverJwt es una función que genera el token de recuperación de contraseña
	const payload = { // el payload del token
		username: user.name, // el nombre del usuario
		sub: user._id, // el id del usuario
	};

	return sign(payload, process.env.JWT_SECRET, { // sign es una función de jsonwebtoken que genera el token
		expiresIn: process.env.PASSWORD_RECOVERY_JWT_EXPIRATION, // la expiración del token
	});
};

const getUserByEmail = async email => { // getUserByEmail es una función que obtiene un usuario por su correo
	return await User.findOne({ email: email }); // User es el modelo de usuario
};

const sendPasswordRecover = async email => { // sendPasswordRecover es una función que envía el correo de recuperación de contraseña
	const user = await getUserByEmail(email); // obtiene el usuario por su correo
	if (!user) { // si no existe el usuario
		return conflictResponse('Este usuario no existe'); // conflictResponse es una función que genera una respuesta http con código 409
	}
	const token = generatePasswordRecoverJwt(user); // generatePasswordRecoverJwt es una función que genera el token de recuperación de contraseña

	const recoveryUrl = `${process.env.VUE_APP_LANDING}/password-reset?token=${token}`; // la url de recuperación de contraseña

	mailServiceAccount.sendPasswordRecovery(user, recoveryUrl); // envía el correo de recuperación de contraseña

	if (process.env.NODE_ENV === 'development') // si el entorno es development
		logInfo(actionInfo(email, `url: ${recoveryUrl}`)); // logInfo es una función que imprime en consola la información del usuario y la url de recuperación de contraseña
	else logInfo(actionInfo(email, 'solicito una recuperación de contraseña')); // logInfo es una función que imprime en consola la información del usuario y el mensaje de solicitud de recuperación de contraseña

	return okResponse('Sé le ha enviado un correo electronico'); // okResponse es una función que genera una respuesta http con código 200
};

const changeUserPassword = async (user, newPassword, res) => { // changeUserPassword es una función que cambia la contraseña de un usuario
	try { // intenta
		await User.findByIdAndUpdate(user._id, { // Encontrar y actualizar el usuario
			password: bcrypt.hashSync(newPassword, 10), // cambia la contraseña del usuario
		});
		logInfo(actionInfo(user.email, 'cambio su contraseña')); // logInfo es una función que imprime en consola la información del usuario y el mensaje de cambio de contraseña
		res.sendStatus(200); // envía un código 200
	} catch (e) { // si ocurre un error
		/*We handle the possible not found User error*/
		logError(e); // logError es una función que imprime en consola el error
		res.sendStatus(404); // envía un código 404
	}
};

const changeVerifiedStatus = async id => { // changeVerifiedStatus es una función que cambia el estado de verificación de un usuario
	const user = await User.findById(id); // obtiene el usuario por su id

	if (!user) return conflictResponse('Este usuario no existe'); // retorna una respuesta http con código 409 si el usuario no existe

	user.isVerified = true; // cambia el estado de verificación del usuario a true
	await user.save(); // guarda el usuario
	if (user.role === 'user') await mailServiceAccount.sendWelcomeNewUser(user); // envía el correo de bienvenida al usuario

	return okResponse('Cuenta verificada');
};

const googleAuthCallback = (req, res) => { // googleAuthCallback es una función que maneja la respuesta de google
	const frontendUrL = process.env.FRONTEND_URL; // la url del frontend
	const jwt = generateJwt(req.user); // el token de autenticación
	//Esta es la unica manera segura de enviarle el jwt al front
	//La otra forma era enviar un html con js incluido, pero el jwt se quedaba asignado en la ruta de la api.
	res.redirect(frontendUrL + '/?token=' + jwt); // redirecciona a la url del frontend con el token de autenticación
};

const authService = { // authService es un objeto que contiene las funciones de autenticación
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

export default Object.freeze(authService); // exporta authService como un objeto inmutable
