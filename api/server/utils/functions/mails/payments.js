'use strict';

import moment from 'moment';
import { logInfo } from '../../../config/pino';
moment.tz.setDefault('America/Santiago');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mailService = {
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
	},
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
	},
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
	},
};

export default Object.freeze(mailService);
