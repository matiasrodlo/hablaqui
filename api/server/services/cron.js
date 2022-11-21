'use-strict';
import email from '../models/email';
import Chat from '../models/chat';
import User from '../models/user';
import mercadopagoService from './mercadopago';
import Coupon from '../models/coupons';
import psychologist from '../models/psychologist';
import mailServiceRemider from '../utils/functions/mails/reminder';
import mailServicePsy from '../utils/functions/mails/psychologistStatus';
import dayjs from 'dayjs';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import Sessions from '../models/sessions';
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

function isSchedulableEmail(date) {
	/**
	 * @description Comprueba si el correo electrónico es programable (3 días o menos antes de la cita)
	 * @param {dayjs} date es la fecha de la cita
	 * @returns
	 */
	return dayjs()
		.add(3, 'days')
		.isAfter(date);
}

function generatePayload(date, batch) {
	/**
	 * @description Crea el payload para actualizar el objeto de programación de correo electrónico
	 * @param {dayjs} date Fecha en la que se programará el correo electrónico (1 hora antes de la cita)
	 * @param {string} mailId ID de Mailgun para identificar el correo electrónico internamente
	 * @returns un objeto con el payload
	 */
	return {
		wasScheduled: true,
		scheduledAt: dayjs(date)
			.subtract(1, 'hour')
			.format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
		batchId: batch,
	};
}

