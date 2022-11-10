'use strict';

import moment from 'moment';
import sendMails from './sendMails';
moment.tz.setDefault('America/Santiago');

let isReceiverSupport = false;

const mailService = {
	/**
	 * @description Sends an email to the user who has paid for the session.
	 * @param {Object} user - A User object from the database, corresponding to the user who has paid for the session.
	 * @param {Object} psy - A User object from the database, corresponding to the psychologist who has received the payment.
	 * @param {String} paid - A ID of the payment.
	 * @param {String} roomsUrl - A string that contains the URL of the room where the session will take place.
	 * @param {String} date - A string that contains the date of the session.
	 */
	async sendSuccessCustomSessionPaymentUser(user, psy, paid, roomsUrl, date) {
		const dataPayload = {
			from: 'Hablaquí <pagos@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `Has realizado el pago de la sesión`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-3eb4b9d7bc4048ffbc0ce31ab6d97e83',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				paid: paid,
				roomsUrl: roomsUrl,
				psy_name: psy.name + ' ' + psy.lastName,
				date: date,
			},
		};
		await sendMails(dataPayload, user, isReceiverSupport);
	},
	/**
	 * @description Sends an email to the psychologist who has received the payment.
	 * @param {Object} user - A User object from the database, corresponding to the user who has paid for the session.
	 * @param {Object} psy - A User object from the database, corresponding to the psychologist who has received the payment.
	 * @param {String} paid - A ID of the payment.
	 * @param {String} roomsUrl - A string that contains the URL of the room where the session will take place.
	 * @param {String} date - A string that contains the date of the session.
	 */

	async sendSuccessCustomSessionPaymentPsy(user, psy, paid, roomsUrl, date) {
		const dataPayload = {
			from: 'Hablaquí <pagos@mail.hablaqui.cl>',
			to: psy.name + '<' + psy.email + '>',
			subject: `${user.name} ha pagado la sesión`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-6ac128fe8f804757ad45c5dfab571e12',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name:
					user.name + ' ' + (user.lastName ? user.lastName : ''),
				paid: paid,
				roomsUrl: roomsUrl,
				psy_name: psy.name,
				date: date,
			},
		};
		await sendMails(dataPayload, psy, isReceiverSupport);
	},
	/**
	 * @description Sends an email to the psychologist who has updated the payment account.
	 * @param {Object} psychologist - A User object from the database, corresponding to the psychologist who has updated the payment account.
	 * @param {String} period - A string that contains the period of the payment account.
	 * @param {String} price - A string that contains the price of the payment account.
	 */
	async sendPsychologistPay(psychologist, period, price) {
		const dataPayload = {
			from: 'Hablaquí <pagos@mail.hablaqui.cl>',
			to: psychologist.name + '<' + psychologist.email + '>',
			subject: `Has actualizado tu cuenta, ${psychologist.name}`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-f5eb2f1bfaf14d888b3276f8010dacc4',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				psy_name: psychologist.name,
				period: period,
				price: price,
			},
		};
		await sendMails(dataPayload, psychologist, isReceiverSupport);
	},
};

export default Object.freeze(mailService);
