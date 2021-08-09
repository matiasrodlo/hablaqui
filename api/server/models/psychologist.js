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
		type: Schema.Types.ObjectId,
		ref: 'User',
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
	plan: {
		type: String,
	},
	invitedByPsychologist: {
		type: Boolean,
	},
});

let defaultSchedule = {
	monday: ['09:00', '17:00'],
	tuesday: ['09:00', '17:00'],
	wednesday: ['09:00', '17:00'],
	thursday: ['09:00', '17:00'],
	friday: ['09:00', '17:00'],
	saturday: ['busy', 'busy'],
	sunday: ['busy', 'busy'],
};

let defaultPreferences = {
	marketplaceVisibility: true,
	minimumNewSession: 24,
	minimumRescheduleSession: 24,
	corporativeSessions: true,
};

let rating = new Schema(
	{
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		comment: {
			type: String,
		},
		stars: {
			type: Number,
		},
	},
	{ timestamps: true }
);

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
	username: {
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
	country: {
		type: String,
		default: 'Chile',
	},
	region: {
		type: String,
	},
	comuna: {
		type: String,
	},
	schedule: {
		type: Object,
		default: defaultSchedule,
	},
	preferences: {
		type: Object,
		default: defaultPreferences,
	},
	paymentMethod: {
		type: Object,
		required: false,
	},
	ratings: [rating],
	sessions: [session],
});

//psychologist.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
export default model('psychologist', psychologist);