async function getNumberSuccess() {
	/**
	 * @description Actualiza la cantidad de sessiones exitosas de las sessiones.
	 */
	const users = await User.find();
	users.forEach(async user => {
		const sessions = await Sessions.find({ user: user._id }).populate(
			'psychologist',
			'name'
		);
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
			await Sessions.updateOne(
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

async function preference(user, psychologist, plan) {
	// Se genera un código aleatorio para el token de pago
	const randomCode = () => {
		return Math.random()
			.toString(36)
			.substring(2);
	};
	const token = randomCode() + randomCode();
	const price = plan.totalPrice;
	const idSession = plan.session.pop()._id;
	// Se crea el pago en mercadopago
	const mercadopagoPayload = {
		psychologist: psychologist.username,
		price: price,
		description:
			plan.title + ' - Pagado por ' + user.name + ' ' + user.lastName,
		quantity: 1,
		sessionsId: idSession.toString(),
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
	await Coupon.create(coupon);
	return coupon.code;
}

const cronService = {
	async statusInmediateAttention(token) {
		if (token !== authToken)
			return conflictResponse(
				'ERROR! You are not authorized to use this endpoint.'
			);
		const psychologists = await psychologist.find();

		// Se recorre el array de psicólogos si el estado de la atención inmediata
		// esta activo y la fecha de expiracion es antes de la fecha actual
		psychologists.forEach(async psy => {
			if (psy.inmediateAttention.activated) {
				const expiration = psy.inmediateAttention.expiration;
				if (dayjs(expiration).isBefore(dayjs(Date.now())))
					await psychologist.findOneAndUpdate(
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
	async scheduleEmails(token) {
		if (token !== authToken) {
			return conflictResponse(
				'ERROR! You are not authorized to use this endpoint.'
			);
		}
		// Busca los correos electrónicos que no han sido programados
		const pendingEmails = await email.find({
			wasScheduled: false,
		});
		if (pendingEmails.length > 0) {
			pendingEmails.forEach(async emailInfo => {
				const sessionDate = dayjs(emailInfo.sessionDate);
				if (isSchedulableEmail(sessionDate)) {
					const user = await User.findById(emailInfo.userRef);
					const psy = await psychologist.findById(emailInfo.psyRef);
					try {
						let batch = await getBatchId();
						// Se envía el correo electrónico al usuario o psicólogo para recordar la sesion
						if (emailInfo.type === 'reminder-user') {
							await mailServiceRemider.sendReminderUser(
								user,
								psy,
								sessionDate,
								batch
							);
						} else if (emailInfo.type === 'reminder-psy') {
							await mailServiceRemider.sendReminderPsy(
								user,
								psy,
								sessionDate,
								batch
							);
						}
						// Se genera el payload y se actualiza el email
						const updatePayload = generatePayload(
							sessionDate,
							batch
						);
						await email.findByIdAndUpdate(
							emailInfo._id,
							updatePayload,
							{ new: true }
						);
					} catch (error) {
						return conflictResponse(
							'Email sheduling service found an error'
						);
					}
				}
			});
		}
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
		const pendingSessions = await Sessions.find();

		await Promise.allSettled(
			pendingSessions.map(async item => {
				// const psyInfo = await psychologist.findOne(item.psychologist);
				await item.plan.map(async plan => {
					await plan.session.map(async session => {
						const date = dayjs(session.date, 'MM/DD/YYYY HH:mm');
						// if (
						// 	session.status === 'pending' &&
						// 	dayjs(date)
						// 		.subtract(
						// 			psyInfo.preferences
						// 				.minimumRescheduleSession,
						// 			'hours'
						// 		)
						// 		.isBefore(dayjs()) &&
						// 	dayjs().isBefore(date) &&
						// 	dayjs().isBefore(plan.expiration)
						// ) {
						// 	session.status = 'upnext';}
						if (
							session.status === 'pending' && // || session.status === 'upnext'
							dayjs().isAfter(date)
						) {
							session.status = 'success';
						}
						await Sessions.findOneAndUpdate(
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
		const sessions = await Sessions.find().populate('user psychologist');
		sessions.forEach(item => {
			// Filtro de sesiones que están en estado pending
			const plans = item.plan.filter(plan => plan.payment === 'pending');

			plans.forEach(async plan => {
				if (
					dayjs().isSameOrAfter(dayjs(plan.createdAt).add(3, 'hours'))
				) {
					// Se actualiza el estado el pago a cancelado
					await Sessions.findOneAndUpdate(
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
					await mailServicePsy.sendPaymentFailed(
						item.user,
						item.psychologist
					);
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
		// Se busca todas las sessiones y los correos no programados con los asuntos de pago
		const sessions = await Sessions.find().populate('user psychologist');
		const pendingEmails = await email.find({
			wasScheduled: false,
			type: {
				$in: [
					'reminder-payment-hour',
					'reminder-payment-day',
					'promocional-incentive',
				],
			},
		});

		sessions.forEach(async item => {
			let i;
			let isMailSent = false;
			// Filtro de sesiones que están en estado pending
			const plan = item.plan
				.filter(plan => plan.payment === 'pending')
				.pop();
			if (plan) {
				// Crea la preferencia de mercado pago para los correos de recorto de pago
				const url = await preference(
					item.user,
					item.psychologist,
					plan
				);
				// Obtiene el correo correspondiente a la sessión
				const emailSession = pendingEmails.filter(
					pendingMail =>
						pendingMail.sessionRef._id.toString() ===
						item._id.toString()
				);
				if (emailSession.length > 0) {
					if (
						dayjs().isBetween(
							dayjs(plan.createdAt).add(1, 'hour'),
							dayjs(plan.createdAt).add(1, 'day')
						) &&
						emailSession[0].wasScheduled === false
					) {
						i = 0;
						isMailSent = true;
						await mailServicePsy.pendingPlanPayment(
							item.user,
							item.psychologist,
							plan.totalPrice,
							url
						);
						console.log('chao');
					} else if (
						dayjs().isBetween(
							dayjs(plan.createdAt).add(1, 'day'),
							dayjs(plan.createdAt).add(1, 'week')
						) &&
						emailSession[1].wasScheduled === false
					) {
						i = 1;
						isMailSent = true;
						await mailServicePsy.pendingPlanPayment(
							item.user,
							item.psychologist,
							plan.totalPrice,
							url
						);
						console.log('chao');
					} else if (
						dayjs().isAfter(dayjs(plan.createdAt).add(1, 'week')) &&
						emailSession[emailSession.length - 1].wasScheduled ===
							false
					) {
						i = emailSession.length - 1;
						isMailSent = true;
						// Si ya pasó más de una semana, crea un cupón de descuento para
						// incentivar al usuario a pagar
						const code = await createCoupon();
						await mailServiceRemider.sendPromocionalIncentive(
							item.user,
							code
						);
						console.log('chao');
					}
					if (isMailSent) {
						const batch = getBatchId();
						await email.findByIdAndUpdate(emailSession[i]._id, {
							batchId: batch,
							wasScheduled: true,
						});
						console.log('hola');
					}
				}
			}
		});
		return okResponse('Correos enviados');
	},
};

export default cronService;
