'use-strict';
import email from '../models/email';
import Chat from '../models/chat';
import userModel from '../models/user';
import mercadopagoService from './mercadopago';
import couponModel from '../models/coupons';
import psychologistModel from '../models/psychologist';
import mailServiceRemider from '../utils/functions/mails/reminder';
import mailServicePsy from '../utils/functions/mails/psychologistStatus';
import dayjs from 'dayjs';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import sessionsModel from '../models/sessions';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import sgClient from '@sendgrid/client'; // sendgrid es una api que permite enviar correos masivos
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.tz.setDefault('America/Santiago');
sgClient.setApiKey(process.env.SENDGRID_API_KEY);

const authToken = 'MWYkx6jOiUcpx5w7UUhB';

function generatePayload(date, batch, reminderType, isSend) {
	/**
	 * @description Crea el payload para actualizar el objeto de programación de correo electrónico
	 * @param {dayjs} date Fecha en la que se programará el correo electrónico (1 hora antes de la cita)
	 * @param {string} mailId ID de Mailgun para identificar el correo electrónico internamente
	 * @param {string} reminderType Tipo de recordatorio (1 hora antes, 1 día antes)
	 * @returns un objeto con el payload
	 */
	return {
		wasScheduled: isSend,
		scheduledAt: dayjs
			.tz(dayjs(date).subtract(1, reminderType))
			.format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
		batchId: batch,
	};
}

async function getNumberSuccess() {
	/**
	 * @description Actualiza la cantidad de sessiones exitosas de las sessiones.
	 */
	const users = await userModel.find();
	users.forEach(async user => {
		const sessions = await sessionsModel
			.find({ user: user._id })
			.populate('psychologist', 'name');
		sessions.forEach(async item => {
			let successSessions = 0;
			// Se filtran las citas que no hayan sido canceladas y se suman las sesiones exitosas
			const plans = item.plan.filter(plan => plan.payment === 'success');
			plans.forEach(plan => {
				successSessions += plan.session.filter(
					session => session.status === 'success'
				).length;
			});
			// Se actualiza el número de sesiones exitosas
			await sessionsModel.updateOne(
				{
					_id: item._id,
				},
				{
					$set: {
						numberSessionSuccess: successSessions,
						evaluationNotifcation:
							successSessions >= 3 ? true : false,
					},
				}
			);
			if (!item.evaluationNotifcation && successSessions === 3) {
				// Si el usuario tiene 3 citas exitosas, entonces se envía un correo electrónico para habilitar la evaluación del psicólogo
				await mailServicePsy.sendEnabledEvaluation(
					user,
					item.psychologist
				);
			}
		});
	});
}

async function getBatchId() {
	/**
	 * @description Se obtiene un batchId para el envío de correos electrónicos
	 * @returns {string} batchId
	 */
	const result = await sgClient
		.request({
			method: 'POST',
			url: '/v3/mail/batch',
		})
		.then(([response, body]) => {
			if (response.statusCode === 201) {
				return body;
			}
		});
	let { batch_id } = result;
	return batch_id;
}

async function preference(user, psychologist, plan, session) {
	// Se genera un código aleatorio para el token de pago
	const randomCode = () => {
		return Math.random()
			.toString(36)
			.substring(2);
	};
	const token = randomCode() + randomCode();
	const price = plan.totalPrice;
	// Se crea el pago en mercadopago
	const mercadopagoPayload = {
		psychologist: psychologist.username,
		price: price,
		description:
			plan.title + ' - Pagado por ' + user.name + ' ' + user.lastName,
		quantity: 1,
		sessionsId: session._id.toString(),
		planId: plan._id.toString(),
		token,
	};
	const responseBody = await mercadopagoService.createPreference(
		mercadopagoPayload
	);
	return responseBody.init_point;
}

async function createCoupon() {
	// Generar un número entero random
	const randomInt = (min = 100, max = 999) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	const code = 'H' + randomInt();
	const coupon = {
		code: code,
		discount: 20,
		discountType: 'percentage',
		restrictions: {
			firstTimeOnly: true,
		},
		expiration: dayjs()
			.add(1, 'week')
			.format(),
	};
	await couponModel.create(coupon);
	return coupon.code;
}

