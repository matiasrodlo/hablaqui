'use strict';

import { Schema, model } from 'mongoose';

let transaction = new Schema({
	psychologist: {
		type: Schema.Types.ObjectId,
		ref: 'psychologist',
	},
	total: { type: Number },
	sessionsPaid: { type: Number },
	transactionDate: { type: String },
});

export default model('transaction', transaction);
