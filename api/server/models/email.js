'use strict';

import { Schema, model } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

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
			.locale('es')
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
	url: {
		type: String,
	},
});

export default model('email', email);
