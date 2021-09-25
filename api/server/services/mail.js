import moment from 'moment';
import mailgun from 'mailgun-js';

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
			subject: 'Bienvenido/a a Hablaquí',
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
			subject: 'Bienvenido/a a Hablaquí',
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
	 * @description Send an appointmet reminder to a user about an upcomming session
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {Object} psy - A psychologist object from the database, corresponding to the psychologist attending the user
	 * @param {string} date - The date of the appointment
	 * @returns A promise with Mailgun's response
	 */
	async sendReminderUser(user, psy, date) {
		const { email, name } = user;
		const dataPayload = {
			from: 'Hablaquí <recordatorios@mail.hablaqui.com>',
			to: name + '<' + email + '>',
			replyto: 'Hablaquí <soporte-recordatorios@mail.hablaqui.com',
			subject: 'Queda una hora para tu sesión en Hablaquí',
			template: 'reminder-users',
			'o:deliverytime': moment(date)
				.subtract(1, 'hour')
				.format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
			'v:first_name': name,
			'v:psy_first_name': psy.name,
			'v:psy_last_name': psy.lastName,
			'v:day': moment(date)
				.locale('es-mx')
				.format('LL'),
			'v:hour': moment(date)
				.locale('es-mx')
				.format('LT'),
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
	 * @returns A promise with Mailgun's response
	 */
	async sendReminderPsy(user, psy, date) {
		const { email, name, lastName } = user;
		const dataPayload = {
			from: 'Hablaquí <recordatorios-psicologos@mail.hablaqui.com>',
			to: name + '<' + email + '>',
			replyto: 'Hablaquí <soporte-recordatorios@mail.hablaqui.com',
			subject: 'Queda una hora para tu sesión en Hablaquí',
			template: 'reminder-psy',
			'o:deliverytime': moment(date)
				.subtract(1, 'hour')
				.format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
			'v:user_first_name': name,
			'v:user_last_name': lastName,
			'v:psy_first_name': psy.name,
			'v:psy_last_name': psy.lastName,
			'v:day': moment(date)
				.locale('es-mx')
				.format('LL'),
			'v:hour': moment(date)
				.locale('es-mx')
				.format('LT'),
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
