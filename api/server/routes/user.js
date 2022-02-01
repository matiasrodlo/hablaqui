'use strict';

import { Router } from 'express';
import passport from 'passport';
import userController from '../controllers/users';
import userSchema from '../schemas/user';
import validation from '../middleware/validation';
import multer from '../middleware/multer';
import storageAvatar from '../middleware/avatar/storage';
import permission from '../middleware/permission';
import cors from 'cors';

const { corsApi } = permission;

const userRouter = Router();

/** register consultante
 * req.body = {
 * 	name = string(requerido),
 * 	email = string(requerido),
 * 	rut = string,
 * 	phone = string
 * }
 */
userRouter.post(
	'/user/register',
	[
		cors(corsApi),
		passport.authenticate('jwt', { session: true }),
		validation(userSchema.newUserByPsy, 'body'),
	],
	userController.registerUser
);

userRouter.get(
	'/user/profile',
	[cors(corsApi), passport.authenticate('jwt', { session: true })],
	userController.getUser
);

userRouter.put(
	'/user/update/profile',
	[
		cors(corsApi),
		passport.authenticate('jwt', { session: true }),
		/*grantAccess('updateOwn', 'profile'),*/
		validation(userSchema.updateProfile, 'body'),
	],
	userController.updateProfile
);

userRouter.put(
	'/user/update-one/:id',
	[cors(corsApi), passport.authenticate('jwt', { session: true })],
	userController.updateOne
);

// Pasword recovery
userRouter.patch(
	'/user/reset-password',
	[cors(corsApi), passport.authenticate('jwt', { session: true })],
	userController.passwordRecovery
);

userRouter.patch(
	'/user/update/password',
	[
		cors(corsApi),
		passport.authenticate('jwt', { session: true }),
		validation(userSchema.updatePassword, 'body'),
	],
	userController.updatePassword
);

userRouter.put(
	'/user/update/plan',
	[
		cors(corsApi),
		passport.authenticate('jwt', { session: true }),
		validation(userSchema.updatePlan, 'body'),
	],
	userController.updatePlan
);

userRouter.put(
	'/user/update/psychologist',
	[
		cors(corsApi),
		passport.authenticate('jwt', { session: true }),
		validation(userSchema.updatePsychologist, 'body'),
	],
	userController.updatePsychologist
);

/**
 * Nuevo endpoint para actualizar/subir foto de perfil
 * after parser by multer req.body = {
 * 	_id: id de del usuario a actualizar avatar,
 * 	role: role del usuario a actualizar avatar,
 * 	name: nombre del usuario a actualizar avatar,
 * 	lastName: apellido del usuario a actualizar avatar,
 *  idPsychologist: Para actualizar elavatar del psicologo
 * }
 */
userRouter.put(
	'/user/upload/avatar',
	[
		cors(corsApi),
		passport.authenticate('jwt', { session: true }),
		multer.single('avatar'),
		storageAvatar,
	],
	userController.uploadAvatar
);

/**
 * Pone al usuario loggeado como "en linea"
 * NECESITA AUTENTICACION.
 */
userRouter.post(
	'/user/set-status/online',
	[cors(corsApi), passport.authenticate('jwt', { session: true })],
	userController.setUserOnline
);

/**
 * Pone al usuario loggeado como "desconectado"
 * NECESITA AUTENTICACION.
 */
userRouter.post(
	'/user/set-status/offline',
	[cors(corsApi), passport.authenticate('jwt', { session: true })],
	userController.setUserOffline
);

/**
 * Endpoint para subir una evaluación de un usuario sobre un psicólogo
 * req.body = {
 * 	comment: comentario del usuario sobre el psicólogo,
 * 	global: puntuación goblar sobre el psicólogo por parte del usuario,
 * 	puntuality: puntuación respecto a la puntualidad,
 * 	attention: puntuación sobre la atención del psicólogo,
 *  internet: puntuación respecto a la conexión,
 *  like: comentario sobre lo que le gusto del psicólogo,
 *  improve: comentario sobre lo que el psicólogo debe mejorar
 * }
 */
userRouter.post(
	'/user/evaluation:/:psyId',
	[cors(corsApi), passport.authenticate('jwt', { session: true })],
	userController.addEvaluation
);

export default userRouter;
