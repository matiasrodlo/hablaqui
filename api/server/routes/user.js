import { Router } from 'express';
import passport from 'passport';
import userController from '../controllers/users';
import userSchema from '../schemas/user';
import validation from '../middleware/validation';
import grantAccess from '../middleware/strategies/rbac';

const userRouter = Router();

userRouter.get(
	'/user/profile/:id',
	[
		passport.authenticate('jwt', { session: true }),
		grantAccess('readOwn', 'profile'),
	],
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

userRouter.patch(
	'/user/update/password',
	[
		passport.authenticate('jwt', { session: true }),
		/*grantAccess('updateOwn', 'profile'),*/
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
		validation(userSchema.updateAvatar, 'body'),
	],
	userController.updateAvatar
);

userRouter.get(
	'/user/sessions',
	[passport.authenticate('jwt', { session: true })],
	userController.getSessions
);
export default userRouter;
