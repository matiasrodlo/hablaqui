import sgMail from '@sendgrid/mail';
import { logInfo } from '../../../config/pino';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * @description It is in charge of sending the mail
 * @param {Object} dataPayload - The data to send the mail
 */
const sendMails = async dataPayload => {
	return new Promise((resolve, reject) => {
		sgMail.send(dataPayload, function(error, body) {
			if (error) {
				reject(error);
				logInfo(error);
			} else {
				resolve(body);
				logInfo(body);
			}
		});
	});
};

export default sendMails;
