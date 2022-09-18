'use strict';

import moment from 'moment';
import { logInfo } from '../../../config/pino';
moment.tz.setDefault('America/Santiago');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
			subject: 'Tu sesión en Hablaquí ha sido agendada',
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
		return new Promise((resolve, reject) => {
			sgMail.send(dataPayload, function(error, body) {
				if (error) {
					reject(error);
				} else {
					resolve(body);
				}
			});
		});
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
			subject: `${nameUser} ${lastNameUser} ha agendado una sesión contigo en Hablaquí`,
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
		return new Promise((resolve, reject) => {
			sgMail.send(dataPayload, function(error, body) {
				if (error) {
					reject(error);
				} else {
					resolve(body);
				}
			});
		});
	},
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
			subject: `${psychologist.name} ha agendado una sesión contigo en Hablaquí`,
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
				date: moment(date, 'MM/DD/YYYY HH:mm').format('DD/MM/YYYY'),
				hour: moment(date, 'MM/DD/YYYY HH:mm').format('HH:mm'),
			},
		};
		return new Promise((resolve, reject) => {
			sgMail.send(dataPayload, function(error, body) {
				if (error) {
					reject(error);
					logInfo(error);
				} else {
					resolve(body);
					logInfo(body);
				}
			});
		});
	},
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
			subject: `Has creado una sesión para ${user.name}`,
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
				date: moment(date, 'MM/DD/YYYY HH:mm').format('DD/MM/YYYY'),
				hour: moment(date, 'MM/DD/YYYY HH:mm').format('HH:mm'),
			},
		};
		return new Promise((resolve, reject) => {
			sgMail.send(dataPayload, function(error, body) {
				if (error) {
					reject(error);
					logInfo(error);
				} else {
					resolve(body);
					logInfo(body);
				}
			});
		});
	},
    
    async sendRescheduleToUser(user, psy, sessionDate) {
		const dataPayload = {
			from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `Has reprogramado con éxito tu sesión`,
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
		return new Promise((resolve, reject) => {
			sgMail.send(dataPayload, function(error, body) {
				if (error) {
					reject(error);
					logInfo(error);
				} else {
					resolve(body);
					logInfo(body);
				}
			});
		});
	},
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
		return new Promise((resolve, reject) => {
			sgMail.send(dataPayload, function(error, body) {
				if (error) {
					reject(error);
					logInfo(error);
				} else {
					resolve(body);
					logInfo(body);
				}
			});
		});
	},
	
	
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
		return new Promise((resolve, reject) => {
			sgMail.send(dataPayload, function(error, body) {
				if (error) {
					reject(error);
					logInfo(error);
				} else {
					resolve(body);
					logInfo(body);
				}
			});
		});
	},
	async sendRescheduleToUserByPsy(user, psy, sessionDate, url) {
		const dataPayload = {
			from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `Tu psicólogo ha reprogramado tu sesión`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-89913188fca9405da45caddede56fa54',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				date: sessionDate.date,
				hour: sessionDate.hour,
				psy_name: psy.name + ' ' + psy.lastName,
				url: url,
			},
		};
		return new Promise((resolve, reject) => {
			sgMail.send(dataPayload, function(error, body) {
				if (error) {
					reject(error);
					logInfo(error);
				} else {
					resolve(body);
					logInfo(body);
				}
			});
		});
	},
	async sendRescheduleToPsyByPsy(user, psy, sessionDate, url) {
		const dataPayload = {
			from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
			to: psy.name + '<' + psy.email + '>',
			subject: `Has reprogramado la sesión`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-e10aea204d194d78917297b7ec612506',
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
		return new Promise((resolve, reject) => {
			sgMail.send(dataPayload, function(error, body) {
				if (error) {
					reject(error);
					logInfo(error);
				} else {
					resolve(body);
					logInfo(body);
				}
			});
		});
	},
	async sendScheduleToPsy(user, psy, date, url, session) {
		const nameUser = user.name;
		const lastNameUser = user.lastName;
		const { name } = psy;
		const dataPayload = {
			from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
			to: psy.name + '<' + psy.email + '>',
			subject: `Has reprogramado la sesión`,
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
				date: moment(date).format('DD/MM/YYYY'),
				hour: moment(date).format('HH:mm'),
				session,
			},
		};
		return new Promise((resolve, reject) => {
			sgMail.send(dataPayload, function(error, body) {
				if (error) {
					reject(error);
					logInfo(error);
				} else {
					resolve(body);
					logInfo(body);
				}
			});
		});
	},
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
				date: moment(date).format('DD/MM/YYYY'),
				hour: moment(date).format('HH:mm'),
				session,
			},
		};
		return new Promise((resolve, reject) => {
			sgMail.send(dataPayload, function(error, body) {
				if (error) {
					reject(error);
				} else {
					resolve(body);
				}
			});
		});
	},
};

export default Object.freeze(mailService);
