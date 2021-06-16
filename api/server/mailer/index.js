import nodemailer from 'nodemailer';
import { logError } from '../config/pino';
import { no_reply_email, no_reply_password } from '../config/dotenv';

// Ojala cambiarlo de vuelta a gmail
const transportConfig = {
	name: 'hablaqui.com',
	host: 'mail.hablaqui.com',
	port: 465,
	secure: true,
	auth: {
		user: no_reply_email,
		pass: no_reply_password,
	},
};

const transporter = nodemailer.createTransport(transportConfig);

const verifyCallback = error => {
	if (error) {
		/*Aca lo ideal seria un sistema de logger que comunique esto, para atender este error altiro*/
		logError('nodemailer error:' + error);
	}
};

transporter.verify(verifyCallback());

export default transporter;
