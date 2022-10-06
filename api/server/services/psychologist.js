'use strict';

import { logInfo } from '../config/pino'; // Se importa el log de info para poder imprimir en la consola
import { getAllSessionsFunction } from '../utils/functions/getAllSessionsFunction'; // Funcion para obtener todas las sesiones de un psicologo
import Psychologist from '../models/psychologist'; // psychologist.js contiene la definición del modelo de psicologos para mongodb
import Recruitment from '../models/recruitment'; // recruitment.js contiene la definición del modelo de recruitment para mongodb
import User from '../models/user'; // user.js contiene la definición del modelo de usuarios para mongodb
import { conflictResponse, okResponse } from '../utils/responses/functions'; // Funciones para peticiones 200 y 400
import moment from 'moment'; // // moment.js es una librería para el manejo de fechas
import Sessions from '../models/sessions'; // sessions.js contiene la definición del modelo de sesiones para mongodb
import {
	bucket,
	getPublicUrlAvatar,
	getPublicUrlAvatarThumb,
} from '../config/bucket'; // Funciones que devuelven URL's
var Analytics = require('analytics-node');
var analytics = new Analytics(process.env.SEGMENT_API_KEY);
moment.tz.setDefault('America/Santiago'); // Se configura la zona horaria de la aplicación

const getAll = async () => {
	// Funcion para obtener todos los psicologos
	let psychologists = await Psychologist.find(); // Se obtienen todos los psicologos
	logInfo('obtuvo todos los psicologos'); // Se imprime en consola
	return okResponse('psicologos obtenidos', { psychologists }); // Se retorna una respuesta con los psicologos
};

const match = async body => {
	// Funcion para hacer match con un psicologo, recibe las respuestas y comienza el proceso (matchmaking)
	const { payload } = body; // Se obtienen los datos del payload, un payload es un objeto con las respuestas del cliente.
	let matchedPsychologists = []; // Los psicologos que coinciden con el cliente
	if (payload.gender == 'transgender') {
		// Machea por género (transgenero)
		matchedPsychologists = await Psychologist.find({
			models: payload.model, // Modelo terapeutico, la forma en que el cliente quiere afrontar las sesiones. (metas, formas de intervencion, etc)
			isTrans: true,
			specialties: { $in: payload.themes }, // Filtra por especialidades
		});
	} else {
		// Si no es transgenero
		matchedPsychologists = await Psychologist.find({
			gender: payload.gender || {
				// Se buscan los psicologos por género, prioriza payload.gender el genero entregado por el cliente.
				$in: ['male', 'female', 'transgender'],
			},
			models: payload.model,
			specialties: { $in: payload.themes },
		});
	}
	if (matchedPsychologists.length == 0) {
		// Si no se encuentra psicologos
		let newMatchedPsychologists = [];
		if (payload.gender == 'transgender') {
			newMatchedPsychologists = await Psychologist.find({
				isTrans: true,
				specialties: { $in: payload.themes },
			});
		} else {
			newMatchedPsychologists = await Psychologist.find({
				gender: payload.gender || {
					$in: ['male', 'female', 'transgender'],
				},
				specialties: { $in: payload.themes },
			});
		}

		return okResponse('Psicologos encontrados', {
			matchedPsychologists: newMatchedPsychologists,
			perfectMatch: false,
		});
	} else {
		return okResponse('psicologos encontrados', {
			matchedPsychologists,
			perfectMatch: true,
		});
	}
};

