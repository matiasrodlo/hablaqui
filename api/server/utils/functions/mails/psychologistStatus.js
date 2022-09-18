'use strict';

import moment from 'moment';
import { logInfo } from '../../../config/pino';
moment.tz.setDefault('America/Santiago');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mailService = {
    /**
	 * @description Send an internal email about a new psy application
	 * @param {Object} recruitedPsy - A psychologist object from the database, corresponding to recruited psychologist
	 */
	async sendRecruitmentConfirmationAdmin(recruitedPsy) {
		const { name, lastName, email } = recruitedPsy;
		const dataPayload = {
			from: 'Hablaquí <internal@mail.hablaqui.cl>',
			to: 'direccion@hablaqui.com',
			subject: '[Internal] ¡Hay una nueva postulación para Hablaquí!',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-8ee906349e144427ad0103a31507541a',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				psy_first_name: name,
				psy_last_name: lastName,
				psy_email: email,
			},
		};
		return new Promise((resolve, reject) => {
			sgMail.send(dataPayload, function(error, body) {
				if (error) {
					reject(error);
				} else {
					resolve(body);
				}
			});
		});
	},
    /**
	 * @description Send an email to a psychologist about his/her new application
	 * @param {Object} recruitedPsy - A psychologist object from the database, corresponding to recruited psychologist
	 */
	async sendRecruitmentConfirmation(recruitedPsy) {
		const { email, name } = recruitedPsy;
		const dataPayload = {
			from: 'Hablaquí <reclutamiento@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: '¡Gracias por postular a Hablaquí!',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-d40470d41a3842ac9108bcdb6ac70022',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				first_name: name,
			},
		};
		return new Promise((resolve, reject) => {
			sgMail.send(dataPayload, function(error, body) {
				if (error) {
					reject(error);
				} else {
					resolve(body);
				}
			});
		});
	},
	async sendEnabledEvaluation(user, psy) {
		const dataPayload = {
			from: 'Hablaquí <evaluaciones@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `Puedes evaluar a tu psicólogo`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-39a4dae7572448e08a7f0b8e9cc4adbd',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name:
					user.name + ' ' + (user.lastName ? user.lastName : ''),
				psy_name: psy.name,
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
	async pendingPlanPayment(user, psy, amount, url) {
		const dataPayload = {
			from: 'Hablaquí <pagos@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `Tienes un plan por pagar`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-a9b7fe9d08254e9b91d1cddbe399292c',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				psy_name: psy.name + ' ' + (psy.lastName ? psy.lastName : ''),
				amount: amount,
				url,
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
	async sendPaymentFailed(user, psychologist) {
		const dataPayload = {
			from: 'Hablaquí <notificaciones@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `No has pagado tu plan`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-288e2344aa51452cb9fd71f5482b8c9f',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				psy_name: psychologist.name,
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
	async sendPaymentRequest(psy, total, date) {
		const dataPayload = {
			from: 'Hablaquí <retiros@mail.hablaqui.cl>',
			to: psy.name + '<' + psy.email + '>',
			subject: `¡Has realizado una solicitud de retiro!`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-1b7f3153b2e64beca579cf634bcd2b7c',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				psy_name: psy.name,
				total: total,
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
	async sendCompletePaymentRequest(psy, total, date) {
		const dataPayload = {
			from: 'Hablaquí <retiros@mail.hablaqui.cl>',
			to: psy.name + '<' + psy.email + '>',
			subject: `Tu solicitud de retiro ya ha sido completada!`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-478ea4a5f440447db1d7ec9dc0361b55',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				psy_name: psy.name,
				total: total,
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
	async sendAddEvaluation(user, psy) {
		const dataPayload = {
			from: 'Hablaquí <evaluaciones@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `¡Has completado una evaluación!`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-451461690169414ba91a86ee4c439c2a',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				psy_name: psy.name,
				user_name: user.name,
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
	async sendApproveEvaluationToUser(user, psy) {
		const dataPayload = {
			from: 'Hablaquí <evaluaciones@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `¡Se ha aprobado tu evaluación!`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-2be43052aefe4a51bd7800cdba7155a9',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				psy_name: psy.name,
				user_name: user.name,
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
	async sendApproveEvaluationToPsy(user, psy) {
		const dataPayload = {
			from: 'Hablaquí <evaluaciones@mail.hablaqui.cl>',
			to: psy.name + '<' + psy.email + '>',
			subject: `¡Se ha aprobado una evaluación tuya!`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-39a41d2dc58e4e35a5674cf03a2cb86e',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				psy_name: psy.name,
				user_name: user.name,
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
	async sendRefuseEvaluation(user, psy) {
		const dataPayload = {
			from: 'Hablaquí <evaluaciones@mail.hablaqui.cl>',
			to: psy.name + '<' + psy.email + '>',
			subject: `Se ha rechazado tu evaluación`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-c88421c7ff9e4165b883255b9a35a701',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				psy_name: psy.name,
				user_name: user.name,
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
