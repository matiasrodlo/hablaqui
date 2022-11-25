'use strict'; 
 
import { room } from '../config/dotenv'; 
import { logInfo } from '../config/pino'; 
import { getAllSessionsFunction } from '../utils/functions/getAllSessionsFunction'; 
import { conflictResponse, okResponse } from '../utils/responses/functions'; 
import { 
	paymentInfoFunction, 
	formattedSchedule, 
	getLastSessionFromPlan, 
	setSession, 
} from '../utils/functions/sessionsFunctions'; 
import User from '../models/user'; 
import Coupon from '../models/coupons'; 
import mercadopagoService from './mercadopago'; 
import Psychologist from '../models/psychologist'; 
import mailServicePsy from '../utils/functions/mails/psychologistStatus'; 
import mailServiceReminder from '../utils/functions/mails/reminder'; 
import mailServiceSchedule from '../utils/functions/mails/schedule'; 
import Sessions from '../models/sessions'; 
import dayjs from 'dayjs'; 
import crypto from 'crypto'; 
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'; 
import utc from 'dayjs/plugin/utc'; 
import timezone from 'dayjs/plugin/timezone'; 
import localizedFormat from 'dayjs/plugin/localizedFormat'; 
import customParseFormat from 'dayjs/plugin/customParseFormat'; 
import Analytics from 'analytics-node'; 
dayjs.extend(isSameOrAfter); 
dayjs.extend(utc); 
dayjs.extend(timezone); 
dayjs.extend(localizedFormat); 
dayjs.extend(customParseFormat); 
dayjs.tz.setDefault('America/Santiago'); 
 
const analytics = new Analytics(process.env.SEGMENT_API_KEY); 
 
const getSessions = async (userLogged, idUser) => { 
	// iniciamos la variable 
	let sessions; 
 
	// Buscamos la sesiones correspondiente a ese user y psicologo 
	if (userLogged.role === 'user') { 
		sessions = await Sessions.find({ 
			//psychologist: idPsy, 
			user: idUser, 
		}).populate('psychologist user'); 
	} 
	if (userLogged.role === 'psychologist') { 
		sessions = await Sessions.find({ 
			psychologist: idUser, 
		}).populate('psychologist user'); 
	} 
 
	// Para que nos de deje modificar el array de mongo 
	sessions = JSON.stringify(sessions); 
	sessions = JSON.parse(sessions); 
 
	// Comenzamos a modificar el array de sessiones con la estructura que necesita el frontend 
	sessions = setSession(userLogged.role, sessions); 
 
	logInfo('obtuvo todos las sesiones'); 
	// Print sessions in json format 
	return okResponse('sesiones obtenidas', { sessions }); 
}; 
 
const getRemainingSessions = async psy => { 
	let sessions = await Sessions.find({ 
		psychologist: psy, 
	}).populate('psychologist user'); 
 
	sessions = sessions.flatMap(item => { 
		let name = ''; 
		let lastName = ''; 
 
		// Establece nombre de quien pertenece cada sesion, verificando si existe el usuario y su id 
		if (item.user && item.user._id) { 
			name = item.user.name; 
			lastName = item.user.lastName ? item.user.lastName : ''; 
		} else { 
			name = 'Compromiso privado'; 
			lastName = ''; 
		} 
 
		// Retorna el plan con las sesiones restantes 
		return item.plan.flatMap(plan => { 
			return { 
				idPlan: plan._id, 
				name: `${name} ${lastName}`, 
				remaining: plan.remainingSessions, 
				sessions: `${plan.remainingSessions} de ${plan.totalSessions}`, 
				statusPlan: plan.payment, 
			}; 
		}); 
	}); 
 
	return okResponse('Sesiones restantes obtenidas', { 
		sessions: sessions.filter(session => { 
			return session.remaining > 0; 
		}), 
	}); 
}; 
 
// Reprogramación sesiones para psicologos 
const cancelSession = async (user, planId, sessionsId, id) => { 
	const cancelSessions = await Sessions.findOneAndUpdate( 
		{ 
			_id: sessionsId, 
			'plan._id': planId, 
			'plan.session._id': id, 
		}, 
		{ 
			$pull: { 
				'plan.$.session': { _id: id }, 
			}, 
		} 
	).populate('psychologist user'); 
 
	/*session = getLastSessionFromPlan(session, id, planId); 
 
	const date = dayjs(session.date).format(); 
	const lastSession = dayjs(session.lastSession).format(); 
 
	//En caso de cancelar una sesión, cambiará a fecha de expiración si las sesiones restantes eran 0 
	//y la fecha de lasesión cancelada sea igual que la fecha de la ultima sesión (sesión cuando expirá actualmente) 
	if ( 
		session.remainingSessions === 0 && 
		new Date(date).getTime() === new Date(lastSession).getTime() 
	) { 
		const expiration = dayjs(session.datePayment) 
			.add(1, 'months') 
			.format(); 
		await Sessions.findOneAndUpdate( 
			{ _id: sessionsId, 'plan._id': session.plan_id }, 
			{ 
				$set: { 
					'plan.$.expiration': expiration, 
				}, 
			} 
		); 
	}*/ 
 
	// Considera que el usuario es psicologo 
	const sessions = await Sessions.find({ 
		psychologist: cancelSessions[0].psychologist._id, 
	}).populate('psychologist user'); 
 
	// Se verifica si es un compromiso privado 
	if (cancelSessions.user === null) { 
		await mailServiceReminder.sendCancelCommitment( 
			cancelSessions.psychologist 
		); 
	} else { 
		await mailServiceReminder.sendCancelSessionPsy( 
			cancelSessions.user, 
			cancelSessions.psychologist 
		); 
		await mailServiceReminder.sendCancelSessionUser( 
			cancelSessions.user, 
			cancelSessions.psychologist 
			//sessionCancel.plan[0].session[0].date 
		); 
	} 
 
	return okResponse('Sesion cancelada', { 
		sessions: setSession(user.role, sessions), 
	}); 
}; 
 
