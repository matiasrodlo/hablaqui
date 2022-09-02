'use strict';

import User from '../models/user'; // user.js contiene la definición del modelo de usuario para mongodb
import Psychologist from '../models/psychologist'; // psychologist.js contiene la definición del modelo de psicologo para mongodb
import Recruitment from '../models/recruitment'; // recruitment.js contiene la definición del modelo de reclutamiento para mongodb
import { logInfo } from '../config/winston'; // winston.js contiene la configuración de winston para el logging
import bcrypt from 'bcryptjs'; // bcryptjs es una librería para encriptar contraseñas
import servicesAuth from './auth'; // auth.js contiene la lógica para la autenticación de usuarios
import { actionInfo } from '../utils/logger/infoMessages'; // infoMessages.js contiene los mensajes de información para el logging
import { conflictResponse, okResponse } from '../utils/responses/functions'; // functions.js contiene las funciones para las respuestas
import { bucket } from '../config/bucket'; // bucket.js contiene la configuración de la conexión con el bucket de google cloud storage
import mailService from './mail'; // mail.js contiene la lógica para el envío de correos electrónicos
import Sessions from '../models/sessions'; // sessions.js contiene la definición del modelo de sesiones para mongodb
import Coupon from '../models/coupons'; // coupons.js contiene la definición del modelo de cupones para mongodb
import moment from 'moment'; // moment.js es una librería para el manejo de fechas
import { room } from '../config/dotenv'; // dotenv.js contiene la configuración de las variables de entorno
import Evaluation from '../models/evaluation'; // evaluation.js contiene la definición del modelo de evaluaciones para mongodb
import Auth from './auth'; // auth.js contiene la lógica para la autenticación de usuarios

var Analytics = require('analytics-node');
var analytics = new Analytics(process.env.SEGMENT_API_KEY);
moment.tz.setDefault('America/Santiago');

