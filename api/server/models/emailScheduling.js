import moment from 'moment';
import { Schema, model } from 'mongoose';

let emailscheduling = new Schema({
	mailgunId: {
		type: String,
		default: null,
	},
	sessionDate: {
		type: String,
		required: true,
	},
	wasScheduled: {
		type: Boolean,
		default: false,
	},
	type: {
		type: String,
		enum: ['reminder-user', 'reminder-psy'],
	},
	queuedAt: {
		type: String,
		default: moment()
			.locale('es-mx')
			.format('D MMMM YYYY, h:mm:ss a'),
	},
	scheduledAt: {
		type: String,
		default: null,
	},
	userRef: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	psyRef: {
		type: Schema.Types.ObjectId,
		ref: 'Pyschologist',
	},
	psySessionID: {
		type: Schema.Types.ObjectId,
		ref: 'sessions',
	},
});

export default model('emailscheduling', emailscheduling);
