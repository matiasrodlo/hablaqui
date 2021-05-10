import uniqueValidator from 'mongoose-unique-validator';
import { Schema, model } from 'mongoose';

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
});

psychologist.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
export default model('psychologist', psychologist);