const rescheduleSession = async (sessionsId, planId, sessionId, newDate) => {
	// Se da formato a la fecha
	newDate = moment(newDate).format('MM/DD/YYYY HH:mm');
	// Se busca la sesion que se va a reprogramar y se actualiza la fecha
	const sessions = await Sessions.findOneAndUpdate(
		{
			_id: sessionsId,
			'plan._id': planId,
			'plan.session._id': sessionId,
		},
		{
			$set: {
				'plan.$[].session.$[session].date': newDate,
			},
		},
		{ arrayFilters: [{ 'session._id': sessionId }], new: true }
	).populate('psychologist user');
	// Se verifica que la sesion exista
	if (!sessions) {
		return conflictResponse('Sesion no encontrada');
	}
	// Se verifica si el plan sigue vigente
	sessions.plan.forEach(plan => {
		for (let i = 0; i < plan.session.length; i++) {
			if (
				plan.session[i]._id.toString() === sessionId.toString() &&
				moment(plan.session[i].date, 'MM/DD/YYYY HH:mm').isAfter(
					plan.expiration,
					'MM/DD/YYYY HH:mm'
				) &&
				plan._id.toString() === planId.toString()
			) {
				// Se actualiza la fecha de vencimiento a 50 minutos despues de la ultima sesion
				plan.expiration = moment(newDate, 'MM/DD/YYYY HH:mm')
					.add(50, 'minutes')
					.format();
			}
		}
	});
	await sessions.save();
	return okResponse('Hora actualizada', { sessions });
};

const updatePlan = async (psychologistId, planInfo) => {
	// Funcion para actualizar el plan de un psicologo
	const updatedPsychologist = await Psychologist.findByIdAndUpdate(
		// Se busca el psicologo por su id y se actualiza
		psychologistId, // Se busca el psicologo por su id
		{
			$push: {
				// Se inserta el nuevo plan en la base de datos, se usa el operador $push.
				psyPlans: { paymentStatus: 'success', ...planInfo },
			},
		},
		{ new: true }
	);
	return okResponse('Plan creado', { psychologist: updatedPsychologist }); // Se retorna el psicologo actualizado
};

const getByData = async username => {
	// Funcion para obtener un psicologo por su username
	const usernameSearch = await Psychologist.findOne({ username }); // Se busca el psicologo por su username
	if (!usernameSearch) {
		// Si no se encuentra el psicologo
		const idSearch = await Psychologist.findOne({ _id: username }); // Se busca el psicologo por su id
		return okResponse('Psicólogo encontrado', {
			// Se retorna una respuesta con el psicologo
			psychologist: idSearch, // Se retorna el psicologo por su id
		});
	}
	return okResponse('Psicólogo encontrado', { psychologist: usernameSearch }); // Se retorna una respuesta con el psicologo
};

const setSchedule = async (user, payload) => {
	// Funcion para actualizar el horario de un psicologo
	let response;
	// Si el user es un psicologo
	if (user.psychologist) {
		response = await Psychologist.findByIdAndUpdate(
			// Se busca el psicologo por su id y se actualiza
			user.psychologist,
			{
				$set: {
					// Se actualiza el horario
					schedule: {
						monday: payload.monday, // Se actualiza el horario de lunes
						tuesday: payload.tuesday, // Se actualiza el horario de martes
						wednesday: payload.wednesday, // Se actualiza el horario de miercoles
						thursday: payload.thursday, // Se actualiza el horario de jueves
						friday: payload.friday, // Se actualiza el horario de viernes
						saturday: payload.saturday, // Se actualiza el horario de sabado
						sunday: payload.sunday, // Se actualiza el horario de domingo
					},
				},
			},
			{ new: true }
		);
	}
	// Si el user es un postulante (psychologist === undefined), pero no un user
	else {
		response = await Recruitment.findOneAndUpdate(
			// Se busca el postulante por su id y se actualiza
			{ email: user.email }, // Se busca el postulante por su email
			{
				$set: {
					// Se actualiza el horario
					schedule: {
						monday: payload.monday,
						tuesday: payload.tuesday,
						wednesday: payload.wednesday,
						thursday: payload.thursday,
						friday: payload.friday,
						saturday: payload.saturday,
						sunday: payload.sunday,
					},
				},
			},
			{ new: true }
		);
	}
	return okResponse('Horario actualizado', {
		// Se retorna una respuesta con el horario actualizado
		psychologist: response,
	});
};

