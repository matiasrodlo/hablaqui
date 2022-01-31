'use strict';

import moment from 'moment';
import momentz from 'moment-timezone';
import { room } from '../config/dotenv';
import { logInfo } from '../config/pino';

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
		await sgMail.send(dataPayload, function(error, body) {
			if (error) {
				console.log(error);
			} else {
				console.log(body);
			}
		});
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
		await sgMail.send(dataPayload, function(error, body) {
			if (error) {
				console.log(error);
			} else {
				console.log(body);
			}
		});
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
		await sgMail.send(dataPayload, function(error, body) {
			if (error) {
				console.log(error);
			} else {
				console.log(body);
			}
		});
	},
	/**
	 * @description Send a welcome email to a new  user created by a psychologist
	 * @param {Object} psy - A User object from the database, corresponding to the client
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
	 * @description Send an appointmet reminder to a user about an upcomming session
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {Object} psy - A psychologist object from the database, corresponding to the psychologist attending the user
	 * @param {string} date - The date of the appointment
	 */
	async sendReminderUser(user, psy, date, batch) {
		const { email, name } = user;
		const dataPayload = {
			from: 'Hablaquí <recordatorios@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: 'Tu sesión en Hablaquí está por comenzar',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-9a0771dd50e44569b8bb8d5bbce9a886',
			dynamicTemplateData: {
				first_name: name,
				psy_first_name: psy.name,
				psy_last_name: psy.lastName,
				date: moment(date).format('DD/MM/YYYY'),
				hour: momentz.tz(date, 'America/Santiago').format('HH:mm'),
			},
			asm: {
				group_id: 16321,
			},
			sendAt: moment(date)
				.subtract(1, 'hour')
				.unix(),
			batchId: batch,
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
	 * @description Send an appointmet reminder to a psychologist about an upcomming session
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {Object} psy - A psychologist object from the database, corresponding to the psychologist attending the user
	 * @param {string} date - The date of the appointment
	 */
	async sendReminderPsy(user, psy, date, batch) {
		const { email, name, lastName } = user;
		const dataPayload = {
			from: 'Hablaquí <recordatorios-psicologos@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: `Tu sesión con ${name} en Hablaquí está por comenzar`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-4ae158cf069a4f9abd6aae9784e1a255',
			dynamicTemplateData: {
				user_first_name: name,
				user_last_name: lastName,
				psy_first_name: psy.name,
				psy_last_name: psy.lastName,
				date: moment(date).format('DD/MM/YYYY'),
				hour: momentz.tz(date, 'America/Santiago').format('HH:mm'),
			},
			asm: {
				group_id: 16321,
			},
			sendAt: moment(date)
				.subtract(1, 'hour')
				.unix(),
			batchId: batch,
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
	 * @description Send an appointmet purchase confirmation to a user
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {string} date - The date of the appointment
	 */
	async sendAppConfirmationUser(user, psy, date, url) {
		const { email, name } = user;
		const dataPayload = {
			from: 'Hablaquí <agendamientos@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: 'Tu sesión en Hablaquí ha sido agendada',
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-68a683ec58484a68afdc5f17932d8400',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				psy_name: psy.name + ' ' + (psy.lastName ? psy.lastName : ''),
				first_name: name,
				url: url,
				date: moment(date).format('DD/MM/YYYY'),
				hour: momentz.tz(date, 'America/Santiago').format('HH:mm'),
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
	 * @description Send an appointmet purchase confirmation to a psy
	 * @param {Object} psy - A Psychologist object from the database, corresponding to the psychologist attending the user
	 * @param {Object} user - A User object from the database, corresponding to the client
	 * @param {string} date - The date of the appointment
	 */
	async sendAppConfirmationPsy(psy, user, date, url) {
		const nameUser = user.name;
		const lastNameUser = user.lastName;
		const { email, name } = psy;
		const dataPayload = {
			from: 'Hablaquí <agendamientos@mail.hablaqui.cl>',
			to: name + '<' + email + '>',
			subject: `${nameUser} ${lastNameUser} ha agendado una sesión contigo en Hablaquí`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-36c740ffd8aa4b25915861806f0a5fb6',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_first_name: nameUser,
				user_last_name: lastNameUser,
				psy_first_name: name,
				url: url,
				date: moment(date).format('DD/MM/YYYY'),
				hour: momentz.tz(date, 'America/Santiago').format('HH:mm'),
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
	async sendCustomSessionPaymentURL(user, psychologist, paymentURL) {
		const dataPayload = {
			from: 'Hablaquí <pagos@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `${psychologist.name} ha agendado una sesión contigo en Hablaquí`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-2fc1f3015bb844caab2a725dd3167892',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				psy_name: psychologist.name,
				payment_url: paymentURL,
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
	async sendRescheduleToUser(user, psy, sessionDate) {
		const dataPayload = {
			from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `Has reprogramado con éxito tu sesión`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-54f94040924645be93ccdb21c243e6c2',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				date: sessionDate.date,
				hour: sessionDate.hour,
				psy_name: psy.name + ' ' + psy.lastName,
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
	async sendRescheduleToPsy(user, psy, sessionDate) {
		const dataPayload = {
			from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
			to: psy.name + '<' + psy.email + '>',
			subject: `Un cliente a reprogramado una sesión contigo`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-b336c59aa9d74750b13414954f7daee0',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name:
					user.name + ' ' + (user.lastName ? user.lastName : ''),
				date: sessionDate.date,
				hour: sessionDate.hour,
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
	async sendCancelSessionPsy(user, psy) {
		const dataPayload = {
			from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
			to: psy.name + '<' + psy.email + '>',
			subject: `Has pedido una reprogramación de una sesión`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-3e3f90ac1108463dbb2abbbef767625c',
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
	async sendCancelSessionUser(user, psy) {
		const dataPayload = {
			from: 'Hablaquí <reprogramacion@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `Has pedido una reprogramación de una sesión`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-72d35079d0c2482da9be18b7e9a71958',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				psy_name: psy.name + ' ' + (psy.lastName ? psy.lastName : ''),
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
	async sendChatNotificationToPsy(user, psychologist, batch) {
		const dataPayload = {
			from: 'Hablaquí <notificaciones@mail.hablaqui.cl>',
			to: psychologist.name + '<' + psychologist.email + '>',
			subject: `${user.name} te está hablando`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-89f251396ff64c7b8c671a51748b13a9',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				psy_name: psychologist.name,
			},
			sendAt: moment().unix(),
			batchId: batch,
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
	async sendChatNotificationToUser(user, psychologist, batch) {
		const dataPayload = {
			from: 'Hablaquí <notificaciones@mail.hablaqui.cl>',
			to: user.name + '<' + user.email + '>',
			subject: `Tu psicólogo ${psychologist.name} te está hablando`,
			reply_to: 'Hablaquí <soporte@hablaqui.cl>',
			templateId: 'd-becad9021a1e4b34afbd466a84aea4e3',
			asm: {
				group_id: 16321,
			},
			dynamicTemplateData: {
				user_name: user.name,
				psy_name: psychologist.name,
			},
			sendAt: moment().unix(),
			batchId: batch,
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

export default mailService;
