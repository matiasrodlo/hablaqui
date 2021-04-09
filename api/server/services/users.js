import User from '../models/user';
import { logInfo } from '../config/winston';
import bcrypt from 'bcrypt';
import { actionInfo } from '../utils/logger/infoMessages';
import { conflictResponse, okResponse } from '../utils/responses/functions';

const usersService = {
	async getProfile(id) {
		const user = await User.findById(id);
		if (!user) {
			return conflictResponse('perfil no encontrado');
		}
		return okResponse('perfil obtenido', { user });
	},
	async changeActualPassword(user, newPassword) {
		user.password = bcrypt.hashSync(newPassword, 10);
		await user.save();
		logInfo(actionInfo(user.email, 'actualizo su contraseña'));
		return okResponse('password actualizada');
	},
	async updatePassword(user, oldPassword, newPassword) {
		const foundUser = await User.findById(user._id);
		// if the password is te same we cancel the update
		const samePassword = oldPassword === newPassword;
		if (samePassword)
			return conflictResponse('no puede ser la misma contraseña');
		const isEqual = bcrypt.compareSync(oldPassword, foundUser.password);
		//if the password doesn't match, we cancel the update
		if (!isEqual)
			return conflictResponse('la contraseña anterior no es correcta');
		else return await this.changeActualPassword(foundUser, newPassword);
	},
	async updateProfile(user, profile) {
		let updated = null;
		if (profile.idPerson)
			updated = await User.findOneAndUpdate(
				{ idPerson: profile.idPerson },
				profile
			);
		else
			updated = await User.findByIdAndUpdate(user._id, profile, {
				new: true,
				runValidators: true,
				context: 'query',
			});

		logInfo(actionInfo(user.email, 'actualizo su perfil'));
		return okResponse('perfil obtenido', { profile: updated });
	},

	async updatePlan(user, newPlan) {
		let updated = null;
		updated = await User.findByIdAndUpdate(
			user._id,
			{ myPlan: newPlan },
			{
				new: true,
				runValidators: true,
				context: 'query',
			}
		);

		logInfo(actionInfo(user.email, 'actualizo su plan'));
		return okResponse('plan actualizado', { profile: updated });
	},

	async updatePsychologist(user, newPsychologist) {
		let updated = null;
		updated = await User.findByIdAndUpdate(
			user._id,
			{ psychologist: newPsychologist },
			{
				new: true,
				runValidators: true,
				context: 'query',
			}
		);

		logInfo(actionInfo(user.email, 'actualizo su psicologo'));
		return okResponse('psicologo actualizado', { profile: updated });
	},

	async updateAvatar(user, avatar) {
		let updated = null;
		updated = await User.findByIdAndUpdate(
			user._id,
			{ avatar },
			{
				new: true,
				runValidators: true,
				context: 'query',
			}
		);
		logInfo(`${user.email} actualizo su avatar`);
		return okResponse('avatar actualizado', { img: updated.avatar });
	},

	async getSessions(user) {
		let finishedSessions = user.finishedSessions;

		return okResponse('sesiones conseguidas', { finishedSessions });
	},
};

export default usersService;
