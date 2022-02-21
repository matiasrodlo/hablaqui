'use-strict';
import email from '../models/email';
import Chat from '../models/chat';
import User from '../models/user';
import psychologist from '../models/psychologist';
import mailService from '../services/mail';
import moment from 'moment';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import Sessions from '../models/sessions';
import { logInfo } from '../config/pino';
moment.tz.setDefault('America/Santiago');

const authToken = 'MWYkx6jOiUcpx5w7UUhB';
const sgClient = require('@sendgrid/client');
sgClient.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * @description Checks wheter the email is schedulable (3 days or less before the appointment)
 * @param {moment} date Is the date of the appointment
 * @returns
 */

function isSchedulableEmail(date) {
	return moment()
		.add(3, 'days')
		.isAfter(date);
}

/**
 * @description Creates the payload to update the email scheduling object
 * @param {moment} date Date when the email will be scheduled (1 hour before the appointment)
 * @param {string} mailId Mailgun ID to identify the email internally
 * @returns an object with the payload
 */

function generatePayload(date, batch) {
	return {
		wasScheduled: true,
		scheduledAt: moment(date)
			.subtract(1, 'hour')
			.format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
		batchId: batch,
	};
}

async function sendNotification(emails) {
	emails.forEach(async e => {
		if (moment().isAfter(moment(e.sessionDate).add(3, 'hours'))) {
			const batch = await getBatchId();
			const user = await User.findById(e.userRef);
			const psy = await psychologist.findById(e.psyRef);
			const messages = await Chat.findOne({
				user: e.userRef,
				psychologist: e.psyRef,
			});
			const message = messages.messages.filter(
				m => m._id.toString() === e.sessionRef.toString()
			);
			if (
				!message[0].read &&
				!e.wasScheduled &&
				e.type === 'send-by-user'
			)
				await mailService.sendChatNotificationToPsy(user, psy, batch);
			else if (
				!message[0].read &&
				!e.wasScheduled &&
				e.type === 'send-by-psy'
			)
				await mailService.sendChatNotificationToUser(user, psy, batch);
			const updatePayload = {
				wasScheduled: true,
				scheduledAt: moment().format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
				batchId: batch,
			};
			await email.findByIdAndUpdate(e._id, updatePayload, {
				new: true,
			});
		}
	});
}

async function getBatchId() {
	const result = await sgClient
		.request({
			method: 'POST',
			url: '/v3/mail/batch',
		})
		.then(([response, body]) => {
			if (response.statusCode === 201) {
				return body;
			}
		});
	let { batch_id } = result;
	return batch_id;
}