const updatePaymentMethod = async (user, payload) => {
	// Funcion para actualizar el metodo de pago de un psicologo
	if (user.role !== 'psychologist')
		// Si el user no es un psicologo
		return conflictResponse('No eres un psicologo.');
	// Se retorna una respuesta de conflicto
	else {
		// Si el user es un psicologo
		let foundPsychologist; // Se crea una variable para almacenar el psicologo
		if (user.psychologist) {
			// Si el user es un psicologo
			foundPsychologist = await Psychologist.findById(user.psychologist); // Se busca el psicologo por su id
		} else {
			// Si el user es un postulante
			foundPsychologist = await Recruitment.findOne({
				// Se busca el postulante por su email
				email: user.email,
			});
		}
		const newPaymentMethod = {
			// Se crea un nuevo metodo de pago
			bank: payload.bank || foundPsychologist.paymentMethod.bank, // Se actualiza el banco
			// Se actualiza el tipo de cuenta
			accountType:
				payload.accountType ||
				foundPsychologist.paymentMethod.accountType,
			// Se actualiza el numero de cuenta
			accountNumber:
				payload.accountNumber ||
				foundPsychologist.paymentMethod.accountNumber,
			rut: payload.rut || foundPsychologist.paymentMethod.rut, // Se actualiza el rut
			name: payload.name || foundPsychologist.paymentMethod.name, // Se actualiza el nombre
			email: payload.email || foundPsychologist.paymentMethod.email, // Se actualiza el email
		};
		foundPsychologist.paymentMethod = newPaymentMethod; // Se actualiza el metodo de pago
		await foundPsychologist.save(); // Se guarda el psicologo
		return okResponse('Metodo de pago actualizado', {
			// Se retorna una respuesta con el metodo de pago actualizado
			psychologist: foundPsychologist, // Se retorna el psicologo actualizado
		});
	}
};

