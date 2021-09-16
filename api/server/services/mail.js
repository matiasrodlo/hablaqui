import moment from 'moment';
import mailgun from 'mailgun-js';

const DOMAIN = 'mail.hablaqui.com';
const mg = mailgun({
	apiKey: process.env.MAILGUN_API_KEY,
	domain: DOMAIN,
});

const mailService = {
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
	async sendReminderUser(user, date) {
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
			'v:day': moment(date)
				.locale('es-mx')
				.format('LL'),
			'v:hour': moment(date)
				.locale('es-mx')
				.format('LT'),
		};

		// Create a promise to send an email
		const sendMail = new Promise((resolve, reject) => {
			mg.messages().send(dataPayload, function(error, body) {
				if (error) {
					reject(error);
				} else {
					resolve(body);
				}
			});
		});
		// Return the promise
		return sendMail;
	},
};

export default mailService;