/**
 * @description La idea general de esta función es obtener los correos electrónicos que no han sido programados
 * darles una fecha, o en su defecto verificar su fecha de envío y enviarlos.
 * @param {Array} pendingEmails - Correos electrónicos pendientes de programación
 */

async function scheduleEmails(pendingEmails) {
	// Busca los correos electrónicos que no han sido programados
	if (!pendingEmails.length > 0) {
		return;
	}
	pendingEmails.forEach(async emailInfo => {
		// Se obtiene el tipo de correo y el destinatario (psy o user)
		let batch = null;
		const mailType = emailInfo.type.split('-').pop();
		const addressee = emailInfo.type.split('-')[1];
		const sessionDate = dayjs(emailInfo.sessionDate);
		let isSend = false;

		// Se verifica si en el correo de recordatorio de un día antes es parte del día
		// anterior para asegurar que se envíe el correo el día antes y no el día que corresponde
		// a la sessión con un máximo de 20 horas antes.
		if (
			!dayjs().isBefore(dayjs(sessionDate).subtract(20, 'hours')) &&
			mailType === 'day'
		) {
			return;
		}
		const user = await userModel.findById(emailInfo.userRef);
		const psy = await psychologistModel.findById(emailInfo.psyRef);
		if (!user || !psy) {
			return;
		}
		try {
			// Se envía el correo electrónico al usuario o psicólogo para recordar la sesion
			// Si es null significa que aún no se le ha dado una fecha de envío
			if (emailInfo.scheduledAt !== null) {
				// Si la fecha actual está después que la fecha programada, entonces se envía el correo
				if (
					addressee === 'user' &&
					dayjs().isAfter(dayjs(emailInfo.scheduledAt))
				) {
					batch = await getBatchId();
					// Este valor de verdad es para dejar en mongo que el correo ya fue enviado y no se vuelva a programar
					isSend = true;
					await mailServiceRemider.sendReminderUser(
						user,
						psy,
						sessionDate,
						batch,
						mailType
					);
				} else if (
					addressee === 'psy' &&
					dayjs().isAfter(dayjs(emailInfo.scheduledAt))
				) {
					batch = await getBatchId();
					isSend = true;
					await mailServiceRemider.sendReminderPsy(
						user,
						psy,
						sessionDate,
						batch,
						mailType
					);
				}
			}
			// Se genera el payload y se actualiza el email
			const updatePayload = generatePayload(
				sessionDate,
				batch,
				mailType,
				isSend
			);
			await email.findByIdAndUpdate(emailInfo._id, updatePayload, {
				new: true,
			});
		} catch (error) {
			return conflictResponse('Email sheduling service found an error');
		}
	});
}

