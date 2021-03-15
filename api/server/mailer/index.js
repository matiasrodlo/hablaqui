import nodemailer from 'nodemailer';
import { logError } from '../config/pino';

const transportConfig = {
	service: 'gmail',
	auth: {
		user: 'pruebanodemailersochamar@gmail.com',
		pass: 'prueba12345',
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
