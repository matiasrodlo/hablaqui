'use strict';

import { Router } from 'express';
import passport from 'passport';
import userController from '../controllers/users';
import userSchema from '../schemas/user';
import validation from '../middleware/validation';
import multer from '../middleware/multer';
import storage from '../middleware/storage';

const userRouter = Router();

userRouter.get(
	'/user/profile',
	[passport.authenticate('jwt', { session: true })],
	userController.getUser
);

userRouter.put(
	'/user/update/profile',
	[
		passport.authenticate('jwt', { session: true }),
		/*grantAccess('updateOwn', 'profile'),*/
		validation(userSchema.updateProfile, 'body'),
	],
	userController.updateProfile
);

// Pasword recovery
userRouter.patch(
	'/user/reset-password',
	[passport.authenticate('jwt', { session: true })],
	userController.passwordRecovery
);

userRouter.patch(
	'/user/update/password',
	[
		passport.authenticate('jwt', { session: true }),
		validation(userSchema.updatePassword, 'body'),
	],
	userController.updatePassword
);

userRouter.put(
	'/user/update/plan',
	[
		passport.authenticate('jwt', { session: true }),
		validation(userSchema.updatePlan, 'body'),
	],
	userController.updatePlan
);

userRouter.put(
	'/user/update/psychologist',
	[
		passport.authenticate('jwt', { session: true }),
		validation(userSchema.updatePsychologist, 'body'),
	],
	userController.updatePsychologist
);

userRouter.put(
	'/user/update/avatar',
	[
		passport.authenticate('jwt', { session: true }),
		multer.single('avatar'),
		storage,
	],
	userController.updateAvatar
);

userRouter.get(
	'/user/sessions',
	[passport.authenticate('jwt', { session: true })],
	userController.getSessions
);

/**
 * Pone al usuario loggeado como "en linea"
 * NECESITA AUTENTICACION.
 */
userRouter.post(
	'/user/set-status/online',
	[passport.authenticate('jwt', { session: true })],
	userController.setUserOnline
);

/**
 * Pone al usuario loggeado como "desconectado"
 * NECESITA AUTENTICACION.
 */
userRouter.post(
	'/user/set-status/offline',
	[passport.authenticate('jwt', { session: true })],
	userController.setUserOffline
);

export default userRouter;
