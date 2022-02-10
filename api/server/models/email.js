'use strict';

import dayjs from 'dayjs-with-plugins';
import { Schema, model } from 'mongoose';

let email = new Schema({
	batchId: {
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
	},
	queuedAt: {
		type: String,
		default: dayjs()
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
	sessionRef: {
		type: Schema.Types.ObjectId,
		ref: 'sessions',
	},
});

export default model('email', email);
