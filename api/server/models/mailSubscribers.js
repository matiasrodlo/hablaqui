'use strict';

import { Schema, model } from 'mongoose';

let subscriber = new Schema(
	{
		email: { type: String },
		preferences: {
			type: Array,
			default: ['blog'],
		},
	},
	{ timestamps: true }
);

export default model('emailSubscriber', subscriber);
