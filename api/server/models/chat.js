import { Schema, model } from 'mongoose';

let messageSchema = new Schema(
	{
		sentBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		message: {
			type: String,
		},
	},
	{ timestamps: true }
);

let reportSchema = new Schema(
	{
		reportedBy: {
			type: String,
		},
		reportType: {
			type: String,
			enum: ['inappropiate', 'no-answer', 'too-late', 'other'],
		},
		issue: {
			type: String,
		},
	},
	{ timestamps: true }
);

let chatSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		psychologist: {
			type: Schema.Types.ObjectId,
			ref: 'psychologist',
		},
		messages: [messageSchema],
		reports: [reportSchema],
	},
	{ timestamps: true }
);

export default model('chat', chatSchema);
