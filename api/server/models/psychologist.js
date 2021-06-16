import { Schema, model } from 'mongoose';

let session = new Schema({
	date: {
		type: String,
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
	lastName: {
		type: String,
	},
	gender: {
		type: String,
	},
	sessionType: {
		type: String,
	},
	languages: {
		type: Array,
	},
	experience: {
		type: Array,
	},
	specialties: {
		type: Array,
	},
	formation: {
		type: Array,
	},
	personalDescription: {
		type: String,
	},
	professionalDescription: {
		type: String,
	},
	models: {
		type: Array,
	},
	sessions: [session],
});

//psychologist.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
export default model('psychologist', psychologist);
