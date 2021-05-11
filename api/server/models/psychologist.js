import { Schema, model } from 'mongoose';

let session = new Schema({
	date: {
		type: Date,
	},
	start: {
		type: String,
	},
	end: {
		type: String,
	},
	user: {
		type: String,
	},
	typeSession: {
		type: String,
	},
	typePayments: {
		type: String,
	},
	statePayments: {
		type: String,
	},
});

let psychologist = new Schema({
	avatar: {
		type: String,
	},
	code: {
		type: String,
	},
	email: {
		type: String,
	},
	name: {
		type: String,
	},
	gender: {
		type: String,
	},
	sessionType: {
		type: String,
	},
	language: {
		type: String,
	},
	experience: {
		type: String,
	},
	specialties: {
		type: Array,
	},
	formation: {
		type: String,
	},
	description: {
		type: String,
	},
	model: {
		type: Array,
	},
	sessions: [session],
});

//psychologist.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
export default model('psychologist', psychologist);
