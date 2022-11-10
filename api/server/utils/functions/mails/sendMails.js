import sgMail from '@sendgrid/mail';
import { logInfo } from '../../../config/pino';
import { namespaceTestMails } from '../../../config/dotenv';
import verifyEmailIncoming from './incomingMails';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * @description It is in charge of sending the mail
 * @param {Object} dataPayload - The data to send the mail
 */
const sendMails = async (dataPayload, user, isReceiverSupport) => {
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
		if (
			process.env.NODE_ENV === 'development' &&
			user.email.split('.')[0] === namespaceTestMails &&
			!isReceiverSupport
		) {
			verifyEmailIncoming(user);
		}
	});
};

export default sendMails;
