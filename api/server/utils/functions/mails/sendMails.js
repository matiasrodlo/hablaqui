<<<<<<< HEAD
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

=======
//Falta importar sgMail
>>>>>>> c4b10682cb922cad249f617d56e53b6bab4c5dcf
/**
 * @description It is in charge of sending the mail
 * @param {Object} dataPayload - The data to send the mail
 */
const sendMails = async dataPayload => {
	return new Promise((resolve, reject) => {
		sgMail.send(dataPayload, function(error, body) {
			if (error) {
				reject(error);
			} else {
				resolve(body);
			}
		});
	});
};

export default sendMails;
