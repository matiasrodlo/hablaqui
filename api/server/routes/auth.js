'use strict';

import { Router } from 'express';
import passport from 'passport';
import authController from '../controllers/auth';
import validation from '../middleware/validation';
import authSchema from '../schemas/auth';

const authRouter = Router();

/**
 * @description: Autenticación del login
 * @param {Object} user - Usuario logeado
 * @returns: Objeto con token de autenticación y usuario
 */
authRouter.post(
	'/auth/login',
	[validation(authSchema.login, 'body'), passport.authenticate('local')],
	authController.login
);

/**
 * @description: Logout
 */
authRouter.post('/auth/logout', authController.logout);

/**
 * No se usa.
 */
authRouter.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/plus.login',
			'https://www.googleapis.com/auth/userinfo.email',
		],
	}),
	authController.generateJwt
);

authRouter.get(
	'/auth/google/callback',
	passport.authenticate('google', {
		session: false,
		failureRedirect: process.env.FRONTEND_URL + '/auth',
	}),
	authController.googleAuthCallback
);

/**
 * @description: Registro de usuario
 * @param {string} body.password - Contraseña de registro
 * @param {string} body.email - Email de registro
 * @returns: Objeto con token de autenticación y usuario
 */
authRouter.post(
	'/auth/register',
	validation(authSchema.register, 'body'),
	authController.register
);

/**
 * @description: Recuperación de contraseña
 * @param {string} params.email - Email de recuperación
 */
authRouter.get(
	'/auth/send-password-recover/:email',
	authController.sendPasswordRecover
);

/**
 * @description: Cambio de contraseña
 * @param {Object} user - Usuario logeado
 * @param {string} body.password - Nueva contraseña
 * @access: authenticated
 */
authRouter.put(
	'/auth/user/password',
	passport.authenticate('jwt'),
	authController.changeUserPassword
);

/**
 * @description: Verificación del correo del usuario
 * @param {string} params.id - Identificador único del usuario siendo verificado
 * @returns: Objeto con token de autenticación y usuario
 * @access: authenticated
 */
authRouter.put(
	'/auth/user/verification/:id',
	passport.authenticate('jwt'),
	authController.changeVerifiedStatus
);

export default authRouter;