const usersService = { // usersService contiene la lógica para los servicios de usuarios
	async getProfile(id) { // getProfile obtiene el perfil de un usuario
		const user = await User.findById(id); // Se busca el usuario en la base de datos
		if (!user) { // Si no se encuentra el usuario
			return conflictResponse('perfil no encontrado'); // Se retorna un error
		}
		return okResponse('perfil obtenido', { // Se retorna el perfil del usuario
			user: await servicesAuth.generateUser(user), // Se genera el perfil del usuario
		});
	},
	async changeActualPassword(user, newPassword) { // changeActualPassword cambia la contraseña actual de un usuario
		user.password = bcrypt.hashSync(newPassword, 10); // Se encripta la nueva contraseña
		await user.save(); // Se guarda el usuario en la base de datos
		logInfo(actionInfo(user.email, 'actualizo su contraseña')); // Se registra el evento en el log
		return okResponse('Actualizó su contraseña'); // Se retorna un mensaje de éxito
	},
	async updatePassword(user, oldPassword, newPassword) { // updatePassword actualiza la contraseña de un usuario
		const foundUser = await User.findById(user._id); // Se busca el usuario en la base de datos
		// if the password is te same we cancel the update 	// Si la contraseña es la misma se cancela la actualización
		const samePassword = oldPassword === newPassword; // Se verifica si la contraseña es la misma
		if (samePassword) // Si la contraseña es la misma
			return conflictResponse('no puede ser la misma contraseña'); // Se retorna un error
		const isEqual = bcrypt.compareSync(oldPassword, foundUser.password); // Se verifica si la contraseña es correcta
		//if the password doesn't match, we cancel the update
		if (!isEqual) // Si la contraseña no es correcta
			return conflictResponse('la contraseña anterior no es correcta'); // Se retorna un error
		else return await this.changeActualPassword(foundUser, newPassword); // Se actualiza la contraseña
	},
	async passwordRecovery(user, newPassword) { // passwordRecovery recupera la contraseña de un usuario
		const foundUser = await User.findById(user._id); // Se busca el usuario en la base de datos
		const isEqual = bcrypt.compareSync(newPassword, foundUser.password); // Se verifica si la contraseña es correcta
		//if the password is the same, we cancel the update with this
		if (isEqual) // Si la contraseña es la misma
			return conflictResponse('no puede ser la misma contraseña'); // Se retorna un error
		else return await this.changeActualPassword(foundUser, newPassword); // Se actualiza la contraseña
	},
	async updateProfile(id, profile) { // updateProfile actualiza el perfil de un usuario
		const updated = await User.findByIdAndUpdate(id, profile, { // Se actualiza el perfil del usuario
			new: true, 
			runValidators: true, 
			context: 'query',
		});

		return okResponse('Actualizado exitosamente', { // Se retorna un mensaje de éxito
			user: await servicesAuth.generateUser(updated), // Se genera el perfil del usuario
		});
	},

	async updatePlan(user, newPlan) { // updatePlan actualiza el plan de un usuario
		let updated = null; // Se inicializa la variable updated
		updated = await User.findByIdAndUpdate( // Se actualiza el plan del usuario
			user._id, // Se busca el usuario por su id
			{ myPlan: newPlan }, // Se actualiza el plan del usuario
			{
				new: true,
				runValidators: true,
				context: 'query',
			}
		);

		logInfo(actionInfo(user.email, 'actualizo su plan')); // Se registra el evento en el log
		return okResponse('plan actualizado', { profile: updated }); // Se retorna un mensaje de éxito
	},

	async updatePsychologist(user, newPsychologist) { // updatePsychologist actualiza el psicólogo de un usuario
		let updated = null; // Se inicializa la variable updated
		updated = await User.findByIdAndUpdate( // Se actualiza el psicólogo del usuario
			user._id, // Se busca el usuario por su id
			{ psychologist: newPsychologist }, // Se actualiza el psicólogo del usuario
			{ 
				new: true, // que sea new quiere decir que se retorna el objeto actualizado
				runValidators: true, // valida los datos de entrada, en este caso, el id del psicólogo
				context: 'query', // query es el contexto de la actualización, el contexto es el tipo de operación que se realiza
			}
		);

		logInfo(actionInfo(user.email, 'actualizo su psicologo')); // Se registra el evento en el log
		return okResponse('psicologo actualizado', { profile: updated }); // Se retorna un mensaje de éxito
	},

	async uploadAvatar({ // uploadAvatar sube el avatar de un usuario
		userLogged, // usuario que está logueado
		avatar, // avatar del usuario
		avatarThumbnail, // avatar del usuario en miniatura
		role, // rol del usuario
		idPsychologist, // id del psicólogo
		_id, // id del usuario
		oldAvatar, // avatar anterior del usuario
		oldAvatarThumbnail, // avatar anterior del usuario en miniatura
	}) {
		let psychologist; // Se declara la variable psychologist
		let userRole = role; // Se inicializa la variable userRole
		let userID = _id; // Se inicializa la variable userID

		if (!avatar && !avatarThumbnail) // Si no hay avatar ni avatar en miniatura
			return conflictResponse('Ha ocurrido un error inesperado'); // Se retorna un error

		if (userLogged.role === 'superuser') { // Si el usuario logueado es un superusuario
			const psy = await Psychologist.findById(idPsychologist); // Se busca el psicólogo en la base de datos
			const userSelected = await User.findOne({ // Se busca el usuario en la base de datos
				email: psy.email, // Se busca el usuario por su email
				role: 'psychologist', // Se busca el usuario por su rol
			});
			userRole = userSelected.role; // Se asigna el rol del usuario
			userID = userSelected._id; // Se asigna el id del usuario
		}

		if (userRole === 'psychologist') { // Si el rol del usuario es psicólogo
			const userData = await User.findById(userID); // Se busca el usuario en la base de datos
			await mailService.sendUploadPicture(userData); // Se sube la foto del usuario
			if (userData.psychologist) { // Si el usuario tiene un psicólogo
				psychologist = await Psychologist.findByIdAndUpdate( // Se encuentra por ID y se actualiza el avatar del psicólogo
					idPsychologist, // Se busca el psicólogo por su id
					{
						avatar, // Se actualiza el avatar del psicólogo
						avatarThumbnail, // Se actualiza el avatar del psicólogo en miniatura
						approveAvatar: false, // Se actualiza el estado de aprobación del avatar del psicólogo
					},
					{ new: true } // que sea new quiere decir que se retorna el objeto actualizado
				);
			} else { // Si el usuario no tiene un psicólogo
				psychologist = await Recruitment.findByIdAndUpdate( // Se encuentra por ID y se actualiza el avatar del psicólogo
					userID,
					{
						avatar,
						avatarThumbnail,
						approveAvatar: false,
					},
					{ new: true }
				);
			}
		}

		const profile = await User.findByIdAndUpdate( // Se encuentra por ID y se actualiza el avatar del usuario
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
		await this.deleteFile(oldAvatar, oldAvatarThumbnail).catch( // Se elimina el avatar anterior del usuario
			console.error
		);

		logInfo(`${userLogged.email} actualizo su avatar`); // Se registra el evento en el log

		return okResponse('Avatar actualizado', { // Se retorna un mensaje de éxito
			user: profile,
			psychologist,
		});
	},

	async deleteFile(oldAvatar, oldAvatarThumbnail) { // deleteFile elimina el avatar anterior del usuario
		if (oldAvatar) // Si hay un avatar anterior
			await bucket // Se elimina el avatar anterior del usuario
				.file(oldAvatar.split('https://cdn.hablaqui.cl/').join('')) // Se elimina el avatar anterior del usuario
				.delete(); // Se elimina el avatar anterior del usuario
		if (oldAvatarThumbnail) // Si hay un avatar anterior en miniatura
			await bucket // Se elimina el avatar anterior del usuario en miniatura
				.file( // Se elimina el avatar anterior del usuario en miniatura
					oldAvatarThumbnail // Se elimina el avatar anterior del usuario en miniatura
						.split('https://cdn.hablaqui.cl/') // Se elimina el avatar anterior del usuario en miniatura
						.join('') // Se elimina el avatar anterior del usuario en miniatura
				)
				.delete(); // Se elimina el avatar anterior del usuario en miniatura
	},

	async setUserOnline(user) { // setUserOnline establece el estado de un usuario como en línea
		// const data = {
		// 	...user,
		// 	status: true,
		// };
		// pusher.trigger('user-status', 'online', data, pusherCallback);
		return okResponse('Usuario conectado', user); // Se retorna un mensaje de éxito
	},

	async setUserOffline(user) { // setUserOffline establece el estado de un usuario como desconectado
		// const data = {
		// 	...user,
		// 	status: false,
		// };
		// pusher.trigger('user-status', 'offline', data, pusherCallback);
		return okResponse('Usuario desconectado', user); // Se retorna un mensaje de éxito
	},

	async registerUser(user, body) {
		if (user.role !== 'psychologist')
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
			//psychologist: user._id,
			isInvited: true,
			name: body.name,
			lastName: body.lastName,
			email: body.email,
			password: bcrypt.hashSync(pass, 10),
			role: 'user',
			rut: body.rut,
			phone: body.phone,
			invitedBy: user.psychologist,
		};
		const createdUser = await User.create(newUser);
		const token = Auth.generateJwt(createdUser);
		const verifyurl = `${process.env.VUE_APP_LANDING}/verificacion-email?id=${createdUser._id}&token=${token}`;
		await mailService.sendVerifyEmail(createdUser, verifyurl);

		if (
			process.env.API_URL.includes('hablaqui.cl') ||
			process.env.DEBUG_ANALYTICS === 'true'
		) {
			analytics.identify({
				userId: createdUser._id.toString(),
				traits: {
					name: user.name,
					email: user.email,
					type: user.role,
					referencerId: user._id,
					referencerName: `${user.name} ${user.lastName}`,
				},
			});
			analytics.track({
				userId: createdUser._id.toString(),
				event: 'referral-user-signup',
				properties: {
					name: user.name,
					email: user.email,
					type: user.role,
					referencerId: user.psychologist.toString(),
					referencerName: `${user.name} ${user.lastName}`,
				},
			});
		}
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
			expiration: moment('12/12/2000', 'MM/DD/YYYY HH:mm').toISOString(),
			invitedByPsychologist: true,
			usedCoupon: '',
			totalSessions: 0,
			remainingSessions: 0,
			session: [],
		};

		if (user.role === 'psychologist' && createdUser.role === 'user')
			await Sessions.create({
				plan: [newPlan],
				user: createdUser._id,
				psychologist: user.psychologist,
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
	async changePsychologist(sessionsId) {
		const foundPlan = await Sessions.findById(sessionsId).populate(
			'psychologist user'
		);
		if (!foundPlan) return conflictResponse('No hay planes');
		const planData = foundPlan.plan.filter(
			plan =>
				plan.payment === 'success' &&
				moment().isBefore(moment(plan.expiration))
		);

		if (!planData) return conflictResponse('No hay planes para cancelar');

		let sessionsData = [];
		planData.forEach(plan => {
			const sessions = {
				plan: plan._id,
				remainingSessions: plan.remainingSessions,
				price: plan.sessionPrice,
				session: plan.session.filter(
					session => session.status !== 'success'
				),
			};
			sessionsData.push(sessions);
		});

		let discount = 0;
		let sessionsToDelete = [];
		sessionsData.forEach(data => {
			const remaining = data.session.length + data.remainingSessions;
			discount += remaining * data.price;
			sessionsToDelete.push(data.session);
		});
		console.log(discount);
		console.log(sessionsToDelete);

		planData.forEach(async plan => {
			await Sessions.updateOne(
				{
					_id: sessionsId,
					'plan._id': plan._id,
				},
				{
					$set: {
						'plan.$.payment': 'failed',
						'plan.$.remainingSessions': 0,
					},
				}
			);
			plan.session.forEach(async session => {
				await Sessions.updateOne(
					{
						_id: sessionsId,
						'plan._id': plan._id,
						'plan.session._id': session._id,
					},
					{
						$pull: {
							'plan.$.session': { _id: session._id },
						},
					}
				);
			});
		});

		const now = new Date();
		let expiration = now;
		expiration.setDate(expiration.getDate() + 3);

		const newCoupon = {
			code: foundPlan.user.name + now.getTime(),
			discount,
			discountType: 'static',
			restrictions: {
				user: foundPlan.user._id,
			},
			expiration: expiration.toISOString(),
		};
		await mailService.sendChangePsycologistToUser(
			foundPlan.user,
			foundPlan.psychologist,
			newCoupon
		);
		await Coupon.create(newCoupon);
		return okResponse('Cupón hecho');
	},
};

export default usersService;
