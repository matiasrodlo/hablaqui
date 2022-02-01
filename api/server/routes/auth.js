'use strict';

import { Router } from 'express';
import passport from 'passport';
import authController from '../controllers/auth';
import validation from '../middleware/validation';
import authSchema from '../schemas/auth';
import permission from '../middleware/permission';

const { corsApi } = permission;

const authRouter = Router();

/**
 * Endpoint de autenticacion.
 */
authRouter.post(
	'/auth/login',
	[
		corsApi,
		validation(authSchema.login, 'body'),
		passport.authenticate('local'),
	],
	authController.login
);
/**
 * Endpoint de logout.
 */
authRouter.post('/auth/logout', [corsApi], authController.logout);

/**
 * No se usa.
 */
authRouter.get(
	'/auth/google',
	[
		corsApi,
		passport.authenticate('google', {
			scope: [
				'https://www.googleapis.com/auth/plus.login',
				'https://www.googleapis.com/auth/userinfo.email',
			],
		}),
	],
	authController.generateJwt
);

authRouter.get(
	'/auth/google/callback',
	[
		corsApi,
		passport.authenticate('google', {
			session: false,
			failureRedirect: process.env.FRONTEND_URL + '/auth',
		}),
	],
	authController.googleAuthCallback
);

/**
 * Endpoint de registro.
 * req.body = { email: string, password: string }
 */
authRouter.post(
	'/auth/register',
	[corsApi, validation(authSchema.register, 'body')],
	authController.register
);

/**
 * Recuperar contraseña
 * req.body = { email: string }
 */
authRouter.get(
	'/auth/send-password-recover/:email',
	[corsApi],
	authController.sendPasswordRecover
);

/**
 * Cambiar contraseña
 * req.body = { password: string }
 */
authRouter.put(
	'/auth/user/password',
	[corsApi, passport.authenticate('jwt')],
	authController.changeUserPassword
);

export default authRouter;