const checkPlanTask = async () => { 
	// Busca todos los usuarios, filtra los que tienen planes, los recorre y verifica si el plan está vencido 
	let allUsers = await User.find(); 
	let planUsers = allUsers.filter(user => user.plan.length > 0); 
	planUsers.forEach(async userWithPlan => { 
		let foundUser = await User.findById(userWithPlan._id); 
		foundUser.plan.forEach(plan => { 
			if (dayjs().isAfter(plan.expiration)) { 
				plan.status = 'expired'; 
			} 
		}); 
		foundUser.save(); 
	}); 
 
	return okResponse('ok'); 
}; 
 
/** 
 * @description Función que crea un plan para un usuario 
 * @param {String} payload.paymentPeriod - Indica el tiempo de la suscripcion 
 * @param {String} payload.title - Nombre del plan 
 * @param {Number} payload.price - Precio del plan 
 * @param {String} payload.coupon - Cupon usado, caso contrario es '' 
 * @param {ObjectId} payload.user - Id del user 
 * @param {ObjectId} payload.psychologist - Id del psicologo 
 * @returns 
 */ 
const createPlan = async ({ payload }) => { 
	if (payload.user === payload.psychologist && payload.price !== 0) { 
		return conflictResponse('No puedes suscribirte a ti mismo'); 
	} 
	// Válido MM/DD/YYYY HH:mm 
	const date = `${payload.date} ${payload.start}`; 
	const psychologist = await Psychologist.findById(payload.psychologist); 
	const minimumNewSession = psychologist.preferences.minimumNewSession; 
 
	// Verifica que la fecha de la sesión despues de la fecha actual según la preferencia del psicologo 
	if ( 
		!psychologist.inmediateAttention.activated && 
		dayjs().isAfter( 
			dayjs(date, 'MM/DD/YYYY HH:mm').subtract(minimumNewSession, 'hours') 
		) 
	) { 
		return conflictResponse( 
			'No se puede agendar, se excede el tiempo de anticipación de la reserva' 
		); 
	} 
	// Se inicializa la cantidad de sesiones y su expiración 
	let sessionQuantity = 0; 
	let expirationDate = ''; 
 
	if (payload.paymentPeriod == 'Pago semanal') { 
		sessionQuantity = 1; 
		expirationDate = dayjs(date, 'MM/DD/YYYY HH:mm') 
			.add(50, 'minutes') 
			.format(); 
	} 
	if (payload.paymentPeriod == 'Pago mensual') { 
		sessionQuantity = 4; 
		expirationDate = dayjs() 
			.add(2, 'months') 
			.format(); 
	} 
	if (payload.paymentPeriod == 'Pago trimestral') { 
		sessionQuantity = 12; 
		expirationDate = dayjs() 
			.add(6, 'months') 
			.format(); 
	} 
 
	// Se crea la primera sesión 
	const newSession = { 
		date, 
		sessionNumber: 1, 
		paidToPsychologist: false, 
	}; 
	const foundCoupon = await Coupon.findOne({ code: payload.coupon }); 
 
	// Se genera un código aleatorio para el token de pago 
	const randomCode = () => { 
		return Math.random() 
			.toString(36) 
			.substring(2); 
	}; 
	const token = randomCode() + randomCode(); 
 
	let price = payload.price < 0 ? 0 : payload.price; 
	// Si se encuentra un cupon y el tipo de descuento es estático, se asgina el valor del cupon al precio 
	if (foundCoupon && foundCoupon.discountType === 'static') 
		price = payload.originalPrice; 
 
	// Se crea el plan 
	const newPlan = { 
		title: payload.title, 
		period: payload.paymentPeriod, 
		datePayment: '', 
		totalPrice: price, 
		sessionPrice: price / sessionQuantity, 
		expiration: expirationDate, 
		usedCoupon: payload.coupon, 
		totalSessions: sessionQuantity, 
		remainingSessions: sessionQuantity - 1, 
		tokenToPay: token, 
		session: [newSession], 
	}; 
 
	// Se busca en Sessions un documento con el usuario y el psicologo, además genera la sala 
	const userSessions = await Sessions.findOne({ 
		user: payload.user, 
		psychologist: payload.psychologist, 
	}); 
 
	const roomId = crypto 
		.createHash("sha256") 
		.update(`${payload.user}${payload.psychologist}`) 
		.digest('hex'); 
 
	const url = 
		payload.title !== 'Acompañamiento vía mensajería' 
			? `${room}room/${roomId}` 
			: ''; 
 
	// Se verifica que el precio sea mayor a cero y que el usuario no sea el mismo que el psicologo 
	if (payload.price > 0 && payload.user !== payload.psychologist) { 
		// Se asigna el psicologo al usuario 
		await User.findByIdAndUpdate(payload.user, { 
			$set: { 
				psychologist: payload.psychologist, 
			}, 
		}); 
		// Se hace el trakeo en segment 
		analytics.track({ 
			userId: payload.user._id.toString(), 
			event: 'user-purchase-plan', 
			properties: { 
				plan: payload.title, 
				period: payload.paymentPeriod, 
				price: payload.price, 
				expiration: expirationDate, 
				totalSessions: sessionQuantity, 
			}, 
		}); 
		analytics.track({ 
			userId: payload.psychologist.toString(), 
			event: 'psy-new-plan', 
			properties: { 
				plan: payload.title, 
				period: payload.paymentPeriod, 
				price: payload.price, 
				expiration: expirationDate, 
				totalSessions: sessionQuantity, 
				user: payload.user._id.toString(), 
			}, 
		}); 
	} 
 
	let created = null; 
 
	const userPlans = await Sessions.find({ user: payload.user }); 
 
	// Recorre los planes verificando si el usuario ya tiene un plan activo 
	if ( 
		userPlans.some(sessions => { 
			return sessions.plan.some( 
				plan => 
					plan.payment === 'success' && 
					dayjs().isBefore(dayjs(plan.expiration)) && 
					plan.title !== 'Plan inicial' && 
					sessions.psychologist.toString() !== payload.psychologist 
			); 
		}) 
	) 
		return conflictResponse('El usuario ya tiene un plan vigente'); 
	else { 
		// Si se encontró un docuemnto, se agrega el nuevo plan con la URL de la sala 
		if (userSessions) { 
			created = await Sessions.findOneAndUpdate( 
				{ user: payload.user, psychologist: payload.psychologist }, 
				{ $push: { plan: newPlan }, $set: { roomsUrl: url } }, 
				{ new: true } 
			); 
		} else { 
			created = await Sessions.create({ 
				user: payload.user, 
				psychologist: payload.psychologist, 
				plan: [newPlan], 
				roomsUrl: url, 
			}); 
		} 
	} 
 
	// Hace el trakeo en segment 
	if ( 
		process.env.API_URL.includes('hablaqui.cl') || 
		process.env.DEBUG_ANALYTICS === 'true' 
	) { 
		let planData = [ 
			{ 
				item_id: created._id.toString(), 
				item_name: payload.title, 
				coupon: payload.coupon || '', 
				price: payload.price / sessionQuantity, 
				quantity: sessionQuantity, 
			}, 
		]; 
		analytics.track({ 
			userId: payload.user._id.toString(), 
			event: 'current-user-purchase-plan', 
			properties: { 
				products: planData, 
				order_id: created.plan[created.plan.length - 1]._id.toString(), 
				timestamp: dayjs().format(), 
				total: payload.price / sessionQuantity, 
			}, 
		}); 
		analytics.track({ 
			userId: payload.psychologist.toString(), 
			event: 'current-psy-new-plan', 
			properties: { 
				products: planData, 
				user: payload.user._id, 
				order_id: created.plan[created.plan.length - 1]._id.toString(), 
				timestamp: dayjs().format(), 
			}, 
		}); 
	} 
 
	// Si se encontró un cupon, se hace el descuento 
	if (foundCoupon) { 
		let discount = -payload.price; 
		if (foundCoupon.discountType === 'static') { 
			if (payload.price >= 0) discount = 0; 
			await Coupon.findOneAndUpdate( 
				{ _id: foundCoupon._id }, 
				{ $set: { discount: discount } } 
			); 
		} 
	} 
 
	let responseBody = { init_point: null }; 
 
	// Si el precio es menor o igual a cero quiere decir que es un plan gratuito 
	if (payload.price <= 0) { 
		await mercadopagoService.successPay({ 
			sessionsId: created._id.toString(), 
			planId: created.plan.pop()._id.toString(), 
		}); 
	} else { 
		// Se crea el pago en mercadopago 
		const user = await User.findById(payload.user); 
		const plan = created.plan.pop(); 
		const mercadopagoPayload = { 
			psychologist: psychologist.username, 
			price: payload.price, 
			description: 
				payload.title + 
				' - Pagado por ' + 
				user.name + 
				' ' + 
				user.lastName, 
			quantity: 1, 
			sessionsId: created._id.toString(), 
			planId: plan._id.toString(), 
			token, 
		}; 
		responseBody = await mercadopagoService.createPreference( 
			mercadopagoPayload 
		); 
		await mailServicePsy.pendingPlanPayment( 
			user, 
			psychologist, 
			payload.price, 
			responseBody.init_point 
		); 
	} 
 
	return okResponse('Plan y preferencias creadas', responseBody); 
}; 
 
