'use strict';

import sendMails from './sendMails';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

const mailService = {
	/**
	 * @description sends an email to the user notifying him/her that the psychologist is talking to him/her.
	 * @param {Object} user - A user object from the database, corresponding to the user that will be notified
	 * @param {Object} psychologist - A psychologist object from the database, corresponding to the psychologist that is talking to the user
	 * @param {String} batch - A batchID corresponding to the batch of the conversation
	 */
	async sendChatNotificationToUser(user, psychologist, batch) {
		const dataPayload = {
			from: 'Hablaquí <notificaciones@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `Tiene un nuevo mensaje no leído en Hablaquí de parte de ${psychologist.name}`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-becad9021a1e4b34afbd466a84aea4e3',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				psy_name: psychologist.name,
			},
			batchId: batch,
		};
		await sendMails(dataPayload);
	},
	/**
	 * @description sends an email to the psychologist notifying him/her that the user is talking to him/her.
	 * @param {Object} user - A user object from the database, corresponding to the psychologist that is talking to the psychologist
	 * @param {Object} psychologist - A psychologist object from the database, corresponding to the user that will be notified
	 * @param {String} batch - A batchID corresponding to the batch of the conversation
	 */
	async sendChatNotificationToPsy(user, psychologist, batch) {
		const dataPayload = {
			from: 'Hablaquí <notificaciones@mail.hablaqui.cl>',
			to: psychologist.name + '<' + psychologist.email + '>',
			subject: `${user.name} te está hablando`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-89f251396ff64c7b8c671a51748b13a9',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				psy_name: psychologist.name,
			},
			batchId: batch,
		};
		await sendMails(dataPayload);
	},
	/**
	 * @description Sends an email to the user reminding them that they have requested a rescheduled session with a psychologist.
	 * @param {Object} user - A user object from the database, corresponding to the user that will be notified
	 * @param {Object} psy - A psychologist object from the database, corresponding to the psychologist that the user has requested a rescheduled session with
	 */
	async sendCancelSessionUser(user, psy) {
		const dataPayload = {
			from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `Has pedido una reprogramación de una sesión`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-72d35079d0c2482da9be18b7e9a71958',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				psy_name: psy.name + ' ' + (psy.lastName ? psy.lastName : ''),
			},
		};
		await sendMails(dataPayload);
	},
	/**
	 * @description Sends an email to the psychologist reminding him that you have cancelled a private engagement.
	 * @param {Object} psy - A psychologist object from the database, corresponding to the psychologist that will be notified
	 */
	async sendCancelCommitment(psy) {
		const dataPayload = {
			from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
			to: psy.name + '<' + psy.email + '>',
			subject: `Has cancelado una compromiso privado`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-67d67af2cc2a4af08ddf5a11945f0b8b',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				psy_name: psy.name,
			},
		};
		await sendMails(dataPayload);
	},
	/**
	 * @description Sends an email to the psychologist reminding him/her that you have scheduled a private appointment.
	 * @param {Object} psychologist - A psychologist object from the database, corresponding to the psychologist that will be notified
	 */
	async sendCustomSessionCommitment(psychologist) {
		const dataPayload = {
			from: 'Hablaquí <pagos@mail.hablaqui.cl>',
			to: psychologist.name + '<' + psychologist.email + '>',
			subject: `Has agendado un compromiso privado`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-c012cf4a84014c31b12c422ac7e20faf',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				psy_name: psychologist.name,
			},
		};
		await sendMails(dataPayload);
	},
	/**
	 * @description Send an appointmet reminder to a user about an upcomming session
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {Object} psy - A psychologist object from the database, corresponding to the psychologist attending the user
	 * @param {string} date - The date of the appointment
	 */
	async sendReminderUser(user, psy, sessionDate, batch, mailType, urlRooms) {
		const { email, name } = user;
		const dataPayload = {
			from: 'Hablaquí <recordatorios@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject:
				'Su sesión con ${psy.name} ${psy.lastname} está por comenzar',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-3ab0f381fc2f4a579165cc6c36ed8586',
			dynamicTemplateData: {
				user_first_name: name,
				psy_first_name: psy.name,
				psy_last_name: psy.lastName,
				date: dayjs(sessionDate).format('DD/MM/YYYY'),
				hour: dayjs(sessionDate).format('HH:mm'),
				url_rooms: urlRooms,
			},
			asm: {
				group_id: 16321,
			},
			batchId: batch,
		};
		if (mailType === 'day') {
			dataPayload.subject = 'Mañana es su sesión en Hablaquí';
			dataPayload.templateId = 'd-cb455abcd59a4553a1fa3a16770dbdc6';
		}
		await sendMails(dataPayload);
	},
	/**
	 * @description Send an appointmet reminder to a psychologist about an upcomming session
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {Object} psy - A psychologist object from the database, corresponding to the psychologist attending the user
	 * @param {string} date - The date of the appointment
	 */
	async sendReminderPsy(user, psy, sessionDate, batch, mailType, urlRooms) {
		const { email, name, lastName } = psy;
		const dataPayload = {
			from: 'Hablaquí <recordatorios-psicologos@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: `Su sesión con ${user.name} en Hablaquí está por comenzar`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-3b8cc80917614591b078cf83d3ec3bc9',
			dynamicTemplateData: {
				user_first_name: user.name,
				user_last_name: user.lastName,
				psy_first_name: name,
				psy_last_name: lastName,
				date: dayjs(sessionDate).format('DD/MM/YYYY'),
				hour: dayjs(sessionDate).format('HH:mm'),
				url_rooms: urlRooms,
			},
			asm: {
				group_id: 16321,
			},
			batchId: batch,
		};
		if (mailType === 'day') {
			dataPayload.subject = `Mañana es tu sesión con ${user.name} en Hablaquí`;
			dataPayload.templateId = 'd-5438529516ae4dbab81793daaaba7f06';
		}
		await sendMails(dataPayload);
	},
};

export default Object.freeze(mailService);
