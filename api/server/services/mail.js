'use strict';

import moment from 'moment';
import momentz from 'moment-timezone';

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mailService = {
	/**
	 * @description Send a welcome email to a new user using the mailgun API with the template 'welcome-new-user'
	 * @param {Object} user - A User object from the database, corresponding to a new client
	 */
	async sendWelcomeNewUser(user) {
		const { email, name } = user;
		const dataPayload = {
			from: 'Hablaquí <bienvenida@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: '¡Te damos la bienvenida a Hablaquí!',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-47d8674ebc0841b381cf68fa42c03b13',
			dynamicTemplateData: {
				first_name: name,
			},
			asm: {
				group_id: 16321,
			},
		};
		await sgMail.send(dataPayload, function(error, body) {
			if (error) {
				console.log(error);
			} else {
				console.log(body);
			}
		});
	},
	/**
	 * @description Send a welcome email to a new psychologist using the mailgun API with the template 'welcome-new-psy'
	 * @param {Object} user - A User object from the database, corresponding to the new psychologist
	 */
	async sendWelcomeNewPsychologist(user) {
		const { email, name } = user;
		const dataPayload = {
			from:
				'Hablaquí para Psicólogos <bienvenida-psicologos@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: '¡Te damos la bienvenida a Hablaquí!',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-6db5e38488fc42769fca7398be2930ae',
			dynamicTemplateData: {
				first_name: name,
			},
			asm: {
				group_id: 16321,
			},
		};
		await sgMail.send(dataPayload, function(error, body) {
			if (error) {
				console.log(error);
			} else {
				console.log(body);
			}
		});
	},
	/**
	 * @description Send a recovery password email to a user
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {String} url - URL to password recovery
	 */
	async sendPasswordRecovery(user, url) {
		const { email, name } = user;
		const dataPayload = {
			from: 'Hablaquí <recuperacion@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: 'Recupera tu contraseña de Hablaquí',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-f025d6b8c63a4567897817ecd8f31aee',
			dynamicTemplateData: {
				url: url,
			},
			asm: {
				group_id: 16321,
			},
		};
		await sgMail.send(dataPayload, function(error, body) {
			if (error) {
				console.log(error);
			} else {
				console.log(body);
			}
		});
	},
	/**
	 * @description Send a welcome email to a new  user created by a psychologist
	 * @param {Object} psy - A User object from the database, corresponding to the client
	 * @param {Object} newUser -  A User object from the database, corresponding to the psychologist
	 * @param {String} pass - Password to login
	 */
	async sendGuestNewUser(psy, newUser, pass) {
		const { name, email } = newUser;
		const dataPayload = {
			from: 'Hablaquí <invitaciones@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: '¡Te han invitado a Hablaquí!',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-84ac6d244f044322916649f448ebcecd',
			dynamicTemplateData: {
				name: name,
				email: email,
				password: pass,
				psy_first_name: psy.name,
				psy_last_name: psy.lastName,
			},
			asm: {
				group_id: 16321,
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
	 * @description Send an appointmet reminder to a user about an upcomming session
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {Object} psy - A psychologist object from the database, corresponding to the psychologist attending the user
	 * @param {string} date - The date of the appointment
	 */
	async sendReminderUser(user, psy, date, batch) {
		const { email, name } = user;
		const dataPayload = {
			from: 'Hablaquí <recordatorios@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: 'Tu sesión en Hablaquí está por comenzar',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-9a0771dd50e44569b8bb8d5bbce9a886',
			dynamicTemplateData: {
				first_name: name,
				psy_first_name: psy.name,
				psy_last_name: psy.lastName,
				date: moment(date).format('DD/MM/YYYY'),
				hour: momentz.tz(date, 'America/Santiago').format('HH:mm'),
			},
			asm: {
				group_id: 16321,
			},
			sendAt: moment(date)
				.subtract(1, 'hour')
				.unix(),
			batchId: batch,
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
	 * @description Send an appointmet reminder to a psychologist about an upcomming session
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {Object} psy - A psychologist object from the database, corresponding to the psychologist attending the user
	 * @param {string} date - The date of the appointment
	 */
	async sendReminderPsy(user, psy, date, batch) {
		const { email, name, lastName } = user;
		const dataPayload = {
			from: 'Hablaquí <recordatorios-psicologos@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: `Tu sesión con ${name} en Hablaquí está por comenzar`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-4ae158cf069a4f9abd6aae9784e1a255',
			dynamicTemplateData: {
				user_first_name: name,
				user_last_name: lastName,
				psy_first_name: psy.name,
				psy_last_name: psy.lastName,
				date: moment(date).format('DD/MM/YYYY'),
				hour: momentz.tz(date, 'America/Santiago').format('HH:mm'),
			},
			asm: {
				group_id: 16321,
			},
			sendAt: moment(date)
				.subtract(1, 'hour')
				.unix(),
			batchId: batch,
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
	 * @description Send an appointmet purchase confirmation to a user
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {string} date - The date of the appointment
	 */
	async sendAppConfirmationUser(user, date) {
		const { email, name } = user;
		const dataPayload = {
			from: 'Hablaquí <agendamientos@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: 'Tu sesión en Hablaquí ha sido agendada',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-4b0e727fd03144aa819e7814e39e8504',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				first_name: name,
				date: moment(date).format('DD/MM/YYYY'),
				hour: momentz.tz(date, 'America/Santiago').format('HH:mm'),
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
	 * @description Send an appointmet purchase confirmation to a user
	 * @param {Object} psy - A Psychologist object from the database, corresponding to the psychologist attending the user
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {string} date - The date of the appointment
	 */
	async sendAppConfirmationPsy(psy, user, date) {
		const nameUser = user.name;
		const lastNameUser = user.lastName;
		const { email, name } = psy;
		const dataPayload = {
			from: 'Hablaquí <agendamientos@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: `${nameUser} ${lastNameUser} ha agendado una sesión contigo en Hablaquí`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-d7fbf8c891a84343b8bcaab38cbc2bab',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_first_name: nameUser,
				user_last_name: lastNameUser,
				psy_first_name: name,
				date: moment(date).format('DD/MM/YYYY'),
				hour: momentz.tz(date, 'America/Santiago').format('HH:mm'),
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
	 * @description Send an email to a psychologist about his/her new application
	 * @param {Object} recruitedPsy - A psychologist object from the database, corresponding to recruited psychologist
	 */
	async sendRecruitmentConfirmation(recruitedPsy) {
		const { email, name } = recruitedPsy;
		const dataPayload = {
			from: 'Hablaquí <reclutamiento@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: '¡Gracias por postular a Hablaquí!',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-d40470d41a3842ac9108bcdb6ac70022',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				first_name: name,
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
	 * @description Send an internal email about a new psy application
	 * @param {Object} recruitedPsy - A psychologist object from the database, corresponding to recruited psychologist
	 */
	async sendRecruitmentConfirmationAdmin(recruitedPsy) {
		const { name, lastName, email } = recruitedPsy;
		const dataPayload = {
			from: 'Hablaquí <internal@mail.hablaqui.cl>',
			to: 'direccion@hablaqui.com',
			subject: '[Internal] ¡Hay una nueva postulación para Hablaquí!',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-8ee906349e144427ad0103a31507541a',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				psy_first_name: name,
				psy_last_name: lastName,
				psy_email: email,
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
	async sendCustomSessionPaymentURL(user, psychologist, paymentURL) {
		const dataPayload = {
			from: 'Hablaquí <pagos@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `${psychologist.name} ha agendado una sesión contigo en Hablaquí`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			template: 'd-b334d5a385c84a378b41d64395d96ae7',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				psy_name: psychologist.name,
				payment_url: paymentURL,
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
	async sendVerifyEmail(user, url) {
		const dataPayload = {
			from: 'Hablaquí <verificacion@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `Verificación de cuenta de Hablaquí`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			template: 'd-8e397d37317c403ea7bb53cbbadac30a',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				verify_url: url,
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

export default mailService;
