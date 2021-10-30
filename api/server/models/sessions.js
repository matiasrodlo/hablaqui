import { Schema, model, SchemaTypeOptions } from 'mongoose';

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
	},
	{ timestamps: true }
);

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
});
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
	session: [session],
	roomsUrl: {
		type: String,
	},
});

export default model('session', sessionSchema);