/** 
 * @description Crea una sesion nueva. 
 * @param {Object} userLogged - user logged 
 * @param {ObjectId} payload.id - Id sessions 
 * @param {ObjectId} payload.idPlan - Id plan 
 * @param {Object} payload - datos para guardar 
 * @returns sessions actualizada 
 */ 
//Nueva sesion agendada correo (sin pago de sesión) para ambos 
const createSession = async (userLogged, id, idPlan, payload) => { 
	const { psychologist, plan, roomsUrl } = await Sessions.findOne({ 
		_id: id, 
	}).populate('psychologist'); 
 
	const minimumNewSession = psychologist.preferences.minimumNewSession; 
	// Comprobar si la fecha es posterior a la fecha actual más el tiempo mínimo 
	if ( 
		dayjs().isAfter( 
			dayjs(payload.date, 'MM/DD/YYYY HH:mm').subtract( 
				minimumNewSession, 
				'hours' 
			) 
		) 
	) { 
		return conflictResponse( 
			'No se puede agendar, se excede el tiempo de anticipación de la reserva' 
		); 
	} 
 
	// Se encuentra el plan indicado, y se verifica si está pagado 
	const myPlan = plan.filter( 
		plan => plan._id.toString() === idPlan.toString() 
	)[0]; 
 
	if (myPlan.payment !== 'success') 
		return conflictResponse('No puedes agendar un plan sin pagar'); 
 
	// Se busca el plan, se ingresa la cantidad de sesiones restantes e información con respecto al nuevo plan 
	let sessions = await Sessions.findOneAndUpdate( 
		{ _id: id, 'plan._id': idPlan }, 
		{ 
			$set: { 
				'plan.$.remainingSessions': payload.remainingSessions, 
			}, 
			$push: { 'plan.$.session': payload }, 
		}, 
		{ new: true } 
	).populate('psychologist user'); 
 
	// Si no quedan sesiones por agendar, se obtiene la ultima sesion del plan 
	if (payload.remainingSessions === 0) { 
		let session = getLastSessionFromPlan(sessions, '', idPlan); 
		const expiration = dayjs(session.lastSession) 
			.add(50, 'minutes') 
			.format(); 
		// La nueva expiración es la fecha de la ultima sesion del plan + 50 minutos 
		sessions = await Sessions.findOneAndUpdate( 
			{ _id: id, 'plan._id': idPlan }, 
			{ 
				$set: { 
					'plan.$.expiration': expiration, 
				}, 
			} 
		).populate('psychologist user'); 
	} 
 
	// Se hace el trackeo en segment 
	if ( 
		process.env.API_URL.includes('hablaqui.cl') || 
		process.env.DEBUG_ANALYTICS === 'true' 
	) { 
		analytics.track({ 
			userId: userLogged._id.toString(), 
			event: 'user-new-session', 
			properties: { 
				user: userLogged._id, 
				planId: idPlan, 
				userpsyId: id, 
				email: userLogged.email, 
			}, 
		}); 
		const getUser = await User.findOne({ email: psychologist.email }); 
		const userID = getUser._id; 
		analytics.track({ 
			userId: userID.toString(), 
			event: 'psy-new-session', 
			properties: { 
				user: userLogged._id, 
				planId: idPlan, 
				userpsyId: id, 
			}, 
		}); 
	} 
	await mailServiceSchedule.sendScheduleToUser( 
		userLogged, 
		psychologist, 
		dayjs(payload.date, 'MM/DD/YYYY HH:mm'), 
		roomsUrl, 
		`${myPlan.totalSessions - payload.remainingSessions}/${ 
			myPlan.totalSessions 
		}` 
	); 
	await mailServiceSchedule.sendScheduleToPsy( 
		userLogged, 
		psychologist, 
		dayjs(payload.date, 'MM/DD/YYYY HH:mm'), 
		roomsUrl, 
		`${myPlan.totalSessions - payload.remainingSessions}/${ 
			myPlan.totalSessions 
		}` 
	); 
 
	return okResponse('sesion creada', { 
		sessions: setSession(userLogged.role, [sessions]), 
	}); 
}; 
/** 
 * Creacion de sesion personalizda 
 * (invitado por psicologo, o bloqueo de horas) 
 * @param {Object} user Usuario logeado 
 * @param {string} payload.date Fecha de la sesion 
 * @param {string} payload.type Tipo de la sesion ['online', 'presencial', 'commitment', etc...] 
 * @param {Number} payload.price Precio que se cobrara 
 * @returns sessions 
 */ 