const updatePsychologist = async (user, profile) => {
	// Funcion para actualizar el perfil de un psicologo
	if (user.role == 'user') return conflictResponse('No tienes poder.'); // Si el user no es un psicologo
	if (user.psychologist) {
		// Si el user es un psicologo
		try {
			// Se intenta actualizar el psicologo
			const psy = await Psychologist.findById(profile._id); // Se busca el psicologo por su id
			if (psy.sessionPrices.video !== profile.sessionPrices.video) {
				// Si el precio de la sesion es diferente
				if (
					psy.stampSetPrices && // Si el psicologo tiene un set de precios
					moment().isBefore(
						// Y el precio establecido aun no ha expirado
						moment(psy.stampSetPrices).add(1, 'months')
					)
				)
					profile.sessionPrices = psy.sessionPrices;
				// Se actualiza el precio de la sesion de video
				else profile.stampSetPrices = moment().format(); // Se actualiza la fecha de inicio del set de precios
			}

			const updated = await Psychologist.findByIdAndUpdate(
				// Se busca el psicologo por su id y se actualiza
				profile._id, // Se busca el psicologo por su id
				profile, // Se actualiza el perfil
				{
					new: true, // Se retorna el psicologo actualizado
					runValidators: true, // Se ejecutan las validaciones
					context: 'query', // Se ejecutan las validaciones
				}
			);
			if (
				process.env.API_URL.includes('hablaqui.cl') ||
				process.env.DEBUG_ANALYTICS === 'true'
			) {
				const getUser = await User.findOne({ email: user.email });
				const id = getUser._id;
				analytics.track({
					userId: id.toString(),
					event: 'psy-updated-profile',
				});
				analytics.identify({
					userId: id.toString(),
					traits: {
						email: updated.email,
						name: updated.name,
						lastName: updated.lastName,
						username: updated.username,
						code: updated.code,
						avatar: updated.avatar,
						country: updated.country,
						marketplaceVisibility:
							updated.preferences.marketplaceVisibility,
						birthDate: updated.birthDate,
						comuna: updated.comuna,
						region: updated.region,
						isVerified: updated.isVerified,
						approveAvatar: updated.approveAvatar,
						freeFirstSession: updated.freeFirstSession,
						hasPersonalDescription:
							updated.personalDescription == '' ? false : true,
						hasProfessionalDescription:
							updated.professionalDescription == ''
								? false
								: true,
						personalDescription: updated.personalDescription,
						professionalDescription:
							updated.professionalDescription,
						role: 'psychologist',
					},
				});
			}

			logInfo(user.email, 'actualizo su perfil de psicologo'); // Se registra la accion en el log
			return okResponse('Actualizado exitosamente', {
				// Se retorna una respuesta con el psicologo actualizado
				psychologist: updated, // Se retorna el psicologo actualizado
			});
		} catch (err) {
			// Si ocurre un error
			logInfo(err.stack); // Se registra el error en el log
			return conflictResponse(
				'Ocurrió un error al actualizar el perfil. Verifica los campos.' // Se retorna una respuesta de error
			);
		}
	} else {
		// Si el user no es un psicologo
		try {
			// Se intenta actualizar el psicologo
			const updated = await Recruitment.findByIdAndUpdate(
				// Se busca el psicologo por su id y se actualiza
				profile._id, // Se busca el psicologo por su id
				profile, // Se actualiza el perfil
				{
					new: true,
				}
			);
			if (
				process.env.API_URL.includes('hablaqui.cl') ||
				process.env.DEBUG_ANALYTICS === 'true'
			) {
				analytics.track({
					userId: user.id.toString(),
					event: 'recruited-updated-profile',
				});
				analytics.identify({
					userId: user.id.toString(),
					traits: {
						email: updated.email,
						name: updated.name,
						lastName: updated.lastName,
						username: updated.username,
						code: updated.code,
						avatar: updated.avatar,
						country: updated.country,
						marketplaceVisibility:
							updated.preferences.marketplaceVisibility,
						birthDate: updated.birthDate,
						comuna: updated.comuna,
						region: updated.region,
						isVerified: updated.isVerified,
						approveAvatar: updated.approveAvatar,
						freeFirstSession: updated.freeFirstSession,
						hasPersonalDescription:
							updated.personalDescription == '' ? false : true,
						hasProfessionalDescription:
							updated.professionalDescription == ''
								? false
								: true,
						personalDescription: updated.personalDescription,
						professionalDescription:
							updated.professionalDescription,
						role: 'recruited',
					},
				});
			}
			return okResponse('Actualizado exitosamente', {
				// Se retorna una respuesta con el psicologo actualizado
				psychologist: updated, // Se retorna el psicologo actualizado
			});
		} catch (err) {
			// Si ocurre un error
			logInfo(err.stack); // Se registra el error en el log
			return conflictResponse(
				// Se retorna una respuesta de error
				'Ocurrió un error al actualizar el perfil. Verifica los campos.'
			);
		}
	}
};

const deleteOne = async (user, id) => {
	// Funcion para eliminar un psicologo
	if (user.role !== 'superuser')
		// Si el user no es superuser
		return conflictResponse(
			// Se retorna una respuesta de error
			'No tienes permisos suficientes para realizar esta acción'
		);

	await Psychologist.deleteOne({ _id: id }); // Se elimina el psicologo
	const psychologists = await Psychologist.find(); // Se buscan todos los psicologos
	return okResponse('Psicologo eliminado', { psychologists }); // Se retorna una respuesta con todos los psicologos
};

