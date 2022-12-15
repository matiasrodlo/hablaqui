import sgMail from '@sendgrid/mail';
import { logInfo } from '../../../config/pino';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

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
