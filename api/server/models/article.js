import { model, Schema } from 'mongoose';

let article = new Schema(
	{
		title: {
			type: String,
		},
		date: {
			type: Date,
		},
		rating: {
			type: String,
		},
		thumbnail: {
			type: String,
		},
		HTMLbody: {
			type: String,
		},
		notOriginal: {
			type: Boolean,
		},
		originalAuthor: {
			type: String,
		},
		originalLink: {
			type: String,
		},
		author: {
			type: String,
		},
	},
	{ timestamps: true }
);
export default model('article', article);
