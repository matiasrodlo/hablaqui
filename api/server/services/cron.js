import emailscheduling from '../models/emailscheduling';
import User from '../models/user';
import psychologist from '../models/psychologist';
import mailService from '../services/mail';
import { logInfo } from '../config/pino';
import moment from 'moment-timezone';
import { conflictResponse, okResponse } from '../utils/responses/functions';

const cronService = {
	async scheduleEmails() {
		const pendingEmails = await emailscheduling.find({
			wasScheduled: false,
		});
		logInfo('Email scheduling service invoked');
		if (pendingEmails.length > 0) {
			pendingEmails.forEach(async emailInfo => {
				const sessionDate = moment.tz(
					emailInfo.sessionDate,
					'America/Santiago'
				);
				if (
					moment()
						.add(3, 'days')
						.isAfter(sessionDate)
				) {
					if (emailInfo.type == 'reminder-user') {
						const user = await User.findById(emailInfo.userRef);
						const psy = await psychologist.findById(
							emailInfo.psyRef
						);
						try {
							const emailSent = await mailService.sendReminderUser(
								user,
								psy,
								sessionDate
							);
							const updatePayload = {
								wasScheduled: true,
								scheduledAt: moment(sessionDate)
									.subtract(1, 'hour')
									.format('ddd, DD MMM YYYY HH:mm:ss ZZ'),
								mailgunId: emailSent.id,
							};
							logInfo(emailSent);
							await emailscheduling.findByIdAndUpdate(
								emailInfo._id,
								updatePayload,
								{ new: true }
							);
						} catch (error) {
							logInfo(error);
							return conflictResponse(
								'Email sheduling service found an error'
							);
						}
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
