import '../config/dotenv.js';
import sender from '../mailer/index';
import { frontend_url, no_reply_email } from '../config/dotenv';
import { logInfo } from '../config/winston';
import ejs from 'ejs';
import path from 'path';

const from = no_reply_email;

const mailerService = {
	createPasswordRecoveryHtml(token, url) {
		return url + '/passwordReset?token=' + token;
	},
	async createPasswordRecoverMessage(email, recover_url) {
		let ejsTemplate = await ejs.renderFile(
			path.join(__dirname, '../templates/passwordRecover.ejs'),
			{ recover_url: recover_url }
		);
		return {
			from: from,
			to: email,
			subject: 'Recuperación de contraseña',
			text: '',
			html: ejsTemplate,
		};
	},
	createNewAccountMessage(email) {
		return {
			from: from,
			to: email,
			subject: 'Bienvenido a Hablaquí!',
			text: 'Cuenta creada con éxito, ya puedes usar nuestra app.',
			html: '<p>Cuenta creada con éxito, ya puedes usar nuestra app.</p>',
		};
	},
	createMailSubscriptionMessage(email) {
		const textMessage = `Hola, te has suscrito a nuestro blog!`;
		const htmlMessage = `<p>${textMessage}</p>`;
		return {
			from: from,
			to: email,
			subject: 'Gracias por suscribirte a nuestro correo',
			text: textMessage,
			html: htmlMessage,
		};
	},
	createPurchaseInformationMessage(email) {
		const textMessage = `Tu pago será procesado pronto, si después de 24 horas aun tienes problemas no dudes en contactarnos!`;
		const htmlMessage = `<p>${textMessage}</p>`;
		return {
			from: from,
			to: email,
			subject: 'Has realizado un pago en Hablaquí.cl',
			text: textMessage,
			html: htmlMessage,
		};
	},
	createPsyNewSession(email, session) {
		const { date, start, user } = session;
		const textMessage = 'Te han agendado una nueva sesion!';
		const htmlMessage = `<p>Te han agendado una sesion el dia ${date} a las ${start}.`;
		return {
			from: from,
			to: email,
			subject: 'Han agendado una sesion contigo',
			text: textMessage,
			html: htmlMessage,
		};
	},
	sendEmail(message) {
		logInfo('Email enviado');
		sender.sendMail(message);
	},
	async sendPasswordRecover(email, token) {
		const recover_url = this.createPasswordRecoveryHtml(
			token,
			frontend_url
		);
		const message = await this.createPasswordRecoverMessage(
			email,
			recover_url
		);
		this.sendEmail(message);
	},
	sendNewAccountMessage(email) {
		const message = this.createNewAccountMessage(email);
		this.sendEmail(message);
	},
	sendMailSubscriptionMessage(email) {
		const message = this.createMailSubscriptionMessage(email);
		this.sendEmail(message);
	},
	sendPurchaseInformation(email) {
		const message = this.createPurchaseInformationMessage(email);
		this.sendEmail(message);
	},
	sendPsyNewSession(email, session) {
		const message = this.createPsyNewSession(email, session);
		this.sendEmail(message);
	},
};

export default mailerService;
