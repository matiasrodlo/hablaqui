'use strict';

import moment from 'moment';
import momentz from 'moment-timezone';
import mailgun from 'mailgun-js';
import { logInfo } from '../config/winston';

const DOMAIN = 'mail.hablaqui.com';

const mg = mailgun({
	apiKey: process.env.MAILGUN_API_KEY,
	domain: DOMAIN,
});

const mailService = {
	/**
	 * @description Send a welcome email to a new user using the mailgun API with the template 'welcome-new-user'
	 * @param {Object} user - A User object from the database, corresponding to a new client
	 */
	async sendWelcomeNewUser(user) {
		const { email, name } = user;
		const dataPayload = {
			from: 'Hablaquí <bienvenida@mail.hablaqui.com>',
			to: name + '<' + email + '>',
			replyto: 'Hablaquí <soporte-bienvenida@mail.hablaqui.com',
			subject: '¡Bienvenido/a a Hablaquí!',
			template: 'welcome-new-user',
			'v:first_name': name,
		};
		await mg.messages().send(dataPayload, function(error, body) {
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
				'Hablaquí para Psicólogos <bienvenida-psicologos@mail.hablaqui.com>',
			to: name + '<' + email + '>',
			replyto: 'Hablaquí <soporte-bienvenida@mail.hablaqui.com',
			subject: '¡Bienvenido/a a Hablaquí!',
			template: 'welcome-new-psy',
			'v:first_name': name,
		};
		await mg.messages().send(dataPayload, function(error, body) {
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
			from: 'Hablaquí <recuperacion@mail.hablaqui.com>',
			to: name + '<' + email + '>',
			replyto: 'Hablaquí <soporte-recuperacion@mail.hablaqui.com',
			subject: 'Recuperación de contraseña de Hablaquí!',
			template: 'reset-password',
			'v:url': url,
		};
		await mg.messages().send(dataPayload, function(error, body) {
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
			from: 'Hablaquí <invitaciones@mail.hablaqui.com>',
			to: name + '<' + email + '>',
			replyto: 'Hablaquí <soporte-invitaciones@mail.hablaqui.com',
			subject:
				'¡Bienvenido/a! Fuiste invitado por tu psicólogo a Hablaquí',
			template: 'welcome-user-by-psy',
			'v:name': name,
			'v:email': email,
			'v:password': pass,
			'v:psy_first_name': psy.name,
			'v:psy_last_name': psy.lastName,
		};
		return new Promise((resolve, reject) => {
			mg.messages().send(dataPayload, function(error, body) {
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
			from: 'Hablaquí <recordatorios@mail.hablaqui.com>',
			to: name + '<' + email + '>',
			replyto: 'Hablaquí <soporte-recordatorios@mail.hablaqui.com',
			subject: 'Tu sesión en Hablaquí está por comenzar',
			template: 'reminder-users',
			'o:deliverytime': moment(date)
				.subtract(1, 'hour')
				.format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
			'v:first_name': name,
			'v:psy_first_name': psy.name,
			'v:psy_last_name': psy.lastName,
			'v:date': moment(date).format('DD/MM/YYYY'),
			'v:hour': momentz.tz(date, 'America/Santiago').format('HH:mm'),
		};

		return new Promise((resolve, reject) => {
			mg.messages().send(dataPayload, function(error, body) {
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
			from: 'Hablaquí <recordatorios-psicologos@mail.hablaqui.com>',
			to: name + '<' + email + '>',
			replyto: 'Hablaquí <soporte-recordatorios@mail.hablaqui.com',
			subject: `Tu sesión con ${name} en Hablaquí está por comenzar`,
			template: 'reminder-psy',
			'o:deliverytime': moment(date)
				.subtract(1, 'hour')
				.format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
			'v:user_first_name': name,
			'v:user_last_name': lastName,
			'v:psy_first_name': psy.name,
			'v:psy_last_name': psy.lastName,
			'v:date': moment(date).format('DD/MM/YYYY'),
			'v:hour': momentz.tz(date, 'America/Santiago').format('HH:mm'),
		};
		return new Promise((resolve, reject) => {
			mg.messages().send(dataPayload, function(error, body) {
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
			from: 'Hablaquí <agendamientos@mail.hablaqui.com>',
			to: name + '<' + email + '>',
			replyto: 'Hablaquí <soporte-agendamiento@mail.hablaqui.com',
			subject: 'Agendaste una sesión en Hablaquí',
			template: 'appointment-confirmation-user',
			'v:first_name': name,
			'v:date': moment(date).format('DD/MM/YYYY'),
			'v:hour': momentz.tz(date, 'America/Santiago').format('HH:mm'),
		};
		return new Promise((resolve, reject) => {
			mg.messages().send(dataPayload, function(error, body) {
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
			from: 'Hablaquí <agendamientos@mail.hablaqui.com>',
			to: name + '<' + email + '>',
			replyto: 'Hablaquí <soporte-agendamiento@mail.hablaqui.com',
			subject: 'Te han reservado una sesión en Hablaquí',
			template: 'appointment-confirmation-psy',
			'v:user_first_name': nameUser,
			'v:user_last_name': lastNameUser,
			'v:psy_first_name': name,
			'v:date': moment(date).format('DD/MM/YYYY'),
			'v:hour': momentz.tz(date, 'America/Santiago').format('HH:mm'),
		};
		return new Promise((resolve, reject) => {
			mg.messages().send(dataPayload, function(error, body) {
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
			from: 'Hablaquí <reclutamiento@mail.hablaqui.com>',
			to: name + '<' + email + '>',
			replyto: 'Hablaquí <soporte-reclutamiento@mail.hablaqui.com',
			subject: 'Recibimos tu postulación a Hablaquí',
			template: 'recruitment-confirmation',
			'v:first_name': name,
		};
		return new Promise((resolve, reject) => {
			mg.messages().send(dataPayload, function(error, body) {
				if (error) {
					reject(error);
				} else {
					resolve(body);
				}
			});
		});
	},
	async sendRecruitmentConfirmationAdmin(recruitedPsy) {
		const { name, lastName } = recruitedPsy;
		const dataPayload = {
			from: 'Hablaquí <internal@mail.hablaqui.com>',
			to: 'direccion@hablaqui.com',
			replyto: 'Hablaquí <noreply@mail.hablaqui.com',
			subject: '[Internal] Hay una nueva postulación a Hablaquí',
			template: 'internal-recruitment-profile-received',
			'v:psy_first_name': name,
			'v:psy_last_name': lastName,
		};
		return new Promise((resolve, reject) => {
			mg.messages().send(dataPayload, function(error, body) {
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