const setPrice = async (user, newPrice) => {
	// Funcion para cambiar el precio de un psicologo
	newPrice = Number(newPrice); // Se convierte el precio a numero
	if (user.role != 'psychologist')
		// Si el user no es un psicologo
		return conflictResponse('No tienes permisos'); // Se retorna una respuesta de error
	const psy = await Psychologist.findById(user.psychologist); // Se busca el psicologo por su id

	if (
		psy.stampSetPrices && // Si el psicologo ya tiene un precio establecido
		moment().isBefore(moment(psy.stampSetPrices).add(1, 'months')) // Y el precio establecido aun no ha expirado
	)
		return conflictResponse(
			// Se retorna una respuesta de error
			'Tiene que esperar 1 mes para volver a cambiar el precio'
		);
	let updatedPsychologist = await Psychologist.findByIdAndUpdate(
		// Se busca el psicologo por su id y se actualiza
		user.psychologist, // Se busca el psicologo por su id
		{
			sessionPrices: {
				// Se actualiza el precio de la sesion
				text: newPrice * 0.75, // Se calcula el precio de texto
				video: newPrice, // Se calcula el precio de video
				full: newPrice * 1.25, // Se calcula el precio de sesion completa
			},
			stampSetPrices: moment(), // Se actualiza la fecha de cuando se establecio el precio
		},
		{ new: true }
	);
	return okResponse('Precios actualizados', {
		// Se retorna una respuesta con el psicologo actualizado
		psychologist: updatedPsychologist, // Se retorna el psicologo actualizado
	});
};

const getClients = async psychologist => {
	// Funcion para obtener los clientes de un psicologo
	let sessions = await Sessions.find({
		// Se buscan todas las sesiones
		psychologist: psychologist,
	}).populate('user');

	return okResponse('Usuarios encontrados', {
		// Se retorna una respuesta con los clientes
		users: sessions // Se retorna todos los clientes
			.filter(item => item.user) // Se filtran los clientes que tienen un usuario
			.map(item => ({
				// Se retorna un arreglo con los clientes
				_id: item.user._id,
				avatar: item.user.avatar,
				avatarThumbnail: item.user.avatarThumbnail,
				createdAt: item.user.createdAt,
				direction: item.user.direction,
				email: item.user.email,
				fullname: `${item.user.name} ${
					item.user.lastName ? item.user.lastName : ''
				}`,
				lastName: item.user.lastName,
				birthDate: item.user.birthDate,
				lastSession: getLastSession(item) || 'N/A',
				name: item.user.name,
				observation: item.observation,
				phone: item.user.phone,
				plan: item.plan.filter(plan => {
					return (
						moment().isBefore(moment(plan.expiration)) &&
						plan.payment === 'success'
					);
				}),
				role: item.user.role,
				roomsUrl: item.roomsUrl,
				rut: item.user.rut,
				sessionsId: item._id,
			}))
			.filter(session => {
				return session.plan.length > 0;
			}),
	});
};

const getLastSession = item => {
	// Funcion para obtener la ultima sesion de un cliente
	return item.plan // Se retorna la ultima sesion del cliente
		.flatMap((
			plan // flatMap se usa para obtener todos los planes del cliente
		) =>
			plan.session.map(session =>
				moment(session.date, 'MM/DD/YYYY HH:mm').format('DD/MM/YYYY')
			)
		)
		.sort((a, b) => new Date(b) - new Date(a)) // Se ordena de forma descendente
		.find(
			(
				sessionDate // Se busca la ultima sesion
			) => moment(sessionDate, 'DD/MM/YYYY').isSameOrBefore(moment()) // Se busca la ultima sesion que no ha expirado
		);
};

const searchClients = async search => {
	// Funcion para buscar clientes
	const foundUser = await User.find({ email: search, name: search }); // Se buscan los clientes por su email o nombre
	if (!foundUser) {
		// Si no se encontro ningun cliente
		return okResponse('No se encontró al usuario', { users: [] }); // Se retorna una respuesta con un arreglo vacio
	}
	return okResponse('Usuario encontrado', { users: foundUser }); // Se retorna una respuesta con el cliente encontrado
};

const usernameAvailable = async username => {
	// Funcion para verificar si un username esta disponible
	let available = true; // Se inicializa la variable como disponible
	if (await Psychologist.exists({ username })) available = false; // Si el username ya existe
	return okResponse(
		// Se retorna una respuesta con el estado de disponibilidad
		available ? 'Usuario disponible' : 'Usuario ya esta ocupado',
		{ available }
	);
};

