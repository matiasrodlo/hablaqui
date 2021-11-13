'use strict';

import User from '../models/user';
import Psychologist from '../models/psychologist';
import { logInfo } from '../config/winston';
import bcrypt from 'bcrypt';
import servicesAuth from './auth';
import { actionInfo } from '../utils/logger/infoMessages';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import pusher from '../config/pusher';
import { pusherCallback } from '../utils/functions/pusherCallback';
import { bucket } from '../config/bucket';
import mailService from './mail';
import Sessions from '../models/sessions';
import moment from 'moment';
import { room } from '../config/dotenv';

const usersService = {
	async getProfile(id) {
		const user = await User.findById(id);
		if (!user) {
			return conflictResponse('perfil no encontrado');
		}
		return okResponse('perfil obtenido', {
			user: await servicesAuth.generateUser(user),
		});
	},
	async changeActualPassword(user, newPassword) {
		user.password = bcrypt.hashSync(newPassword, 10);
		await user.save();
		logInfo(actionInfo(user.email, 'actualizo su contraseña'));
		return okResponse('Actualizó su contraseña');
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
	async passwordRecovery(user, newPassword) {
		const foundUser = await User.findById(user._id);
		const isEqual = bcrypt.compareSync(newPassword, foundUser.password);
		//if the password is the same, we cancel the update with this
		if (isEqual)
			return conflictResponse('no puede ser la misma contraseña');
		else return await this.changeActualPassword(foundUser, newPassword);
	},
	async updateProfile(user, profile) {
		const updated = await User.findByIdAndUpdate(user._id, profile, {
			new: true,
			runValidators: true,
			context: 'query',
		});

		logInfo(actionInfo(user.email, 'actualizo su perfil'));
		return okResponse('Actualizado exitosamente', { user: updated });
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

	async uploadAvatar({
		userLogged,
		avatar,
		avatarThumbnail,
		role,
		idPsychologist,
		_id,
		oldAvatar,
		oldAvatarThumbnail,
	}) {
		let psychologist;
		let userRole = role;
		let userID = _id;

		if (!avatar && !avatarThumbnail)
			return conflictResponse('Ha ocurrido un error inesperado');

		if (userLogged.role === 'superuser') {
			const userSelected = await User.findOne({
				psychologist: idPsychologist,
				role: 'psychologist',
			});

			userRole = userSelected.role;
			userID = userSelected._id;
		}

		if (userRole === 'psychologist')
			psychologist = await Psychologist.findByIdAndUpdate(
				idPsychologist,
				{
					avatar,
					avatarThumbnail,
					approveAvatar: false,
				},
				{ new: true }
			);

		const profile = await User.findByIdAndUpdate(
			userID,
			{
				avatar,
				avatarThumbnail,
			},
			{
				new: true,
			}
		);

		// delete old image
		await this.deleteFile(oldAvatar, oldAvatarThumbnail).catch(
			console.error
		);

		logInfo(`${userLogged.email} actualizo su avatar`);

		return okResponse('Avatar actualizado', {
			user: profile,
			psychologist,
		});
	},

	async deleteFile(oldAvatar, oldAvatarThumbnail) {
		if (oldAvatar)
			await bucket
				.file(oldAvatar.split('https://cdn.hablaqui.cl/').join(''))
				.delete();
		if (oldAvatarThumbnail)
			await bucket
				.file(
					oldAvatarThumbnail
						.split('https://cdn.hablaqui.cl/')
						.join('')
				)
				.delete();
	},

	async setUserOnline(user) {
		const data = {
			...user,
			status: true,
		};
		pusher.trigger('user-status', 'online', data, pusherCallback);
		return okResponse('Usuario conectado', user);
	},

	async setUserOffline(user) {
		const data = {
			...user,
			status: false,
		};
		pusher.trigger('user-status', 'offline', data, pusherCallback);
		return okResponse('Usuario desconectado', user);
	},

	async registerUser(user, body) {
		if (user.role != 'psychologist')
			return conflictResponse('Usuario activo no es psicologo');
		if (await User.exists({ email: body.email }))
			return conflictResponse('Correo electronico en uso');

		const pass =
			Math.random()
				.toString(36)
				.slice(2) +
			Math.random()
				.toString(36)
				.slice(2);

		const newUser = {
			psychologist: user._id,
			name: body.name,
			email: body.email,
			password: bcrypt.hashSync(pass, 10),
			role: 'user',
			rut: body.rut,
			phone: body.phone,
		};
		const createdUser = await User.create(newUser);

		const roomId = require('crypto')
			.createHash('md5')
			.update(`${createdUser._id}${user._id}`)
			.digest('hex');

		const newPlan = {
			title: 'Plan inicial',
			period: 'Plan inicial',
			totalPrice: 0,
			sessionPrice: 0,
			payment: 'success',
			expiration: moment('12/12/2099', 'MM/DD/YYYY HH:mm').toISOString(),
			invitedByPsychologist: true,
			usedCoupon: '',
			totalSessions: 999,
			remainingSessions: 999,
			session: [],
		};

		await Sessions.create({
			...newPlan,
			user: createdUser._id,
			psychologist: user._id,
			roomsUrl: `${room}room/${roomId}`,
		});

		if (process.env.NODE_ENV === 'development')
			logInfo(
				actionInfo(
					user.email,
					`Usuario registrado ${newUser.email} ${pass}`
				)
			);

		// Sending email with user information
		await mailService.sendGuestNewUser(user, newUser, pass);

		return okResponse('Nuevo usuario creado', {
			user: await servicesAuth.generateUser(createdUser),
		});
	},
};

export default usersService;
