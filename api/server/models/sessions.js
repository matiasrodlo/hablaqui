import { Schema, model } from 'mongoose';

let session = new Schema({
	date: {
		type: String,
	},
	sessionNumber: {
		type: String,
	},
	paidToPsychologist: {
		type: Boolean,
		default: 'false',
	},
	// TODO: en un futuro se puede agregar sistema de mensajeria para confirmar sesion o cancelar
	status: {
		type: String,
		default: 'pending',
		enum: ['pending', 'confirmed', 'canceled', 'failed'],
	},
});

let plan = new Schema(
	{
		title: {
			type: String,
		},
		period: {
			type: String,
		},
		totalPrice: {
			type: Number,
		},
		sessionPrice: {
			type: Number,
		},
		payment: {
			type: String,
			default: 'pending',
			enum: ['pending', 'success', 'failed'],
		},
		expiration: {
			type: String,
		},
		invitedByPsychologist: {
			type: Boolean,
			default: false,
		},
		usedCoupon: {
			type: String,
		},
		totalSessions: {
			type: Number,
		},
		remainingSessions: {
			type: Number,
		},
		session: [session],
	},
	{ timestamps: true }
);
let sessionSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	psychologist: {
		type: Schema.Types.ObjectId,
		ref: 'psychologist',
	},
	plan: [plan],
	roomsUrl: {
		type: String,
	},
});

export default model('session', sessionSchema);
