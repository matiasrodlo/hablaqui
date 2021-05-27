import { Schema, model } from 'mongoose';

let messageSchema = new Schema(
	{
		sentByUser: {
			type: Boolean,
		},
		messageType: {
			type: String,
			enum: ['text', 'file'],
			default: 'text',
		},
		fileType: {
			type: String,
		},
		fileUrl: {
			type: String,
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
			type: String,
		},
		psychologist: {
			type: String,
		},
		messages: [messageSchema],
		reports: [reportSchema],
	},
	{ timestamps: true }
);

export default model('chat', chatSchema);