const customNewSession = async (user, payload) => { 
	try { 
		// Validamos que sea psicologo 
		if (user.role !== 'psychologist') 
			return conflictResponse('No eres psicologo'); 
		let sessions = []; 
		let hours = 1; 
 
		// Se comprueba si es una sesion de compromiso 
		if (payload.dateEnd && payload.type === 'compromiso privado') { 
			const start = dayjs(payload.date, 'MM/DD/YYYY HH:mm'); 
			const end = dayjs(payload.dateEnd, 'MM/DD/YYYY HH:mm'); 
			hours = Math.abs(end.diff(start, 'hours')) + 1; 
		} 
 
		// Objeto con la sesion a crear 
		for (let i = 0; i < hours; i++) { 
			const date = dayjs(payload.date, 'MM/DD/YYYY HH:mm').add( 
				i, 
				'hours' 
			); 
			const newSession = { 
				date: date.format('MM/DD/YYYY HH:mm'), 
				sessionNumber: i + 1, 
				paidToPsychologist: false, 
				status: 'pending', 
			}; 
			sessions.push(newSession); 
		} 
 
		// Objeto con el plan a crear 
		const newPlan = { 
			title: payload.type, 
			period: 'Pago semanal', 
			totalPrice: payload.price, 
			sessionPrice: payload.price, 
			payment: 
				payload.type === 'compromiso privado' ? 'success' : 'pending', 
			expiration: dayjs(payload.date, 'MM/DD/YYYY HH:mm') 
				.add(1, 'week') 
				.toISOString(), 
			usedCoupon: '', 
			totalSessions: 1, 
			remainingSessions: 0, 
			session: sessions, 
		}; 
 
		// Si existe un plan con este titulo lo removemos 
		await Sessions.updateOne( 
			{ 
				user: payload.user, 
				psychologist: user.psychologist, 
			}, 
			{ 
				$pull: { 
					plan: { title: 'Plan inicial' }, 
				}, 
			} 
		); 
 
		// Creamos la direccion de la sala de videollamadas 
		const roomId = crypto 
			.createHash("sha256") 
			.update(`${payload.user}${payload.psychologist}`) 
			.digest('hex'); 
 
		// creamos o actualizamos las sesiones entre el usuario y el psicologo 
		// cuando se crea compromiso privado el user será null 
		const updatedSession = await Sessions.findOneAndUpdate( 
			{ 
				user: payload.user, 
				psychologist: user.psychologist, 
			}, 
			{ 
				user: payload.user, 
				psychologist: user.psychologist, 
				$push: { plan: newPlan }, 
				roomsUrl: payload.user ? `${room}room/${roomId}` : '', 
			}, 
			{ upsert: true, new: true } 
		).populate('user psychologist'); 
 
		// Correo de compromiso privado 
		if (payload.type === 'compromiso privado') 
			await mailServiceReminder.sendCustomSessionCommitment( 
				updatedSession.psychologist 
			); 
 
		// Validamos precio y que exista user(recordemos que user es null en compromiso privado) 
		if (payload.price && payload.price > 0 && payload.user) { 
			const { 
				data, 
			} = await mercadopagoService.createCustomSessionPreference({ 
				userId: payload.user, 
				psyId: user.psychologist, 
				planId: updatedSession.plan[updatedSession.plan.length - 1]._id, 
			}); 
			if (payload.type === 'sesion online') { 
				// Enviamos email al user con el link para pagar 
				await mailServiceSchedule.sendCustomSessionToUser( 
					updatedSession.user, 
					updatedSession.psychologist, 
					data.init_point, 
					payload.date, 
					payload.price, 
					'online' 
				); 
				await mailServiceSchedule.sendCustomSessionToPsy( 
					updatedSession.user, 
					updatedSession.psychologist, 
					data.init_point, 
					payload.date, 
					payload.price, 
					'online' 
				); 
			} 
			if (payload.type === 'sesion presencial') { 
				await mailServiceSchedule.sendCustomSessionToUser( 
					updatedSession.user, 
					updatedSession.psychologist, 
					data.init_point, 
					payload.date, 
					payload.price, 
					'presencial' 
				); 
				await mailServiceSchedule.sendCustomSessionToPsy( 
					updatedSession.user, 
					updatedSession.psychologist, 
					data.init_point, 
					payload.date, 
					payload.price, 
					'presencial' 
				); 
			} 
		} 
		// Se hace el trakeo en segment 
		if ( 
			process.env.API_URL.includes('hablaqui.cl') || 
			process.env.DEBUG_ANALYTICS === 'true' 
		) { 
			if (payload.type === 'online') { 
				let planData = [ 
					{ 
						item_id: 3, 
						item_name: 
							'Plan/sesión personalizada agendada por psicólogo', 
						item_price: payload.price, 
						item_quantity: 1, 
					}, 
				]; 
				analytics.track({ 
					userId: user._id.toString(), 
					event: 'psy-scheduled-user-session', 
					properties: { 
						products: planData, 
						currency: 'CLP', 
						order_id: updatedSession.plan[ 
							updatedSession.plan.length - 1 
						]._id.toString(), 
						total: 0, 
					}, 
				}); 
			} else if (payload.type === 'presencial') { 
				let planData = [ 
					{ 
						item_id: 4, 
						item_name: 
							'Plan/sesión personalizada agendada por psicólogo presencialmente', 
						item_price: payload.price, 
						item_quantity: 1, 
					}, 
				]; 
				analytics.track({ 
					userId: user._id.toString(), 
					event: 'psy-scheduled-onsite-user-session', 
					properties: { 
						products: planData, 
						currency: 'CLP', 
						order_id: updatedSession.plan[ 
							updatedSession.plan.length - 1 
						]._id.toString(), 
						total: 0, 
					}, 
				}); 
			} else if (payload.type === 'compromiso privado') { 
				analytics.track({ 
					userId: user._id.toString(), 
					event: 'psy-scheduled-private-hours', 
				}); 
			} 
		} 
		// respondemos con la sesion creada 
		return okResponse('sesion creada', { 
			sessions: setSession(user.role, [updatedSession]).pop(), 
		}); 
	} catch (err) { 
		logInfo(err); 
	} 
}; 
 