const updateFormationExperience = async (user, payload) => {
	// Funcion para actualizar la experiencia y la formacion de un psicologo
	if (user.role != 'psychologist') {
		// Si el user no es un psicologo
		return conflictResponse('No eres psicologo');
	}

	/**
	 * Payload schema:
	 * 	models: array
	 * 	specialties: array
	 * 	languages: array
	 * 	formation: array
	 * 	experience: array
	 */

	let updatedPsychologist = await Psychologist.findByIdAndUpdate(
		// Se busca el psicologo por su id y se actualiza
		user.psychologist, // Se busca el psicologo por su id
		payload, // Se actualiza el psicologo con los datos del payload
		{ new: true }
	);
	return okResponse('psicologo actualizado', {
		// Se retorna una respuesta con el psicologo actualizado
		psychologist: updatedPsychologist, // Se retorna el psicologo actualizado
	});
};

const uploadProfilePicture = async (psyID, picture) => {
	// Funcion para subir una foto de perfil
	if (!picture) return conflictResponse('No se ha enviado ninguna imagen'); // Se retorna una respuesta de error
	const { name, lastName, _id } = await User.findById(psyID); // Se busca el usuario por su id
	const gcsname = `${psyID}-${name}-${lastName}`; // Se crea el nombre del archivo en GCS
	const file = bucket.file(gcsname); // Se crea el archivo en GCS, GCS es un bucket de Google Cloud Storage, un bucket en Google Cloud Storage son contenedores básicos que contienen los datos
	const stream = file.createWriteStream({
		// Se crea un stream para escribir en el archivo
		metadata: {
			// Se crea un metadato para el archivo
			contentType: picture.mimetype, // Se le asigna el tipo de archivo
		},
	});
	stream.on('error', err => {
		// Se crea un evento para manejar el error
		picture.cloudStorageError = err; // Se le asigna el error al archivo
		conflictResponse('Error al subir la imagen'); // Se retorna una respuesta de error
	});
	stream.on('finish', () => {
		// Se crea un evento para manejar el fin de la escritura
		logInfo(`${gcsname}` + ' subido exitosamente'); // Se loguea la subida exitosa
	});
	stream.end(picture.buffer); // Se escribe el archivo en el stream
	if (
		process.env.API_URL.includes('hablaqui.cl') ||
		process.env.DEBUG_ANALYTICS === 'true'
	) {
		analytics.track({
			userId: _id.toString(),
			event: 'updated-profile-picture',
			properties: {
				avatar: getPublicUrlAvatar(gcsname),
			},
		});
	}

	await Psychologist.findByIdAndUpdate(psyID, {
		// Se actualiza el psicologo
		avatar: getPublicUrlAvatar(gcsname), // Se le asigna la url de la imagen
		avatarThumbnail: getPublicUrlAvatarThumb(gcsname), // Se le asigna la url de la imagen
	});

	return okResponse('Imagen subida', {
		// Se retorna una respuesta de exito
		avatar: getPublicUrlAvatar(gcsname), // Se le asigna la url de la imagen
		avatarThumbnail: getPublicUrlAvatarThumb(gcsname), // Se le asigna la url de la imagen
	});
};

const approveAvatar = async (user, id) => {
	// Funcion para aprobar una imagen
	if (user.role !== 'superuser')
		// Si el usuario no es superuser
		return conflictResponse(
			// Se retorna un error
			'No tienes permisos suficientes para realizar esta acción'
		);

	const psychologist = await Psychologist.findByIdAndUpdate(
		// Se busca el psicologo
		id,
		{
			approveAvatar: true, // Se actualiza el campo de aprobacion de la imagen
		},
		{ new: true }
	);
	return okResponse('Avatar aprobado', {
		// Se retorna un mensaje de exito
		psychologist,
	});
};

