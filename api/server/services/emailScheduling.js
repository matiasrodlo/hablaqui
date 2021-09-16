import emailscheduling from '../models/emailscheduling';
import User from '../models/user';
import mailService from '../services/mail';
import { logInfo } from '../config/pino';
import moment from 'moment';

const emailSchedulingService = {
	async schedulePendingEmails() {
		const pendingEmails = await emailscheduling.find({
			wasScheduled: false,
		});
		if (pendingEmails.length > 0) {
			pendingEmails.forEach(async emailInfo => {
				const sessionDate = emailInfo.sessionDate;
				logInfo(`Scheduling email for ${sessionDate}`);
				if (moment(3, 'day').isBefore(sessionDate)) {
					logInfo('Found pending emails');
					if (emailInfo.type == 'reminder-user') {
						logInfo('Found pending email for a user');
						const user = await User.findById(emailInfo.userRef);
						try {
							const emailSent = await mailService.sendReminderUser(
								user,
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
						}
					}
				}
			});
		}
	},
};

export default emailSchedulingService;
