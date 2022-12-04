'use strict';

import sendMails from './sendMails';
import { issuerChange, replyChange } from './incomingMails';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

let isReceiverSupport = false;

const mailService = {
	/**
	 * @description Send an appointmet purchase confirmation to a user
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {string} date - The date of the appointment
	 */
	async sendAppConfirmationUser(user, psy, price) {
		const { email, name } = user;
		const dataPayload = {
			from: 'Hablaquí <agendamientos@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: 'Confirmación de subscripción',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-f57ecb113d6d48a684203ebb82782976',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				psy_name: psy.name + ' ' + (psy.lastName ? psy.lastName : ''),
				first_name: name,
				price: price,
			},
		};
		dataPayload.from = await issuerChange(dataPayload.from);
		dataPayload.reply_to = await replyChange(dataPayload.reply_to);
		await sendMails(dataPayload, user, isReceiverSupport);
	},
	/**
	 * @description Send an appointmet purchase confirmation to a psy
	 * @param {Object} psy - A Psychologist object from the database, corresponding to the psychologist attending the user
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {string} date - The date of the appointment
	 */
	async sendAppConfirmationPsy(psy, user, price) {
		const nameUser = user.name;
		const lastNameUser = user.lastName;
		const { email, name } = psy;
		const dataPayload = {
			from: 'Hablaquí <agendamientos@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: `Han contratado un nuevo plan con usted`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-2d162b2b082b4b21851d6e0be428e64f',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_first_name: nameUser,
				user_last_name: lastNameUser,
				psy_first_name: name,
				price: price,
			},
		};
		dataPayload.from = await issuerChange(dataPayload.from);
		dataPayload.reply_to = await replyChange(dataPayload.reply_to);
		await sendMails(dataPayload, psy, isReceiverSupport);
	},
	/**
	 * @description Sends an email to the user notifying them that a psychologist has scheduled a session with them.
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {Object} psychologist - A Psychologist object from the database, corresponding to the psychologist attending the user
	 * @param {String} paymentURL - The URL to the payment page
	 * @param {String} date - The date of the appointment
	 * @param {String} value - The value of the appointment
	 * @param {String} type - The type of appointment
	 */
	async sendCustomSessionToUser(
		user,
		psychologist,
		paymentURL,
		date,
		value,
		type
	) {
		const dataPayload = {
			from: 'Hablaquí <pagos@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `${psychologist.name} agendó una sesión usted en Hablaquí`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-2fc1f3015bb844caab2a725dd3167892',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				psy_name: psychologist.name,
				payment_url: paymentURL,
				value: value,
				type: type,
				date: dayjs(date, 'MM/DD/YYYY HH:mm').format('DD/MM/YYYY'),
				hour: dayjs(date, 'MM/DD/YYYY HH:mm').format('HH:mm'),
			},
		};
		dataPayload.from = await issuerChange(dataPayload.from);
		dataPayload.reply_to = await replyChange(dataPayload.reply_to);
		await sendMails(dataPayload, user, isReceiverSupport);
	},
	/**
	 * @description Sends an email to the psychologist notifying them that a user has scheduled a session with them.
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {Object} psychologist - A Psychologist object from the database, corresponding to the psychologist attending the user
	 * @param {String} paymentURL - The URL to the payment page
	 * @param {String} date - The date of the appointment
	 * @param {String} value - The value of the appointment
	 * @param {String} type - The type of appointment
	 */
	async sendCustomSessionToPsy(
		user,
		psychologist,
		paymentURL,
		date,
		value,
		type
	) {
		const dataPayload = {
			from: 'Hablaquí <pagos@mail.hablaqui.cl>',
			to: psychologist.name + '<' + psychologist.email + '>',
			subject: `Ha creado un agendamiento con ${user.name}`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-e935d9d8e9d8406581f909863491e41d',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				psy_name: psychologist.name,
				payment_url: paymentURL,
				value: value,
				type: type,
				date: dayjs(date, 'MM/DD/YYYY HH:mm').format('DD/MM/YYYY'),
				hour: dayjs(date, 'MM/DD/YYYY HH:mm').format('HH:mm'),
			},
		};
		dataPayload.from = await issuerChange(dataPayload.from);
		dataPayload.reply_to = await replyChange(dataPayload.reply_to);
		await sendMails(dataPayload, psychologist, isReceiverSupport);
	},
	/**
	 * @description Sends an email to the user notifying them that they have successfully rescheduled.
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {Object} psy - A Psychologist object from the database, corresponding to the psychologist attending the user
	 * @param {String} sessionDate - The date of the appointment
	 */
	async sendRescheduleToUser(user, psy, sessionDate) {
		const dataPayload = {
			from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `Su sesión ha sido reagendada exitosamente`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-54f94040924645be93ccdb21c243e6c2',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				date: sessionDate.date,
				hour: sessionDate.hour,
				psy_name: psy.name + ' ' + psy.lastName,
			},
		};
		dataPayload.from = await issuerChange(dataPayload.from);
		dataPayload.reply_to = await replyChange(dataPayload.reply_to);
		await sendMails(dataPayload, user, isReceiverSupport);
	},
	/**
	 * @description Sends an email to the psychologist notifying them that a user has rescheduled.
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {Object} psy - A Psychologist object from the database, corresponding to the psychologist attending the user
	 * @param {String} sessionDate - The date of the appointment
	 * @param {String} url - The URL to the payment page
	 */
	async sendRescheduleToPsy(user, psy, sessionDate, url) {
		const dataPayload = {
			from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
			to: psy.name + '<' + psy.email + '>',
			subject: `Un cliente a reprogramado una sesión contigo`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-b336c59aa9d74750b13414954f7daee0',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name:
					user.name + ' ' + (user.lastName ? user.lastName : ''),
				date: sessionDate.date,
				hour: sessionDate.hour,
				psy_name: psy.name,
				url: url,
			},
		};
		dataPayload.from = await issuerChange(dataPayload.from);
		dataPayload.reply_to = await replyChange(dataPayload.reply_to);
		await sendMails(dataPayload, psy, isReceiverSupport);
	},
	/**
	 * @description Sends an email to the user notifying them that they have requested a rescheduled session.
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {Object} psy - A Psychologist object from the database, corresponding to the psychologist attending the user
	 */
	async sendCancelSessionPsy(user, psy) {
		const dataPayload = {
			from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
			to: psy.name + '<' + psy.email + '>',
			subject: `Has pedido una reprogramación de una sesión`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-3e3f90ac1108463dbb2abbbef767625c',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name:
					user.name + ' ' + (user.lastName ? user.lastName : ''),
				psy_name: psy.name,
			},
		};
		dataPayload.from = await issuerChange(dataPayload.from);
		dataPayload.reply_to = await replyChange(dataPayload.reply_to);
		await sendMails(dataPayload, psy, isReceiverSupport);
	},
	/**
	 * @description Sends an email to the user notifying them that a user has scheduled a session.
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {Object} psy - A Psychologist object from the database, corresponding to the psychologist attending the user
	 * @param {String} date - The date of the appointment
	 * @param {String} url - The URL to the appointment page
	 * @param {String} session - The session number
	 */
	async sendScheduleToPsy(user, psy, date, url, session) {
		const nameUser = user.name;
		const lastNameUser = user.lastName;
		const { name } = psy;
		const dataPayload = {
			from: 'Hablaquí <agendamientos@mail.hablaqui.cl>',
			to: psy.name + '<' + psy.email + '>',
			subject: `Se ha agendado una sesión`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-36c740ffd8aa4b25915861806f0a5fb6',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_first_name: nameUser,
				user_last_name: lastNameUser,
				psy_first_name: name,
				url: url,
				date: dayjs(date).format('DD/MM/YYYY'),
				hour: dayjs(date).format('HH:mm'),
				session,
			},
		};
		dataPayload.from = await issuerChange(dataPayload.from);
		dataPayload.reply_to = await replyChange(dataPayload.reply_to);
		await sendMails(dataPayload, psy, isReceiverSupport);
	},
	/**
	 * @description Sends an email to the user notifying them that they have scheduled a session.
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {Object} psy - A Psychologist object from the database, corresponding to the psychologist attending the user
	 * @param {Object} date - The date of the appointment
	 * @param {String} url - The URL to the appointment page
	 * @param {String} session - The session number
	 */
	async sendScheduleToUser(user, psy, date, url, session) {
		const { email, name } = user;
		const dataPayload = {
			from: 'Hablaquí <agendamientos@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: 'Tu sesión en Hablaquí ha sido agendada',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-68a683ec58484a68afdc5f17932d8400',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				psy_name: psy.name + ' ' + (psy.lastName ? psy.lastName : ''),
				first_name: name,
				url: url,
				date: dayjs(date).format('DD/MM/YYYY'),
				hour: dayjs(date).format('HH:mm'),
				session,
			},
		};
		dataPayload.from = await issuerChange(dataPayload.from);
		dataPayload.reply_to = await replyChange(dataPayload.reply_to);
		await sendMails(dataPayload, user, isReceiverSupport);
	},
};

export default Object.freeze(mailService);
