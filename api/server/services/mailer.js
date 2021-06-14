import '../config/dotenv.js';
import sender from '../mailer/index';
import { frontend_url, no_reply_email } from '../config/dotenv';
import { logInfo } from '../config/winston';
const from = no_reply_email;

const mailerService = {
	createPasswordRecoveryHtml(token, url) {
		const recoveryUrl = url + '/passwordReset?token=' + token;
		return `
<p>Usted ha enviado una solicitud de cambio de contraseña. Presione aqui para recuperar contraseña.</p>
<a href="${recoveryUrl}" target="_blank">Recuperar Contraseña</a>
`;
	},
	createPasswordRecoverMessage(email, html) {
		return {
			from: from,
			to: email,
			subject: 'Recuperación de contraseña',
			text: '',
			html: html,
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
	sendEmail(message) {
		logInfo('Email enviado');
		sender.sendMail(message);
	},
	sendPasswordRecover(email, token) {
		const html = this.createPasswordRecoveryHtml(token, frontend_url);
		const message = this.createPasswordRecoverMessage(email, html);
		sender.sendMail(message);
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
};

export default mailerService;
