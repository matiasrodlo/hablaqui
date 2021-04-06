import { Router } from 'express';
import passport from 'passport';
import upload from '../middleware/multer';
import storage from '../middleware/storage';
import userController from '../controllers/users';
import userSchema from '../schemas/user';
import validation from '../middleware/validation';
import grantAccess from '../middleware/strategies/rbac';

const userRouter = Router();

userRouter.get(
	'/user/profile',
	[passport.authenticate('jwt', { session: false })/*, grantAccess('readOwn', 'profile')*/],
	userController.getUser
);

userRouter.get(
	'/user/profile/:id',
	[passport.authenticate('jwt', { session: false })/*, grantAccess('readOwn', 'profile')*/],
	userController.getUser
);

userRouter.put(
	'/user/update/profile',
	[
		passport.authenticate('jwt', { session: false }),
		/*grantAccess('updateOwn', 'profile'),*/
		validation(userSchema.updateProfile, 'body'),
	],
	userController.updateProfile
);
userRouter.patch(
	'/user/update/password',
	[
		passport.authenticate('jwt', { session: false }),
		/*grantAccess('updateOwn', 'profile'),*/
		validation(userSchema.updatePassword, 'body'),
	],
	userController.updatePassword
);
export default userRouter;
