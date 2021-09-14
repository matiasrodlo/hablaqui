const mailgun = require('mailgun-js');
const DOMAIN = 'mail.hablaqui.com';
const mg = mailgun({
	apiKey: process.env.MAILGUN_API_KEY,
	domain: DOMAIN,
});

const mailService = {
	async sendWelcomeNewUser(user) {
		const { email, name } = user;
		const dataPayload = {
			from: 'Hablaquí <hola@mail.hablaqui.com>',
			to: name + '<' + email + '>',
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
			from: 'Hablaquí <hola@mail.hablaqui.com>',
			to: name + '<' + email + '>',
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
};

export default mailService;