const cronService = {
	async scheduleChatEmails(token) {
		if (token !== authToken)
			return conflictResponse(
				'ERROR! You are not authorized to use this endpoint.'
			);
		const userMessage = await email.find({
			type: 'send-by-user',
			wasScheduled: false,
		});
		await sendNotification(userMessage);
		const psyMessage = await email.find({
			type: 'send-by-psy',
			wasScheduled: false,
		});
		await sendNotification(psyMessage);
		return okResponse('Se han enviado los correos');
	},
	/**
	 * @description This function is used to schedule emails about an upcoming appoitment
	 * @returns {object} The response about the scheduling system
	 **/
	async scheduleEmails(token) {
		if (token !== authToken) {
			return conflictResponse(
				'ERROR! You are not authorized to use this endpoint.'
			);
		}
		const pendingEmails = await email.find({
			wasScheduled: false,
		});
		if (pendingEmails.length > 0) {
			pendingEmails.forEach(async emailInfo => {
				const sessionDate = moment(emailInfo.sessionDate);
				if (isSchedulableEmail(sessionDate)) {
					const user = await User.findById(emailInfo.userRef);
					const psy = await psychologist.findById(emailInfo.psyRef);
					try {
						let batch = await getBatchId();
						if (emailInfo.type === 'reminder-user') {
							await mailService.sendReminderUser(
								user,
								psy,
								emailInfo.sessionDate,
								batch
							);
						} else if (emailInfo.type === 'reminder-psy') {
							await mailService.sendReminderPsy(
								user,
								psy,
								emailInfo.sessionDate,
								batch
							);
						}
						const updatePayload = generatePayload(
							sessionDate,
							batch
						);
						await email.findByIdAndUpdate(
							emailInfo._id,
							updatePayload,
							{ new: true }
						);
					} catch (error) {
						return conflictResponse(
							'Email sheduling service found an error'
						);
					}
				}
			});
		}
		return okResponse(
			'Email scheduling service invoked and ' +
				pendingEmails.length +
				' email(s) scheduled'
		);
	},
	async sessionStatus(token) {
		if (token !== authToken) {
			return conflictResponse(
				'ERROR! You are not authorized to use this endpoint.'
			);
		}
		const pendingSessions = await Sessions.find();
		var toUpdateUpnext = [];
		var toUpdateSuccess = [];
		await Promise.allSettled(
			pendingSessions.map(async item => {
				const psyInfo = await psychologist.findOne(item.psychologist);
				await item.plan.map(async plan => {
					await plan.session.map(async session => {
						const date = moment(session.date, 'MM/DD/YYYY HH:mm');
						if (
							session.status === 'pending' &&
							moment(date)
								.subtract(
									psyInfo.preferences
										.minimumRescheduleSession,
									'hours'
								)
								.isBefore(moment()) &&
							moment().isBefore(date) &&
							moment().isBefore(plan.expiration)
						) {
							session.status = 'upnext';
							toUpdateUpnext.push({
								id: session._id.toString(),
								status: session.status,
							});
						} else if (
							(session.status === 'upnext' ||
								session.status === 'pending') &&
							moment().isAfter(date)
						) {
							session.status = 'success';
							toUpdateSuccess.push({
								id: session._id.toString(),
								status: session.status,
							});
						}
					});
				});
			})
		);

		if (toUpdateUpnext.length > 1) {
			try {
				await Promise.allSettled(
					toUpdateUpnext.forEach(async item => {
						await Sessions.findOneAndUpdate(
							{
								'plan.session._id': item.id,
							},
							{
								$set: {
									'plan.$[].session.$[element].status':
										item.status,
								},
							},
							{
								arrayFilters: [{ 'element._id': item.id }],
							}
						);
					})
				);
			} catch (error) {
				logInfo(error);
			}
		} else if (toUpdateUpnext.length === 1) {
			try {
				await Sessions.findOneAndUpdate(
					{
						'plan.session._id': toUpdateUpnext[0].id,
					},
					{
						$set: {
							'plan.$[].session.$[element].status':
								toUpdateUpnext[0].status,
						},
					},
					{
						arrayFilters: [{ 'element._id': toUpdateUpnext[0].id }],
					}
				);
			} catch (error) {
				logInfo(error);
			}
		}

		if (toUpdateSuccess.length > 1) {
			try {
				await Promise.allSettled(
					toUpdateSuccess.forEach(async item => {
						await Sessions.findOneAndUpdate(
							{
								'plan.session._id': item.id,
							},
							{
								$set: {
									'plan.$[].session.$[element].status':
										item.status,
								},
							},
							{
								arrayFilters: [{ 'element._id': item.id }],
							}
						);
					})
				);
			} catch (error) {
				logInfo(error);
			}
		} else if (toUpdateSuccess.length === 1) {
			try {
				await Sessions.findOneAndUpdate(
					{
						'plan.session._id': toUpdateSuccess[0].id,
					},
					{
						$set: {
							'plan.$[].session.$[element].status':
								toUpdateSuccess[0].status,
						},
					},
					{
						arrayFilters: [
							{ 'element._id': toUpdateSuccess[0].id },
						],
						new: true,
					}
				);
			} catch (error) {
				logInfo(error);
			}
		}
		return okResponse('Sesiones actualizadas');
	},
};

export default cronService;