const getFormattedSessionsForMatch = async idPsychologist => { 
	let sessions = []; 
	// obtenemos el psicologo 
	const psychologist = await Psychologist.findById(idPsychologist).select( 
		'_id schedule preferences inmediateAttention' 
	); 
	// creamos un array con la cantidad de dias 
	const length = Array.from(Array(31), (_, x) => x); 
	// creamos un array con la cantidad de horas 
	const hours = Array.from(Array(24), (_, x) => 
		dayjs() 
			.hour(x) 
			.minute(0) 
			.format('HH:mm') 
	); 
	// Obtenemos sessiones del psicologo 
	let psySessions = await Sessions.find({ 
		psychologist: idPsychologist, 
	}); 
 
	// Filtramos que cada session sea de usuarios con pagos success y no hayan expirado 
	psySessions = psySessions.filter(item => 
		item.plan.some(plan => { 
			return ( 
				plan.payment === 'success' && 
				dayjs().isBefore(dayjs(plan.expiration)) 
			); 
		}) 
	); 
 
	// Formato de array debe ser [date, date, ...date] 
	const daySessions = psySessions 
		.flatMap(item => { 
			return item.plan.flatMap(plan => { 
				return plan.session.length 
					? plan.session.map(session => session.date) 
					: []; 
			}); 
		}) 
		.filter(date => dayjs(date, 'MM/DD/YYYY HH:mm').isSameOrAfter(dayjs())); 
	let minimumNewSession = dayjs(Date.now()).add( 
		psychologist.preferences.minimumNewSession, 
		'h' 
	); 
 
	sessions = length.map(el => { 
		const day = dayjs().add(el, 'days'); 
		const temporal = dayjs(day).format('L'); 
 
		return { 
			id: el, 
			value: day.format(), 
			day: day.format('DD MMM'), 
			date: day.format('L'), 
			text: dayjs(day).format(), 
			available: hours.filter(hour => { 
				return ( 
					dayjs(`${temporal} ${hour}`, 'MM/DD/YYYY HH:mm').isAfter( 
						minimumNewSession 
					) && 
					formattedSchedule(psychologist.schedule, day, hour) && 
					!daySessions.some( 
						date => 
							dayjs(date, 'MM/DD/YYYY HH:mm').format('L') === 
								dayjs(day).format('L') && 
							hour === 
								dayjs(date, 'MM/DD/YYYY HH:mm').format('HH:mm') 
					) 
				); 
			}), 
		}; 
	}); 
	return sessions; 
}; 
 
