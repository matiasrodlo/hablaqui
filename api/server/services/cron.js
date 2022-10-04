'use-strict';
import email from '../models/email';
import Chat from '../models/chat';
import User from '../models/user';
import psychologist from '../models/psychologist';
import mailServiceRemider from '../utils/mails/reminder';
import mailServicePsy from '../utils/mails/psychologistStatus';
import moment from 'moment';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import Sessions from '../models/sessions';
import { logInfo } from '../config/pino';
moment.tz.setDefault('America/Santiago');

const authToken = 'MWYkx6jOiUcpx5w7UUhB';
const sgClient = require('@sendgrid/client'); // sendgrid es una api que permite enviar correos masivos
sgClient.setApiKey(process.env.SENDGRID_API_KEY);

function isSchedulableEmail(date) {
	/**
	 * @description Comprueba si el correo electrónico es programable (3 días o menos antes de la cita)
	 * @param {moment} date es la fecha de la cita
	 * @returns
	 */
	return moment()
		.add(3, 'days')
		.isAfter(date);
}

function generatePayload(date, batch) {
	/**
	 * @description Crea el payload para actualizar el objeto de programación de correo electrónico
	 * @param {moment} date Fecha en la que se programará el correo electrónico (1 hora antes de la cita)
	 * @param {string} mailId ID de Mailgun para identificar el correo electrónico internamente
	 * @returns un objeto con el payload
	 */
	return {
		wasScheduled: true,
		scheduledAt: moment(date)
			.subtract(1, 'hour')
			.format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
		batchId: batch,
	};
}

async function getNumberSuccess() {
	/**
	 * @description Se envia un correo electrónico para habilitar la evaluación del psicólogo
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

async function sendNotification(emails) {
	/**
	 * @description Envía un correo electrónico a los usuarios que no han sido notificados
	 * @param {array} emails array de correos electrónicos
	 */
	emails.forEach(async e => {
		if (moment().isAfter(moment(e.sessionDate).add(3, 'hours'))) {
			// Si la cita ya pasó 3 horas, entonces se obtiene el batchId, se obtiene el usuario, el psicologo, y el chat.
			const batch = await getBatchId();
			const user = await User.findById(e.userRef);
			const psy = await psychologist.findById(e.psyRef);
			const messages = await Chat.findOne({
				user: e.userRef,
				psychologist: e.psyRef,
			});

			// Se filtra el chat para obtener los mensajes que sean del correo electrónico
			const message = messages.messages.filter(
				m => m._id.toString() === e.sessionRef.toString()
			);

			// Si el correo electrónico no ha sido leído y no ha sido programado, entonces se envía el correo electrónico
			if (!message[0].read && !e.wasScheduled) {
				e.type === 'send-by-psy'
					? await mailServiceRemider.sendChatNotificationToUser(
							user,
							psy,
							batch
					  )
					: await mailServiceRemider.sendChatNotificationToPsy(
							user,
							psy,
							batch
					  );
			}

			// Se actualiza el objeto de programación de correo electrónico
			const updatePayload = {
				wasScheduled: true,
				scheduledAt: moment().format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
				batchId: batch,
			};
			await email.updateOne({ _id: e._id }, updatePayload);
		}
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
				if (moment(expiration).isBefore(moment(Date.now())))
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
		// Encuentra los correos enviados a los usuarios y psicologos, envia los correos
		const userMessage = await email.find({
			type: 'send-by-user',
			wasScheduled: false,
		});
		await sendNotification(userMessage);
		const psyMessage = await email.find({
			type: 'send-by-psy',
			wasScheduled: false,
		});
		await sendNotification(psyMessage);
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
				const sessionDate = moment(emailInfo.sessionDate);
				// Si es correo programado, busca el usuario y el psicologo.
				if (isSchedulableEmail(sessionDate)) {
					const user = await User.findById(emailInfo.userRef);
					const psy = await psychologist.findById(emailInfo.psyRef);
					try {
						let batch = await getBatchId();
						// Se envía el correo electrónico al usuario o psicólogo
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
		const pendingSessions = await Sessions.find();
		var toUpdateUpnext = [];
		var toUpdateSuccess = [];

		await Promise.allSettled(
			pendingSessions.map(async item => {
				const psyInfo = await psychologist.findOne(item.psychologist);
				await item.plan.map(async plan => {
					await plan.session.map(async session => {
						const date = moment(session.date, 'MM/DD/YYYY HH:mm');
						if (
							session.status === 'pending' &&
							moment(date)
								.subtract(
									psyInfo.preferences
										.minimumRescheduleSession,
									'hours'
								)
								.isBefore(moment()) &&
							moment().isBefore(date) &&
							moment().isBefore(plan.expiration)
						) {
							session.status = 'upnext';
							toUpdateUpnext.push({
								id: session._id.toString(),
								status: session.status,
							});
						} else if (
							(session.status === 'upnext' ||
								session.status === 'pending') &&
							moment().isAfter(date)
						) {
							session.status = 'success';
							toUpdateSuccess.push({
								id: session._id.toString(),
								status: session.status,
							});
						}
					});
				});
			})
		);

		if (toUpdateUpnext.length > 1) {
			try {
				await Promise.allSettled(
					toUpdateUpnext.forEach(async item => {
						await Sessions.findOneAndUpdate(
							{
								'plan.session._id': item.id,
							},
							{
								$set: {
									'plan.$[].session.$[element].status':
										item.status,
								},
							},
							{
								arrayFilters: [{ 'element._id': item.id }],
							}
						);
					})
				);
			} catch (error) {
				logInfo(error);
			}
		} else if (toUpdateUpnext.length === 1) {
			try {
				await Sessions.findOneAndUpdate(
					{
						'plan.session._id': toUpdateUpnext[0].id,
					},
					{
						$set: {
							'plan.$[].session.$[element].status':
								toUpdateUpnext[0].status,
						},
					},
					{
						arrayFilters: [{ 'element._id': toUpdateUpnext[0].id }],
					}
				);
			} catch (error) {
				logInfo(error);
			}
		}

		if (toUpdateSuccess.length > 1) {
			try {
				await Promise.allSettled(
					toUpdateSuccess.forEach(async item => {
						await Sessions.findOneAndUpdate(
							{
								'plan.session._id': item.id,
							},
							{
								$set: {
									'plan.$[].session.$[element].status':
										item.status,
								},
							},
							{
								arrayFilters: [{ 'element._id': item.id }],
							}
						);
					})
				);
			} catch (error) {
				logInfo(error);
			}
		} else if (toUpdateSuccess.length === 1) {
			try {
				await Sessions.findOneAndUpdate(
					{
						'plan.session._id': toUpdateSuccess[0].id,
					},
					{
						$set: {
							'plan.$[].session.$[element].status':
								toUpdateSuccess[0].status,
						},
					},
					{
						arrayFilters: [
							{ 'element._id': toUpdateSuccess[0].id },
						],
						new: true,
					}
				);
			} catch (error) {
				logInfo(error);
			}
		}
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
					moment().isSameOrAfter(
						moment(plan.createdAt).add(3, 'hours')
					)
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
};

export default cronService;
