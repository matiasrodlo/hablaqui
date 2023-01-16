import { Schema, model } from 'mongoose';

let evaluation = new Schema(
	{
		approved: {
			type: String,
			default: 'wait',
			enum: ['refuse', 'wait', 'approved'],
		},
		comment: {
			type: String,
			default: '',
		},
		global: {
			type: Number,
			default: 0,
		},
		puntuality: {
			type: Number,
			default: 0,
		},
		attention: {
			type: Number,
			default: 0,
		},
		internet: {
			type: Number,
			default: 0,
		},
		moderatingDate: {
			type: String,
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
	},
	{ timestamps: true }
);

let evaluations = new Schema({
	specialist: {
		type: Schema.Types.ObjectId,
		ref: 'specialist',
	},
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