//type: será el tipo de calendario que debe mostrar (agendamiento o reagendamiento) 
// Utilizado para traer las sessiones de un psicologo para el selector 
const getFormattedSessions = async (idPsychologist, type) => { 
	let sessions = []; 
	// Obtenemos el psicologo 
	const psychologist = await Psychologist.findById(idPsychologist).select( 
		'_id schedule preferences inmediateAttention' 
	); 
	// Creamos un array con la cantidad de dias 
	const length = Array.from(Array(31), (_, x) => x); 
	// Creamos un array con la cantidad de horas 
	const hours = Array.from(Array(24), (_, x) => 
		dayjs() 
			.hour(x) 
			.minute(0) 
			.format('HH:mm') 
	); 
	// Obtenemos sessiones del psicologo 
	let psySessions = await Sessions.find({ 
		psychologist: idPsychologist, 
	}); 
 
	// Filtramos que cada session sea de usuarios con pagos success y no hayan expirado 
	psySessions = psySessions.filter(item => 
		item.plan.some(plan => { 
			return ( 
				plan.payment === 'success' && 
				dayjs().isBefore(dayjs(plan.expiration)) 
			); 
		}) 
	); 
 
	// Formato de array debe ser [date, date, ...date] 
	const daySessions = psySessions 
		.flatMap(item => { 
			return item.plan.flatMap(plan => { 
				return plan.session.length 
					? plan.session.map(session => session.date) 
					: []; 
			}); 
		}) 
		.filter(date => dayjs(date, 'MM/DD/YYYY HH:mm').isSameOrAfter(dayjs())); 
 
	// Veificamos el tipo de calendario que se debe mostrar 
	let minimumNewSession = 0; 
	if (type === 'schedule') 
		minimumNewSession = dayjs(Date.now()).add( 
			psychologist.preferences.minimumNewSession, 
			'h' 
		); 
	else if (type === 'reschedule') 
		minimumNewSession = dayjs(Date.now()).add( 
			psychologist.preferences.minimumRescheduleSession, 
			'h' 
		); 
 
	// Se obtiene la disponibilidad del psicologo 
	sessions = length.map(el => { 
		const day = dayjs(Date.now()).add(el, 'days'); 
		const temporal = dayjs(day).format('L'); 
 
		return { 
			id: el, 
			value: day.format(), 
			day: day.format('DD MMM'), 
			date: day.format('L'), 
			text: dayjs(day).format(), 
			available: hours.filter(hour => { 
				return ( 
					dayjs(`${temporal} ${hour}`, 'MM/DD/YYYY HH:mm').isAfter( 
						minimumNewSession 
					) && 
					formattedSchedule(psychologist.schedule, day, hour) && 
					!daySessions.some( 
						date => 
							dayjs(date, 'MM/DD/YYYY HH:mm').format('L') === 
								dayjs(day).format('L') && 
							hour === 
								dayjs(date, 'MM/DD/YYYY HH:mm').format('HH:mm') 
					) 
				); 
			}), 
		}; 
	}); 
	return okResponse('sesiones obtenidas', { sessions }); 
}; 
 
