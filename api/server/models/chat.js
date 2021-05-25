import { Schema, model } from 'mongoose';

let messageSchema = new Schema(
	{
		sentByUser: {
			type: Boolean,
		},
		message: {
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
	},
	{ timestamps: true }
);

export default model('chat', chatSchema);