const changeToInmediateAttention = async psy => {
	// Cambia el plan a plan inmediato de atención
	/*if (user.role !== 'psychologist')
		return conflictResponse('No tienes permitida esta opción');
	const psy = user.psychologist;*/
	let psychologist = await Psychologist.findById(psy); // Se obtiene el psicologo
	if (psychologist.inmediateAttention.activated) {
		// Si ya esta activado el plan inmediato de atención
		psychologist = await Psychologist.findOneAndUpdate(
			// Se actualiza el plan a plan normal
			{ _id: psy },
			{
				$set: {
					inmediateAttention: {
						activated: false,
						expiration: '',
					},
				},
			},
			{ new: true }
		);
	} else {
		// Si no esta activado el plan inmediato de atención
		let sessions = await getAllSessionsFunction(psy); // Se obtienen todas las sesiones del psicologo
		let now = new Date(); // Se obtiene la fecha actual
		sessions = sessions.filter(session => {
			// Se filtran las sesiones que ya pasaron
			const date = moment(session.date).format('DD/MM/YYYY HH:mm'); // Se obtiene la fecha de la sesión
			return (
				// Se retorna la sesión si la fecha de la sesión es mayor a la fecha actual
				session.status !== 'success' && // Se retorna la sesión si el estado de la sesión no es exitosa
				moment(date).isBefore(moment(now).add(3, 'hours')) && // y si la fecha de la sesión es menor a la fecha actual mas 3 horas
				moment(date)
					.add(50, 'minutes')
					.isAfter(moment(now))
			);
		});

		if (sessions.length !== 0)
			// Si hay sesiones que no han sido atendidas
			return conflictResponse('Tiene sesiones próximas'); // Se informa que tiene sesiones próximas

		psychologist = await Psychologist.findOneAndUpdate(
			// Se actualiza el plan a plan inmediato de atención
			{ _id: psy },
			{
				$set: {
					inmediateAttention: {
						activated: true,
						expiration: moment(now)
							.add(1, 'hour')
							.format(),
					},
				},
			},
			{ new: true }
		);
	}

	const msj = psychologist.inmediateAttention.activated // Se obtiene el estado del plan inmediato de atención
		? 'Estaras disponible durante las proxima 3 horas'
		: 'Atención inmediata desactivada';

	return okResponse(msj, {
		// Se retorna el estado del plan inmediato de atención
		psychologist,
	});
};
/*
const getAllSessionsInmediateAttention = async () => {
	let psychologist = await Psychologist.find({}).select(
		'_id inmediateAttention'
	);
	// Para que nos de deje modificar el array de mongo
	psychologist = JSON.stringify(psychologist);
	psychologist = JSON.parse(psychologist);
	psychologist = psychologist.filter(
		psy => psy.inmediateAttention.activated === true
	);

	let allSessions = await Sessions.find().populate(
		'psychologist',
		'_id inmediateAttention'
	);

	let now = Date.now();
	// Formato de array debe ser [date, date, ...date]
	const setDaySessions = sessions =>
		sessions.flatMap(item => {
			return item.plan
				.flatMap(plan => {
					return plan.session.length
						? plan.session.map(session => session.date)
						: [];
				})
				.filter(session => {
					const date = moment(session.date).format(
						'DD/MM/YYYY HH:mm'
					);
					return (
						session.status !== 'success' &&
						moment(date).isBefore(moment(now).add(3, 'hours')) &&
						moment(date)
							.add(50, 'minutes')
							.isAfter(moment(now))
					);
				});
		});

	allSessions = psychologist.map(item => ({
		...item,
		sessions: setDaySessions(
			allSessions.filter(element => element.psychologist === item._id)
		).length,
	}));

	return okResponse('Sesiones', { allSessions });
};*/

const psychologistsService = {
	approveAvatar,
	deleteOne,
	getAll,
	getByData,
	getClients,
	match,
	rescheduleSession,
	searchClients,
	setPrice,
	setSchedule,
	updateFormationExperience,
	updatePaymentMethod,
	updatePlan,
	updatePsychologist,
	uploadProfilePicture,
	usernameAvailable,
	changeToInmediateAttention,
};
export default Object.freeze(psychologistsService);