// Utilizado para traer las sessiones de todos los psicologos para el selector 
const formattedSessionsAll = async ids => { 
	let sessions = []; 
	let psychologist = []; 
	if (ids && Array.isArray(ids) && ids.length) { 
		psychologist = await Psychologist.find({ _id: { $in: ids } }).select( 
			'schedule preferences inmediateAttention' 
		); 
	} else 
		psychologist = await Psychologist.find({}).select( 
			'schedule preferences inmediateAttention' 
		); 
	// Para que nos de deje modificar el array de mongo 
	psychologist = JSON.stringify(psychologist); 
	psychologist = JSON.parse(psychologist); 
 
	// creamos un array con la cantidad de dias 
	const length = Array.from(Array(31), (_, x) => x); 
	// creamos un array con la cantidad de horas 
	const hours = Array.from(Array(24), (_, x) => 
		dayjs() 
			.hour(x) 
			.minute(0) 
			.format('HH:mm') 
	); 
 
	// Formato de array debe ser [date, date, ...date] 
	const setDaySessions = sessions => 
		sessions 
			.flatMap(item => { 
				return item.plan.flatMap(plan => { 
					return plan.session.length 
						? plan.session.map(session => session.date) 
						: []; 
				}); 
			}) 
			.filter(date => 
				dayjs(date, 'MM/DD/YYYY HH:mm').isSameOrAfter(dayjs()) 
			); 
 
	// Obtenemos sessiones del psicologo 
	let allSessions = await Sessions.find({}).populate( 
		'psychologist', 
		'_id schedule preferences inmediateAttention' 
	); 
 
	// Filtramos que cada session sea de usuarios con pagos success y no hayan expirado 
	allSessions = allSessions.filter(item => 
		item.plan.some(plan => { 
			return ( 
				plan.payment === 'success' && 
				dayjs().isBefore(dayjs(plan.expiration)) 
			); 
		}) 
	); 
 
	// Mapeamos los psicologos para agregarle las sessiones filtrando por psicologo 
	allSessions = psychologist.map(item => ({ 
		...item, 
		sessions: setDaySessions( 
			allSessions.filter( 
				element => 
					element.psychologist._id.toString() === item._id.toString() 
			) 
		), 
	})); 
 
	// Obtenemos la disponibilidad de todos los psicolgos 
	sessions = allSessions.map(item => { 
		const minimumNewSession = dayjs(Date.now()).add( 
			item.preferences.minimumNewSession, 
			'h' 
		); 
		let schedule = item.schedule; 
 
		return { 
			psychologist: item._id, 
			sessions: length.map(el => { 
				const day = dayjs().add(el, 'days'); 
				const temporal = dayjs(day).format('L'); 
				return { 
					psychologist: item._id, 
					value: day.format(), 
					day: day.format('DD MMM'), 
					date: day.format('L'), 
					text: dayjs(day).format(), 
					available: hours.filter(hour => { 
						return ( 
							dayjs( 
								`${temporal} ${hour}`, 
								'MM/DD/YYYY HH:mm' 
							).isAfter(minimumNewSession) && 
							formattedSchedule(schedule, day, hour) && 
							!item.sessions.some( 
								date => 
									dayjs(date, 'MM/DD/YYYY HH:mm').format( 
										'L' 
									) === temporal && 
									hour === 
										dayjs(date, 'MM/DD/YYYY HH:mm').format( 
											'HH:mm' 
										) 
							) 
						); 
					}), 
				}; 
			}), 
		}; 
	}); 
	return okResponse('sesiones obtenidas', { sessions }); 
}; 
 
const paymentsInfo = async user => { 
	if (user.role != 'psychologist') 
		return conflictResponse('No eres psicologo'); 
 
	const payments = await paymentInfoFunction(user.psychologist); 
	return okResponse('Obtuvo todo sus pagos', { payments }); 
}; 
 
/** 
 * Reprogramacion de sesion 
 * @param {string} userLogged Usuario logeado 
 * @param {string} sessionsId sessionsId id de las sessiones 
 * @param {string} id id del sub scheme session 
 * @param {Object} newDate Datos a actualizar 
 * @returns sessions 
 */ 
