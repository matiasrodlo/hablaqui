import { Schema, model } from 'mongoose';

let evaluation = new Schema({
	approved: {
		type: Boolean,
		default: false,
	},
	comment: {
		type: String,
		default: '',
	},
	global: {
		type: Number,
	},
	puntuality: {
		type: Number,
	},
	attention: {
		type: Number,
	},
	internet: {
		type: Number,
	},
	like: {
		type: String,
		enum: [
			'Dedicación',
			'Explicaciones claras',
			'Eficacia del proceso',
			'Otro',
		],
	},
	improve: {
		type: String,
		enum: [
			'Falta de empatía',
			'Comunicación',
			'Retraso en la visita',
			'Otro',
		],
	},
});

let evaluations = new Schema({
	psychologist: {
		type: Schema.Types.ObjectId,
		ref: 'psychologist',
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	evaluations: [evaluation],
});

export default model('evaluation', evaluations);
