'use strict'; // Sirve para que el código sea mas estricto y evitar errores

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
			new: true, // Se retorna el nuevo perfil
			runValidators: true, // es true para que se ejecuten las validaciones
			context: 'query', // query es el contexto de mongoose
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
	async updatePsychologist(user, newPsychologist, oldPsychologist) {
		// Se realiza una busqueda del plan del consultante
		const oldSession = await Sessions.findOne({
			psychologist: oldPsychologist,
			user: user,
		});
	
		// Se crea un nuevo plan para el consultante con el nuevo psicólogo
		const newPlan = {
			title: oldSession.plan[oldSession.plan.length - 1].title, 
			period: oldSession.plan[oldSession.plan.length - 1].period, 
			totalPrice: oldSession.plan[oldSession.plan.length - 1].totalPrice,
			sessionPrice: oldSession.plan[oldSession.plan.length - 1].sessionPrice,
			payment: oldSession.plan[oldSession.plan.length - 1].payment,
			datePayment: oldSession.plan[oldSession.plan.length - 1].datePayment,
			expiration: oldSession.plan[oldSession.plan.length - 1].expiration,
			usedCoupon: oldSession.plan[oldSession.plan.length - 1].usedCoupon,
			totalSessions: oldSession.plan[oldSession.plan.length - 1].totalSessions,
			remainingSessions: oldSession.plan[oldSession.plan.length - 1].remainingSessions,
			tokenToPay: oldSession.plan[oldSession.plan.length - 1].tokenToPay,
			session: oldSession.plan[oldSession.plan.length - 1].session,
		};
		
		// Se cambia el plan de expiración del plan antiguo
		oldSession.plan[oldSession.plan.length - 1].expiration = moment()
																.subtract(1, 'days')
																.format();

		// Se busca si el usuario tiene una sesión con el nuevo psicólogo, si no la tiene se crea una
		let newSession = await Sessions.findOne({
			psychologist: newPsychologist,
			user: user,
		});
		if (newSession === null) {
			newSession = await Sessions.create({
				psychologist: newPsychologist,
				user: user,
				plan: [newPlan],
				roomsUrl: oldSession.roomsUrl,
			});
		} else {
			newSession.plan.push(newPlan);
		}

		await newSession.save();
		await oldSession.save();
		return okResponse('plan actualizado', { profile: user });
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
						avatar, // Se actualiza el avatar del psicólogo
						avatarThumbnail, // Se actualiza el avatar del psicólogo en miniatura
						approveAvatar: false, // Se actualiza el estado de aprobación del avatar del psicólogo
					},
					{ new: true } // que sea new quiere decir que se retorna el objeto actualizado
				);
			}
		}

		const profile = await User.findByIdAndUpdate( // Se encuentra por ID y se actualiza el avatar del usuario
			userID, // Se busca el usuario por su id
			{
				avatar, // Se actualiza el avatar del usuario
				avatarThumbnail, // Se actualiza el avatar del usuario en miniatura
			},
			{
				new: true, // que sea new quiere decir que se retorna el objeto actualizado
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
	// Sugerencia: Siento también que este metodo podría dividirse en otras funciones mas pequeñas
	async registerUser(user, body) { // registerUser registra un usuario
		if (user.role !== 'psychologist') // Si el usuario no es psicólogo
			return conflictResponse('Usuario activo no es psicologo'); // Se retorna un mensaje de error
		if (await User.exists({ email: body.email })) // Si el email ya está registrado
			return conflictResponse('Correo electronico en uso'); // Se retorna un mensaje de error

		const pass = // Se crea una contraseña aleatoria
			Math.random()
				.toString(36)
				.slice(2) +
			Math.random()
				.toString(36)
				.slice(2);
		const newUser = { // Se crea un nuevo usuario
			//psychologist: user._id,
			isInvited: true, // Se establece que el usuario es invitado
			name: body.name, // Se establece el nombre del usuario
			lastName: body.lastName, // Se establece el apellido del usuario
			email: body.email, // Se establece el email del usuario
			password: bcrypt.hashSync(pass, 10), // Se establece la contraseña del usuario y se encripta
			role: 'user', // Se establece el rol del usuario
			rut: body.rut, // Se establece el rut del usuario
			phone: body.phone, // Se establece el teléfono del usuario
			invitedBy: user.psychologist, // Se establece el psicólogo que invitó al usuario
		};
		const createdUser = await User.create(newUser); // Se crea el usuario
		const token = Auth.generateJwt(createdUser); // Se genera el token
		const verifyurl = `${process.env.VUE_APP_LANDING}/verificacion-email?id=${createdUser._id}&token=${token}`; // Se establece la url de verificación del email
		await mailService.sendVerifyEmail(createdUser, verifyurl); // Se envia el email de verificación

		if (
			process.env.API_URL.includes('hablaqui.cl') || // Si la url de la api es de hablaqui.cl
			process.env.DEBUG_ANALYTICS === 'true' // Si el modo debug está activado
		) {
			analytics.identify({ // Se identifica al usuario
				userId: createdUser._id.toString(), // Se establece el id del usuario
				traits: { // Se establecen las características del usuario
					name: user.name, // Se establece el nombre del usuario
					email: user.email, // Se establece el email del usuario
					type: user.role, // Se establece el rol del usuario
					referencerId: user._id, // Se establece el id del usuario
					referencerName: `${user.name} ${user.lastName}`, // Se establece el nombre del usuario
				},
			});
			analytics.track({ // Se registra la acción
				userId: createdUser._id.toString(), // Se establece el id del usuario
				event: 'referral-user-signup', // Se establece la acción
				properties: { // Se establecen las propiedades
					name: user.name, // Se establece el nombre del usuario
					email: user.email, // Se establece el email del usuario
					type: user.role, // Se establece el rol del usuario
					referencerId: user.psychologist.toString(), // Se establece el id del psicólogo
					referencerName: `${user.name} ${user.lastName}`, // Se establece el nombre del psicólogo
				},
			});
		}
		const roomId = require('crypto') // Se crea una sala aleatoria
			.createHash('md5') // Se establece el algoritmo de encriptación, en este caso MD5
			.update(`${createdUser._id}${user._id}`) // .update se utiliza para encriptar
			.digest('hex'); // Se obtiene el hash, digest se utiliza para obtener el hash en hexadecimal

		const newPlan = { // Se crea un nuevo plan
			title: 'Plan inicial', // Se establece el título del plan
			period: 'Plan inicial', // Se establece el periodo del plan
			totalPrice: 0, // Se establece el precio total del plan
			sessionPrice: 0, // Se establece el precio de la sesión
			payment: 'success', // Se establece el estado del pago
			expiration: moment('12/12/2000', 'MM/DD/YYYY HH:mm').toISOString(), // Se establece la fecha de expiración del plan
			invitedByPsychologist: true, // Se establece que el plan fue invitado por el psicólogo
			usedCoupon: '', // Se establece el cupón utilizado
			totalSessions: 0, // Se establece el total de sesiones
			remainingSessions: 0, // Se establece el total de sesiones restantes
			session: [], // Se establecen las sesiones
		};

		if (user.role === 'psychologist' && createdUser.role === 'user') // Si el usuario es un psicólogo y el usuario creado es un usuario
			await Sessions.create({ // Se crea una sesión
				plan: [newPlan], // Se establecen los planes
				user: createdUser._id, // Se establece el usuario
				psychologist: user.psychologist, // Se establece el psicólogo
				roomsUrl: `${room}room/${roomId}`, // Se establece la url de la sala
			});

		if (process.env.NODE_ENV === 'development') // Si el entorno es de desarrollo
			logInfo( // Se registra la acción
				actionInfo( // Se establece la información de la acción
					user.email, // Se establece el email del usuario
					`Usuario registrado ${newUser.email} ${pass}` // Se establece el mensaje
				)
			);

		// Sending email with user information
		await mailService.sendGuestNewUser(user, newUser, pass); // Se envia el email con la información del usuario

		return okResponse('Nuevo usuario creado', { // Se retorna una respuesta de éxito
			user: await servicesAuth.generateUser(createdUser),
		});
	},
	// Sugerencia: Se podría reducir un poco más el código de la función
	async changePsychologist(sessionsId) { // Función para cambiar el psicólogo de una sesión
		const foundPlan = await Sessions.findById(sessionsId).populate( // Se busca por id la sesión
			'psychologist user' // Se establecen los campos a buscar
		);
		if (!foundPlan) return conflictResponse('No hay planes'); // Si no hay planes se retorna un error de conflicto
		const planData = foundPlan.plan.filter( // Se filtran los planes
			plan => // Se establecen las condiciones
				plan.payment === 'success' && // Se establece que el pago sea exitoso
				moment().isBefore(moment(plan.expiration)) // Se establece que la fecha de expiración sea anterior a la actual, es decir, que el plan no haya expirado, esto se hace para evitar que se cambie el psicólogo de una sesión que ya haya expirado
		); // moment se utiliza para obtener la fecha actual

		if (!planData) return conflictResponse('No hay planes para cancelar'); // Si no hay planes para cancelar se retorna un error de conflicto

		let sessionsData = []; // Se establece un arreglo de sesiones
		planData.forEach(plan => { // Se recorren los planes
			const sessions = { // Se establecen las sesiones
				plan: plan._id, // Se establece el plan
				remainingSessions: plan.remainingSessions, // Se establece el total de sesiones restantes
				price: plan.sessionPrice, // Se establece el precio de la sesión
				session: plan.session.filter( // Se filtran las sesiones
					session => session.status !== 'success' // Se establece que el estado de la sesión no sea exitosa
				),
			};
			sessionsData.push(sessions); // Se agrega la sesión al arreglo
		});
		// Sugerencia: Declarar variables al inicio porfavor.
		let discount = 0; // Se establece el descuento
		let sessionsToDelete = []; // Se establece un arreglo de sesiones a eliminar
		sessionsData.forEach(data => { // Se recorren las sesiones
			const remaining = data.session.length + data.remainingSessions; // Se establece el total de sesiones restantes
			discount += remaining * data.price; // Se establece el descuento
			sessionsToDelete.push(data.session); // Se agrega la sesión al arreglo
		});
		console.log(discount); // Se imprime el descuento
		console.log(sessionsToDelete); // Se imprime las sesiones a eliminar

		planData.forEach(async plan => { // Se recorren los planes
			await Sessions.updateOne( // Se actualiza la sesión
				{
					_id: sessionsId, // Se establece el id de la sesión
					'plan._id': plan._id, // Se establece el id del plan
				},
				{
					$set: { // set se utiliza para actualizar un documento en la base de datos
						'plan.$.payment': 'failed', // Se establece el pago como fallido
						'plan.$.remainingSessions': 0, // Se establece el total de sesiones restantes
					},
				}
			);
			plan.session.forEach(async session => { // Se recorren las sesiones
				await Sessions.updateOne( // Se actualiza la sesión
					{
						_id: sessionsId, // Se establece el id de la sesión
						'plan._id': plan._id, // Se establece el id del plan
						'plan.session._id': session._id, // Se establece el id de la sesión
					},
					{
						$pull: { // pull se utiliza para eliminar un documento en la base de datos
							'plan.$.session': { _id: session._id }, // Se establece el id de la sesión
						},
					}
				);
			});
		});

		const now = new Date(); // Se establece la fecha actual
		let expiration = now; // Se establece la fecha de expiración
		expiration.setDate(expiration.getDate() + 3); // Se establece la fecha de expiración a 3 días después de la fecha actual

		const newCoupon = { // Se establece el nuevo cupón
			code: foundPlan.user.name + now.getTime(), // Se establece el código del cupón
			discount, // Se establece el descuento
			discountType: 'static', // Se establece el tipo de descuento
			restrictions: { // Se establecen las restricciones del cupón
				user: foundPlan.user._id, 
			},
			expiration: expiration.toISOString(), // Se establece la fecha de expiración
		};
		await mailService.sendChangePsycologistToUser( // Se envía el correo al usuario
			foundPlan.user, // Se envía el plan al usuario
			foundPlan.psychologist, // Se envía el psicólogo al usuario
			newCoupon // Se envía el cupón al usuario
		);
		await Coupon.create(newCoupon); // Se crea el cupón
		return okResponse('Cupón hecho'); // Se retorna un mensaje de éxito
	},
};

export default usersService;