const reschedule = async (userLogged, sessionsId, id, newDate) => { 
	// Se obtiene la session a reprogramar, se obtiene el tiempo minimo para reprogramar 
	let currentSession = await Sessions.findOne({ 
		_id: sessionsId, 
	}).populate('psychologist', 'preferences'); 
	const { 
		minimumRescheduleSession, 
	} = currentSession.psychologist.preferences; 
 
	// Se obtiene las sessiones del plan, luego se filtra la session a reprogramar 
	currentSession = currentSession.plan 
		.flatMap(plan => { 
			return plan.session; 
		}) 
		.filter(s => s._id.toString() === id.toString())[0]; 
 
	// Si la session esta programada despues de la fecha actual quitando el tiempo minimo para reprogramar 
	if ( 
		dayjs().isAfter( 
			dayjs(currentSession.date, 'MM/DD/YYYY HH:mm').subtract( 
				minimumRescheduleSession, 
				'hours' 
			) 
		) 
	) { 
		return conflictResponse( 
			'No puede agendar ' + 
				minimumRescheduleSession + 
				' horas antes de la sesión' 
		); 
	} 
 
	// Se le da formato a la fecha nueva, se actualiza la fecha de la session 
	const date = `${newDate.date} ${newDate.hour}`; 
	newDate.date = dayjs(newDate.date, 'MM/DD/YYY').format('DD/MM/YYYY'); 
	const sessions = await Sessions.findOneAndUpdate( 
		{ 
			_id: sessionsId, 
			'plan.session._id': id, 
		}, 
		{ 
			$set: { 
				'plan.$[].session.$[session].date': date, 
			}, 
		}, 
		{ arrayFilters: [{ 'session._id': id }], new: true } 
	).populate('psychologist user'); 
 
	// Se obtiene la ultima session del plan y se verifica si existen sessiones pendientes 
	let session = getLastSessionFromPlan(sessions, id, ''); 
 
	if (session.remainingSessions === 0) { 
		// Si no existen sessiones pendientes, se da fecha de expiracion a la session 50 minutos despues de la ultima session 
		const expiration = dayjs(session.lastSession, 'YYYY/MM/DD HH:mm') 
			.add(50, 'minutes') 
			.format(); 
		await Sessions.findOneAndUpdate( 
			{ _id: sessionsId, 'plan._id': session.plan_id }, 
			{ 
				$set: { 
					'plan.$.expiration': expiration, 
				}, 
			} 
		); 
	} 
 
	// Se envia correo de reprogramacion 
	if (userLogged.role === 'user') { 
		await mailServiceSchedule.sendRescheduleToUser( 
			sessions.user, 
			sessions.psychologist, 
			newDate 
		); 
		await mailServiceSchedule.sendRescheduleToPsy( 
			sessions.user, 
			sessions.psychologist, 
			newDate, 
			sessions.roomsUrl 
		); 
	} else { 
		await mailServiceSchedule.sendRescheduleToUserByPsy( 
			sessions.user, 
			sessions.psychologist, 
			newDate, 
			sessions.roomsUrl 
		); 
		await mailServiceSchedule.sendRescheduleToPsyByPsy( 
			sessions.user, 
			sessions.psychologist, 
			newDate, 
			sessions.roomsUrl 
		); 
	} 
 
	// Se hace el trackeo de la reprogramacion en segment 
	if ( 
		process.env.API_URL.includes('hablaqui.cl') || 
		process.env.DEBUG_ANALYTICS === 'true' 
	) { 
		analytics.track({ 
			userId: userLogged._id.toString(), 
			event: 'user-reschedule-session', 
			properties: { 
				user: userLogged._id, 
				psychologistId: sessions.psychologist._id.toString(), 
			}, 
		}); 
	} 
	return okResponse('Hora actualizada', { 
		sessions: setSession(userLogged.role, [sessions]), 
	}); 
}; 
 
/** 
 * Actualiza una sessions 
 * @param {string} sessions campos a actualizar 
 */ 
const updateSessions = async sessions => { 
	await Sessions.updateOne( 
		{ 
			_id: sessions._id, 
		}, 
		{ 
			$set: { 
				observation: sessions.observation, 
			}, 
		} 
	); 
 
	return okResponse('Observacion agregada'); 
}; 
 
const deleteCommitment = async (planId, psyId) => { 
	// Se busca si existe el psicologo 
	const psy = await Psychologist.findById(psyId); 
	if (!psy) { 
		return conflictResponse('No existe el psicólogo'); 
	} 
	// Se busca en mongo y borra la session agendada del plan 
	const updatedSessions = await Sessions.findOneAndUpdate( 
		{ 
			psychologist: psy._id, 
			'plan._id': planId, 
		}, 
		{ 
			$pull: { 
				plan: { _id: planId }, 
			}, 
		}, 
		{ new: true } 
	); 
 
	return okResponse('Sesion eliminada', updatedSessions); 
}; 
 
// Devuelve todas las sesiones, excepto las expiradas 
const getAllSessions = async psy => { 
	// Obtenemos solamente las sesiones que no han expirado, se filtran las sesiones 
	// que no sean compromisos, y se suman la cantidad de sesiones restantes 
	const sessions = await getAllSessionsFunction(psy); 
	const total = sessions 
		.filter(session => { 
			return ( 
				session.status === 'success' && 
				session.statusPlan === 'success' && 
				session.name !== 'Compromiso privado ' 
			); 
		}) 
		.reduce( 
			(sum, value) => 
				typeof value.total == 'number' ? sum + value.total : sum, 
			0 
		); 
	return okResponse('Sesiones obtenidas', { 
		total, 
		sessions, 
	}); 
}; 
 
const paymentsInfoFromId = async psy => { 
	// Se obtienen los pagos de las sesiones 
	const user = await Psychologist.findById(psy); 
	if (!user) return conflictResponse('No es psicologo'); 
	const payments = await paymentInfoFunction(psy); 
	return okResponse('Obtuvo todo sus pagos', { payments }); 
}; 
 
const sessionsService = { 
	getSessions, 
	getRemainingSessions, 
	cancelSession, 
	checkPlanTask, 
	createPlan, 
	createSession, 
	customNewSession, 
	getFormattedSessionsForMatch, 
	getFormattedSessions, 
	formattedSessionsAll, 
	paymentsInfo, 
	reschedule, 
	updateSessions, 
	deleteCommitment, 
	getAllSessions, 
	paymentsInfoFromId, 
}; 
 
export default Object.freeze(sessionsService); 
