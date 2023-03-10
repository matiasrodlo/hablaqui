'use strict';

import { Schema, model } from 'mongoose';

let answersSchema = new Schema(
	{
		gender: {
			type: Array,
			default: [],
		},
		themes: {
			type: Array,
			default: [],
		},
		schedule: {
			type: Array,
			default: [],
		},
		model: {
			type: Array,
			default: [],
		},
		price: {
			type: Array,
			default: [],
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

export default model('matchanswers', answersSchema);
