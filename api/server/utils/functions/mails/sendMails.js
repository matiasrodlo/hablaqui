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
}

export default sendMails;
