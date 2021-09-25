import emailscheduling from '../models/emailscheduling';
import User from '../models/user';
import psychologist from '../models/psychologist';
import mailService from '../services/mail';
import moment from 'moment-timezone';
import { conflictResponse, okResponse } from '../utils/responses/functions';

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
function generatePayload(date, mailId) {
	return {
		wasScheduled: true,
		scheduledAt: moment(date)
			.subtract(1, 'hour')
			.format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
		mailgunId: mailId,
	};
}

const cronService = {
	/**
	 * @description This function is used to schedule emails about an upcoming appoitment
	 * @param no params
	 * @returns {object} The response about the scheduling system
	 **/
	async scheduleEmails() {
		const pendingEmails = await emailscheduling.find({
			wasScheduled: false,
		});
		if (pendingEmails.length > 0) {
			pendingEmails.forEach(async emailInfo => {
				const sessionDate = moment.tz(
					emailInfo.sessionDate,
					'America/Santiago'
				);
				if (isSchedulableEmail(sessionDate)) {
					const user = await User.findById(emailInfo.userRef);
					const psy = await psychologist.findById(emailInfo.psyRef);
					try {
						let emailSent;
						if (emailInfo.type === 'reminder-user') {
							emailSent = await mailService.sendReminderUser(
								user,
								psy,
								sessionDate
							);
						} else if (emailInfo.type === 'reminder-psy') {
							emailSent = await mailService.sendReminderPsy(
								user,
								psy,
								sessionDate
							);
						}
						const updatePayload = generatePayload(
							sessionDate,
							emailSent.id
						);
						await emailscheduling.findByIdAndUpdate(
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
};

export default cronService;