const cronService = {
	async statusInmediateAttention(token) {
		if (token !== authToken)
			return conflictResponse(
				'ERROR! You are not authorized to use this endpoint.'
			);
		const psychologists = await psychologistModel.find();

		// Se recorre el array de psicólogos si el estado de la atención inmediata
		// esta activo y la fecha de expiracion es antes de la fecha actual
		psychologists.forEach(async psy => {
			if (psy.inmediateAttention.activated) {
				const expiration = psy.inmediateAttention.expiration;
				if (dayjs(expiration).isBefore(dayjs(Date.now())))
					await psychologistModel.findOneAndUpdate(
						{ _id: psy._id },
						{
							$set: {
								inmediateAttention: {
									activated: false,
									expiration: '',
								},
							},
						}
					);
			}
		});
		return okResponse('Estados cambiados');
	},
	async scheduleChatEmails(token) {
		if (token !== authToken)
			return conflictResponse(
				'ERROR! You are not authorized to use this endpoint.'
			);
		const dontReadMess = await Chat.find({ isLastRead: false }).populate(
			'user psychologist'
		);

		dontReadMess.forEach(async mess => {
			const user = mess.user;
			const psy = mess.psychologist;
			const batch = await getBatchId();
			if (mess.lastMessageSendBy === 'user')
				await mailServiceRemider.sendChatNotificationToPsy(
					user,
					psy,
					batch
				);
			else if (mess.lastMessageSendBy === 'psychologist')
				await mailServiceRemider.sendChatNotificationToUser(
					user,
					psy,
					batch
				);
		});
		await Chat.updateMany(
			{ isLastRead: false },
			{
				isLastRead: true,
			}
		);
		return okResponse('Se han enviado los correos');
	},
	async emailSchedule(token) {
		if (token !== authToken) {
			return conflictResponse(
				'ERROR! You are not authorized to use this endpoint.'
			);
		}
		// Encuentra los correos que no han sido programados aún, los obtiene por el asunto.
		let pendingEmails = await email.find({
			wasScheduled: false,
			type: {
				$in: [
					'reminder-user-hour',
					'reminder-psy-hour',
					'reminder-user-day',
					'reminder-psy-day',
				],
			},
		});

		// Se recorre el array de correos y se envían los correos
		await scheduleEmails(pendingEmails);
		return okResponse(
			'Email scheduling service invoked and ' +
				pendingEmails.length +
				' email(s) scheduled'
		);
	},
	async sessionStatus(token) {
		if (token !== authToken) {
			return conflictResponse(
				'ERROR! You are not authorized to use this endpoint.'
			);
		}

		// Obtiene todas las sessiones y comienza a recorrerlas, luego se recorre entre los planes, y finalmente
		// se recorre las sessiones, para poder cambiar de estado a las sessiones pendientes que estén dentro
		// de las preferencias minimas del psicologo se le cambia el estado a "upnext" como sessión próxima a realizarse.
		// También verifica si la session ya se realizó, y si es así, cambia el estado a "success".
		const pendingSessions = await sessionsModel.find();

		await Promise.allSettled(
			pendingSessions.map(async item => {
				// const psyInfo = await psychologist.findOne(item.psychologist);
				await item.plan.map(async plan => {
					await plan.session.map(async session => {
						const date = dayjs(session.date, 'MM/DD/YYYY HH:mm')
							.add(4, 'hour')
							.format();
						// if (
						// 	session.status === 'pending' &&
						// 	dayjs(date)
						// 		.subtract(
						// 			psyInfo.preferences
						// 				.minimumRescheduleSession,
						// 			'hours'
						// 		)
						// 		.isBefore(dayjs()) &&
						// 	dayjs().isBefore(dayjs(date)) &&
						// 	dayjs().isBefore(dayjs(plan.expiration))
						// ) {
						// 	session.status = 'upnext';}
						if (
							session.status === 'pending' && // || session.status === 'upnext'
							dayjs().isAfter(date)
						) {
							session.status = 'success';
						}
						await sessionsModel.findOneAndUpdate(
							{
								'plan.session._id': session._id,
							},
							{
								$set: {
									'plan.$[].session.$[element].status':
										session.status,
								},
							},
							{
								arrayFilters: [{ 'element._id': session._id }],
							}
						);
					});
				});
			})
		);
		await getNumberSuccess();
		return okResponse('Sesiones actualizadas');
	},
	async limitToPayPlan(token) {
		if (token !== authToken) {
			return conflictResponse(
				'ERROR! You are not authorized to use this endpoint.'
			);
		}
		const sessions = await sessionsModel
			.find()
			.populate('user psychologist');
		sessions.forEach(item => {
			// Filtro de sesiones que están en estado pending
			const plans = item.plan.filter(plan => plan.payment === 'pending');

			plans.forEach(async plan => {
				if (
					dayjs().isSameOrAfter(dayjs(plan.createdAt).add(3, 'hours'))
				) {
					// Se actualiza el estado el pago a cancelado
					await sessionsModel.findOneAndUpdate(
						{
							_id: item._id,
							'plan._id': plan._id,
						},
						{
							$set: {
								'plan.$.payment': 'failed',
								'plan.$.remainingSessions': 0,
								'plan.$.session': [],
							},
						}
					);
					// Se actualiza el estado de la sesión a cancelada
					// await mailServiceRemider.sendPaymentFailed(
					// 	item.user,
					// 	item.psychologist
					// );
				}
			});
		});
		return okResponse('Planes actualizados');
	},
	async reminderPayment(token) {
		if (token !== authToken) {
			return conflictResponse(
				'ERROR! You are not authorized to use this endpoint.'
			);
		}
		// Se busca todos los correos no programados con los asuntos de pago
		const pendingEmails = await email.find({
			wasScheduled: false,
			type: {
				$in: [
					'reminder-payment-hour',
					'reminder-payment-day',
					'promocional-incentive-week',
				],
			},
		});

		if (!pendingEmails.length > 0) {
			return okResponse('No hay correos pendientes');
		}

		pendingEmails.forEach(async emailInfo => {
			// Se obtiene el tipo de correo y el destinatario (psy o user)
			let isSend = false;
			let batch = null;
			const user = await userModel.findById(emailInfo.userRef);
			const psy = await psychologistModel.findById(emailInfo.psyRef);
			const sessionDocument = await sessionsModel.findById(
				emailInfo.sessionRef
			);
			const mailType = emailInfo.type.split('-').pop();

			// Se verifica que el usuario se haya encontrado al igual que el psicólogo y la sesión
			if (!user) {
				return conflictResponse('No se encontró el usuario');
			}
			if (!psy) {
				return conflictResponse('No se encontró el psicólogo');
			}
			if (!sessionDocument) {
				return conflictResponse('No se encontró la sesión');
			}
			// Se obtiene el plan pendiente
			const plan = sessionDocument.plan
				.filter(plan => plan.payment === 'pending')
				.pop();
			if (!plan) {
				return conflictResponse('No se encontró el plan');
			}
			// Se obtiene la url de pago
			// Crea la preferencia de mercado pago para los correos de recordatorio de pago
			const url = await preference(user, psy, plan, sessionDocument);
			try {
				// Se envía el correo electrónico al usuario o psicólogo para recordar la sesion
				// Si es null significa que aún no se le ha dado una fecha de envío
				if (emailInfo.scheduledAt !== null) {
					// Si la fecha actual está después que la fecha programada, entonces se envía el correo
					if (
						dayjs().isAfter(dayjs(emailInfo.scheduledAt)) &&
						emailInfo.type === 'reminder-payment-hour'
					) {
						batch = await getBatchId();
						// Este valor de verdad es para dejar en mongo que el correo ya fue enviado y no se vuelva a programar
						isSend = true;
						await mailServicePsy.pendingPlanPayment(
							user,
							psy,
							plan.totalPrice,
							url
						);
					} else if (
						dayjs().isAfter(dayjs(emailInfo.scheduledAt)) &&
						emailInfo.type === 'reminder-payment-day'
					) {
						batch = await getBatchId();
						isSend = true;
						await mailServiceRemider.sendPaymentDay(
							user,
							psy,
							plan.totalPrice,
							url
						);
					} else if (
						dayjs().isAfter(dayjs(emailInfo.scheduledAt)) &&
						emailInfo.type === 'promocional-incentive-week'
					) {
						batch = await getBatchId();
						isSend = true;
						// Si ya pasó más de una semana, crea un cupón de descuento para
						// incentivar al usuario a pagar
						const code = await createCoupon();
						await mailServiceRemider.sendPromocionalIncentive(
							user,
							code
						);
					}
				}
				// Se genera el payload y se actualiza el email
				const updatePayload = {
					wasScheduled: isSend,
					scheduledAt: dayjs
						.tz(dayjs(plan.createdAt).add(1, mailType))
						.format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
					batchId: batch,
				};
				await email.findByIdAndUpdate(emailInfo._id, updatePayload, {
					new: true,
				});
			} catch (error) {
				return conflictResponse(
					'Email sheduling service found an error'
				);
			}
		});

		return okResponse('Correos enviados');
	},
};

export default cronService;
