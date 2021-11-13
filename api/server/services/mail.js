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
			replyto: 'Hablaquí <soporte-bienvenida@mail.hablaqui.cl',
			subject: '¡Bienvenido/a a Hablaquí!',
			template: 'welcome-new-user',
			dynamicTemplateData: {
				first_name: name,
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
			replyto: 'Hablaquí <soporte-bienvenida@mail.hablaqui.cl',
			subject: '¡Bienvenido/a a Hablaquí!',
			template: 'welcome-new-psy',
			dynamicTemplateData: {
				first_name: name,
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
			replyto: 'Hablaquí <soporte-recuperacion@mail.hablaqui.cl',
			subject: 'Recuperación de contraseña de Hablaquí!',
			template: 'reset-password',
			dynamicTemplateData: {
				url: url,
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
			replyto: 'Hablaquí <soporte-invitaciones@mail.hablaqui.cl',
			subject:
				'¡Bienvenido/a! Fuiste invitado por tu psicólogo a Hablaquí',
			template: 'welcome-user-by-psy',
			dynamicTemplateData: {
				name: name,
				email: email,
				password: pass,
				psy_first_name: psy.name,
				psy_last_name: psy.lastName,
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
	async sendReminderUser(user, psy, date) {
		const { email, name } = user;
		const dataPayload = {
			from: 'Hablaquí <recordatorios@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			replyto: 'Hablaquí <soporte-recordatorios@mail.hablaqui.cl',
			subject: 'Tu sesión en Hablaquí está por comenzar',
			template: 'reminder-users',
			dynamicTemplateData: {
				first_name: name,
				psy_first_name: psy.name,
				psy_last_name: psy.lastName,
				date: moment(date).format('DD/MM/YYYY'),
				hour: momentz.tz(date, 'America/Santiago').format('HH:mm'),
			},
			sendAt: moment(date)
				.subtract(1, 'hour')
				.unix(),
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
	async sendReminderPsy(user, psy, date) {
		const { email, name, lastName } = user;
		const dataPayload = {
			from: 'Hablaquí <recordatorios-psicologos@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			replyto: 'Hablaquí <soporte-recordatorios@mail.hablaqui.cl',
			subject: `Tu sesión con ${name} en Hablaquí está por comenzar`,
			template: 'reminder-psy',
			dynamicTemplateData: {
				user_first_name: name,
				user_last_name: lastName,
				psy_first_name: psy.name,
				psy_last_name: psy.lastName,
				date: moment(date).format('DD/MM/YYYY'),
				hour: momentz.tz(date, 'America/Santiago').format('HH:mm'),
			},
			sendAt: moment(date)
				.subtract(1, 'hour')
				.unix(),
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
			replyto: 'Hablaquí <soporte-agendamiento@mail.hablaqui.cl',
			subject: 'Agendaste una sesión en Hablaquí',
			template: 'appointment-confirmation-user',
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
			replyto: 'Hablaquí <soporte-agendamiento@mail.hablaqui.cl',
			subject: 'Te han reservado una sesión en Hablaquí',
			template: 'appointment-confirmation-psy',
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
			replyto: 'Hablaquí <soporte-reclutamiento@mail.hablaqui.cl',
			subject: 'Recibimos tu postulación a Hablaquí',
			template: 'recruitment-confirmation',
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
		const { name, lastName } = recruitedPsy;
		const dataPayload = {
			from: 'Hablaquí <internal@mail.hablaqui.cl>',
			to: 'direccion@hablaqui.com',
			replyto: 'Hablaquí <noreply@mail.hablaqui.cl',
			subject: '[Internal] Hay una nueva postulación a Hablaquí',
			template: 'internal-recruitment-profile-received',
			dynamicTemplateData: {
				psy_first_name: name,
				psy_last_name: lastName,
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
			replyto: 'Hablaquí <soporte-pagos@mail.hablaqui.cl',
			subject: 'Completa el pago de tu sesión en Hablaquí',
			template: 'custom-session-payment-email',
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
};

export default mailService;
