import sgMail from '@sendgrid/mail';
import { logInfo } from '../../../config/pino';
import { namespaceTestMails } from '../../../config/dotenv';
import { verifyIncomingMails } from './incomingMails';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * @description It is in charge of sending the mail
 * @param {Object} dataPayload - The data to send the mail
 */
const sendMails = async (dataPayload, user, isReceiverSupport) => {
	let sendMail = await new Promise((resolve, reject) => {
		sgMail.send(dataPayload, (error, body) => {
			if (error) {
				reject(error);
				logInfo(error);
			} else {
				resolve(body);
				logInfo(body);
			}
		});
	});
	if (
		process.env.NODE_ENV === 'development' &&
		user.email.split('.')[0] === namespaceTestMails &&
		!isReceiverSupport
	) {
		await verifyIncomingMails(user);
	}
	return sendMail;
};

export default sendMails;
