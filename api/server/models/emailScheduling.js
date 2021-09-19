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
		default: moment(),
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
});

export default model('emailscheduling', emailscheduling);
