'use strict';
import email from '../../../models/email';
import userModel from '../../../models/user';
import mercadopagoService from '../../../services/mercadopago';
import couponModel from '../../../models/coupons';
import psychologistModel from '../../../models/psychologist';
import mailServiceRemider from './reminder';
import mailServicePsy from './psychologistStatus';
import dayjs from 'dayjs';
import { conflictResponse } from '../../responses/functions';
import sessionsModel from '../../../models/sessions';
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
		expiration: dayjs.tz(dayjs().add(1, 'week')).format(),
	};
	await couponModel.create(coupon);
	return coupon.code;
}

const sessionReminder = async () => {
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
		const urlRooms = emailInfo.url;
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
					console.log(sessionDate);
					await mailServiceRemider.sendReminderUser(
						user,
						psy,
						sessionDate,
						batch,
						mailType,
						urlRooms
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
						mailType,
						urlRooms
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
	return pendingEmails.length;
};

const reminderPayment = async () => {
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
		return;
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
		// Se obtiene el plan pendiente
		const plan = sessionDocument.plan
			.filter(plan => plan.payment === 'pending')
			.pop();

		// Se verifica que el usuario se haya encontrado al igual que el psicólogo y la sesión
		if (!user || !psy || !sessionDocument || !plan) {
			return;
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
			return conflictResponse('Email sheduling service found an error');
		}
	});

	return pendingEmails.length;
};

const reminderChat = async () => {
	// Se busca todos los correos no programados con los asuntos de pago
	const pendingEmails = await email.find({
		wasScheduled: false,
		type: {
			$in: ['chat-psy-1-day', 'chat-user-1-day'],
		},
	});

	if (!pendingEmails.length > 0) {
		return;
	}

	// Se recorren los correos pendientes
	pendingEmails.forEach(async emailInfo => {
		// Se obtiene el tipo de correo y el destinatario (psy o user)
		let isSend = false;
		let batch = null;
		const user = await userModel.findById(emailInfo.userRef);
		const psy = await psychologistModel.findById(emailInfo.psyRef);
		// Se verifica que el usuario se haya encontrado al igual que el psicólogo
		if (!user) {
			return conflictResponse('No se encontró el usuario');
		}
		if (!psy) {
			return conflictResponse('No se encontró el psicólogo');
		}
		try {
			if (
				dayjs().isAfter(dayjs(emailInfo.scheduledAt)) &&
				emailInfo.type === 'chat-user-1-day'
			) {
				batch = await getBatchId();
				// Este valor de verdad es para dejar en mongo que el correo ya fue enviado y no se vuelva a programar
				isSend = true;
				await mailServiceRemider.sendChatNotificationToUser(
					user,
					psy,
					batch
				);
			} else if (
				dayjs().isAfter(dayjs(emailInfo.scheduledAt)) &&
				emailInfo.type === 'chat-psy-1-day'
			) {
				batch = await getBatchId();
				isSend = true;
				await mailServiceRemider.sendChatNotificationToPsy(
					user,
					psy,
					batch
				);
			}
			// Se genera el payload y se actualiza el email
			const updatePayload = {
				wasScheduled: isSend,
				batchId: batch,
			};
			await email.findByIdAndUpdate(emailInfo._id, updatePayload, {
				new: true,
			});
		} catch (error) {
			return conflictResponse('Email sheduling service found an error');
		}
	});
	return pendingEmails.length;
};

const reminderRenewal = async () => {
	// Se busca todos los correos no programados con los asuntos de pago
	const pendingEmails = await email.find({
		wasScheduled: false,
		type: {
			$in: [
				'reminder-renewal-subscription-1-hour',
				'reminder-renewal-subscription-1-day',
				'reminder-renewal-subscription-1-week',
			],
		},
	});

	if (!pendingEmails.length > 0) {
		return;
	}

	// Se recorren los correos pendientes
	pendingEmails.forEach(async emailInfo => {
		// Se busca el usuario y el psy
		const user = await userModel.findById(emailInfo.userRef);
		const psy = await psychologistModel.findById(emailInfo.psyRef);
		const sessionDocument = await sessionsModel.findById(
			emailInfo.sessionRef
		);
		const mailType = emailInfo.type.split('-').pop();
		let batch = null;
		let isSend = false;
		if (!user || !psy || !sessionDocument) {
			return;
		}
		// Se obtiene un plan expirado del usuario
		const plan = sessionDocument.plan.filter(plan =>
			dayjs().isAfter(dayjs(plan.expiration))
		)[0];
		if (!plan) {
			return;
		}
		try {
			// Se envía el correo electrónico al usuario o psicólogo para recordar la sesion
			// Si es null significa que aún no se le ha dado una fecha de envío
			if (emailInfo.scheduledAt !== null) {
				// Si la fecha actual está después que la fecha programada, entonces se envía el correo
				if (
					dayjs().isAfter(dayjs(emailInfo.scheduledAt)) &&
					emailInfo.type === 'reminder-renewal-subscription-1-hour'
				) {
					batch = await getBatchId();
					// Este valor de verdad es para dejar en mongo que el correo ya fue enviado y no se vuelva a programar
					isSend = true;
					await mailServiceRemider.reminderRenewalSubscription1hour(
						user,
						psy,
						plan.expiration
					);
				} else if (
					dayjs().isAfter(dayjs(emailInfo.scheduledAt)) &&
					emailInfo.type === 'reminder-renewal-subscription-1-day'
				) {
					batch = await getBatchId();
					isSend = true;
					await mailServiceRemider.reminderRenewalSubscription1day(
						user,
						psy,
						plan.expiration
					);
				} else if (
					dayjs().isAfter(dayjs(emailInfo.scheduledAt)) &&
					emailInfo.type === 'reminder-renewal-subscription-1-week'
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
					.tz(dayjs(plan.expiration).add(1, mailType))
					.format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
				batchId: batch,
			};
			await email.findByIdAndUpdate(emailInfo._id, updatePayload, {
				new: true,
			});
		} catch (error) {
			return conflictResponse('Email sheduling service found an error');
		}
	});
	return pendingEmails.length;
};

const mailingService = {
	sessionReminder,
	reminderPayment,
	reminderChat,
	reminderRenewal,
	getBatchId,
};

export default Object.freeze(mailingService);
