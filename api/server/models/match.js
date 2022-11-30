'use strict';

import { Schema, model } from 'mongoose';

let answersFlow = new Schema(
	{
		gender: {
			type: String,
			default: '',
		},
		themes: {
			type: Array,
			default: [],
		},
		schedule: {
			type: String,
			default: '',
		},
		model: {
			type: Array,
			default: [],
		},
		price: {
			type: Number,
			default: 0,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

export default model('answersflow', answersFlow);
