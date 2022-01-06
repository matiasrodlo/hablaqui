'use strict';

import { Schema, model } from 'mongoose';

let transaction = new Schema({
	total: { type: Number },
	sessionsPaid: { type: Number },
	trasnactionDate: { type: String },
});

let transactions = new Schema({
	psychologist: {
		type: Schema.Types.ObjectId,
		ref: 'psychologist',
	},
	transactionsRequest: [transaction],
	transactionCompleted: [transaction],
});

export default model('transaction', transactions);
