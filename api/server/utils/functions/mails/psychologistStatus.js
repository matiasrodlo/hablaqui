'use strict';

import moment from 'moment';
import { logInfo } from '../../../config/pino';
import sendMails from './sendMails';
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
		sendMails(dataPayload);
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
		sendMails(dataPayload);
	},
	/**
	 * @description Send an email to the user to evaluate the psychologist.
	 * @param {Object} user - A user object from the database, corresponding to the user that will evaluate the psychologist
	 * @param {Object} psy - A psychologist object from the database, corresponding to the psychologist that will be evaluated
	 */
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
		sendMails(dataPayload);
	},
	/**
	 * @description Send an email to the psychologist who must pay the plan.
	 * @param {Object} user - A user object from the database, corresponding to the psychologist who must pay the plan
	 * @param {Object} psy - A psychologist object from the database, corresponding to the psychologist who must pay the plan
	 * @param {String} amount - The amount of the plan
	 * @param {String} url - The url to pay the plan
	 */
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
		sendMails(dataPayload);
	},
	/**
	 * @description Send an email to the psychologist who has not paid the plan
	 * @param {Object} user - A user object from the database, corresponding to the psychologist who has not paid the plan
	 * @param {Object} psy - A psychologist object from the database, corresponding to the psychologist who has not paid the plan
	 */

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
		sendMails(dataPayload);
	},
	/**
	 * @description Send an email to the psychologist informing him/her that you have made a request for withdrawal from the platform.
	 * @param {Object} psy - A psychologist object from the database, corresponding to the psychologist who has made the withdrawal request
	 * @param {String} total - The total amount of the withdrawal request
	 * @param {String} date - The date of the withdrawal request
	 */
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
		sendMails(dataPayload);
	},
	/**
	 * @description Send an email to the psychologist informing him/her that the withdrawal request has been completed.
	 * @param {Object} psy - A psychologist object from the database, corresponding to the psychologist who has made the withdrawal request
	 * @param {String} total - The total amount of the withdrawal request
	 * @param {String} date - The date of the withdrawal request
	 */
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
		sendMails(dataPayload);
	},
	/**
	 * @description sends an email to the user who has completed an evaluation to a psychologist.
	 * @param {Object} user - A user object from the database, corresponding to the user who has completed an evaluation
	 * @param {Object} psy - - A psychologist object from the database, corresponding to the psychologist who has been evaluated
	 */
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
		sendMails(dataPayload);
	},
	/**
	 * @description sends an e-mail to the user who has passed an evaluation to a psychologist
	 * @param {Object} user - A user object from the database, corresponding to the user who has passed an evaluation
	 * @param {Object} psy - A psychologist object from the database, corresponding to the psychologist who has been evaluated
	 */
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
		sendMails(dataPayload);
	},
	/**
	 * @description sends an email to the psychologist informing him/her that a user has passed an evaluation
	 * @param {Object} user - A user object from the database, corresponding to the user who has passed an evaluation
	 * @param {Object} psy - A psychologist object from the database, corresponding to the psychologist who has been evaluated
	 */
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
		sendMails(dataPayload);
	},
	/**
	 * @description send an email to the psychologist who has refused an evaluation
	 * @param {Object} user - A user object of the database, corresponding to the user who has made the evaluation
	 * @param {Object} psy - A psychologist object from the database, corresponding to the psychologist who has been evaluated
	 */
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
		sendMails(dataPayload);
	},
};

export default Object.freeze(mailService);
