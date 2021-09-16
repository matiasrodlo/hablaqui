import { Schema, model } from 'mongoose';

let emailScheduling = new Schema({
	emailId: {
		type: String,
		required: true,
	},
	mailgunId: {
		type: String,
	},
	scheduledTime: {
		type: Date,
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
		type: Date,
		default: Date.now,
	},
	scheduledAt: {
		type: Date,
		default: null,
	},
	userRef: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
});

export default model('emailScheduling', emailScheduling);
