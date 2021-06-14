import nodemailer from 'nodemailer';
import { logError } from '../config/pino';
import { no_reply_email, no_reply_password } from '../config/dotenv';

const transportConfig = {
	service: 'gmail',
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
