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
	[
		passport.authenticate('jwt', { session: false }),
		grantAccess('readOwn', 'profile'),
	],
	userController.getProfile
);

userRouter.get(
	'/users',
	[
		passport.authenticate('jwt', { session: false }),
		grantAccess('readAny', 'profile'),
	],
	userController.getUsers
);

userRouter.get(
	'/user/profile/:id',
	[
		passport.authenticate('jwt', { session: false }),
		grantAccess('readOwn', 'profile'),
	],
	userController.getUser
);

userRouter.put(
	'/user/profile',
	[
		passport.authenticate('jwt', { session: false }),
		grantAccess('updateOwn', 'profile'),
		validation(userSchema.updateProfile, 'body'),
	],
	userController.updateProfile
);

userRouter.post(
	'/user/:idPerson/notification-push',
	[
		passport.authenticate('jwt', { session: false }),
		grantAccess('readOwn', 'profile'),
	],
	userController.sendNotificationPush
);

userRouter.patch(
	'/user/avatar',
	[
		passport.authenticate('jwt', { session: false }),
		grantAccess('updateOwn', 'profile'),
		upload.single('avatar'),
		storage,
	],
	userController.updateAvatar
);

userRouter.patch(
	'/user/password',
	[
		passport.authenticate('jwt', { session: false }),
		grantAccess('updateOwn', 'profile'),
		validation(userSchema.updatePassword, 'body'),
	],
	userController.updatePassword
);

userRouter.patch(
	'/user/actions/share/place-and-person',
	[
		passport.authenticate('jwt', { session: false }),
		grantAccess('updateOwn', 'profile'),
		validation(userSchema.share, 'body'),
	],
	userController.sharePlaceAndPersons
);

userRouter.delete(
	'/user/actions/share/remove',
	[
		passport.authenticate('jwt', { session: false }),
		grantAccess('deleteAny', 'profile'),
		validation(userSchema.share, 'body'),
	],
	userController.deleteSharingWithUser
);

userRouter.delete(
	'/user/actions/share/remove-with-me',
	[
		passport.authenticate('jwt', { session: false }),
		grantAccess('deleteAny', 'profile'),
		validation(userSchema.share, 'body'),
	],
	userController.deleteSharingWithMeUser
);
export default userRouter;
