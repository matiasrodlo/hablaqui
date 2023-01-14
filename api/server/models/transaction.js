'use strict';

import { Schema, model } from 'mongoose';

let transaction = new Schema(
	{
		specialist: {
			type: Schema.Types.ObjectId,
			ref: 'specialist',
		},
		total: { type: Number },
		sessions: { type: Array },
	},
	{ timestamps: true }
);

export default model('transaction', transaction);
