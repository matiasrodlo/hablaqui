'use strict';

import moment from 'moment';
import sendMails from './sendMails';
moment.tz.setDefault('America/Santiago');

const mailService = {
	/**
	 * @description Send a welcome email to a new user using the mailgun API with the template 'welcome-new-user'
	 * @param {Object} user - A User object from the database, corresponding to a new client
	 */
	async sendWelcomeNewUser(user) {
		const { email, name } = user;
		const dataPayload = {
			from: 'Hablaquí <bienvenida@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: '¡Te damos la bienvenida a Hablaquí!',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-47d8674ebc0841b381cf68fa42c03b13',
			dynamicTemplateData: {
				first_name: name,
			},
			asm: {
				group_id: 16321,
			},
		};
		await sendMails(dataPayload);
	},
	/**
	 * @description Send a welcome email to a new psychologist using the mailgun API with the template 'welcome-new-psy'
	 * @param {Object} user - A User object from the database, corresponding to the new psychologist
	 */
	async sendWelcomeNewPsychologist(user) {
		const { email, name } = user;
		const dataPayload = {
			from:
				'Hablaquí para Psicólogos <bienvenida-psicologos@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: '¡Te damos la bienvenida a Hablaquí!',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-6db5e38488fc42769fca7398be2930ae',
			dynamicTemplateData: {
				first_name: name,
			},
			asm: {
				group_id: 16321,
			},
		};
		await sendMails(dataPayload);
	},
	/**
	 * @description Send a welcome email to a new  user created by a psychologist
	 * @param {Object} psy - A User object from the database, corresponding to the psychologist
	 * @param {Object} newUser -  A User object from the database, corresponding to the psychologist
	 * @param {String} pass - Password to login
	 */
	async sendGuestNewUser(psy, newUser, pass) {
		const { name, email } = newUser;
		const dataPayload = {
			from: 'Hablaquí <invitaciones@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: '¡Te han invitado a Hablaquí!',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-84ac6d244f044322916649f448ebcecd',
			dynamicTemplateData: {
				name: name,
				email: email,
				password: pass,
				psy_first_name: psy.name,
				psy_last_name: psy.lastName,
			},
			asm: {
				group_id: 16321,
			},
		};
		await sendMails(dataPayload);
	},
	/**
	 * @description Send a recovery password email to a user
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {String} url - URL to password recovery
	 */
	async sendPasswordRecovery(user, url) {
		const { email, name } = user;
		const dataPayload = {
			from: 'Hablaquí <recuperacion@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: 'Recupera tu contraseña de Hablaquí',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-f025d6b8c63a4567897817ecd8f31aee',
			dynamicTemplateData: {
				url: url,
			},
			asm: {
				group_id: 16321,
			},
		};
		await sendMails(dataPayload);
	},
	/**
	 * @description Send a verification email to a new user created
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {String} url - URL to verify account
	 */
	async sendVerifyEmail(user, url) {
		const dataPayload = {
			from: 'Hablaquí <verificacion@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `Verificación de cuenta de Hablaquí`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-8e397d37317c403ea7bb53cbbadac30a',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				verify_url: url,
			},
		};
		await sendMails(dataPayload);
	},
	/**
	 * @description Send an email to support to notify that a psychologist has uploaded a photo.
	 * @param {Object} psy - A User object from the database, corresponding to the psychologist
	 */
	async sendUploadPicture(psy) {
		const dataPayload = {
			from: 'Hablaquí <notifiaciones@mail.hablaqui.cl>',
			to: 'Hablaquí <soporte@hablaqui.cl>',
			subject: `Psicologo subió foto`,
			templateId: 'd-d0ad663db5c64f0f965d5aeab027a7aa',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				psy: psy.name + ' ' + psy.lastName,
				email: psy.email,
			},
		};
		await sendMails(dataPayload);
	},
	/**
	 * @description Sends an email to the user who has cancelled his plan
	 * @param {Object} user - A User object from the database, corresponding to the psychologist
	 * @param {Object} psy - A User object from the database, corresponding to the psychologist
	 * @param {String} coupon - Coupon code
	 */
	async sendChangePsycologistToUser(user, psy, coupon) {
		const dataPayload = {
			from: 'Hablaquí <pagos@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `Has cancelado tu plan`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-efbfc3aba77142fcaf1a24f693d71429',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name:
					user.name + ' ' + (user.lastName ? user.lastName : ''),
				psy_name: psy.name,
				code: coupon.code,
				amount: coupon.discount,
				expiration_date: moment(coupon.expiration).format('DD/MM/YYYY'),
			},
		};
		await sendMails(dataPayload);
	},
};

export default Object.freeze(mailService);
