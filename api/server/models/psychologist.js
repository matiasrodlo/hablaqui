'use strict';

import { Schema, model } from 'mongoose';

let defaultSchedule = {
	monday: [['09:00', '18:00']],
	tuesday: [['09:00', '18:00']],
	wednesday: [['09:00', '18:00']],
	thursday: [['09:00', '18:00']],
	friday: [['09:00', '18:00']],
	saturday: 'busy',
	sunday: 'busy',
};

let defaultPreferences = {
	marketplaceVisibility: true,
	minimumNewSession: 24,
	minimumRescheduleSession: 24,
	corporativeSessions: true,
};

let defaultInmediateAttention = {
	acitvated: false,
	expiration: '',
};

const defaultPrices = {
	text: 38000,
	full: 62500,
	video: 50000,
};

let formationSchema = new Schema({
	formationType: {
		type: String,
	},
	description: {
		type: String,
	},
	intitucion: {
		type: String,
	},
	start: {
		type: String,
	},
	end: {
		type: String,
	},
});

let experienceSchema = new Schema({
	title: {
		type: String,
	},
	place: {
		type: String,
	},
	start: {
		type: String,
	},
	end: {
		type: String,
	},
	current: {
		type: Boolean,
		defautl: false,
	},
});

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

let psyPlan = new Schema({
	tier: {
		type: String,
		enum: ['free', 'premium'],
		default: 'free',
	},
	paymentStatus: {
		type: String,
		enum: ['success', 'pending'],
		default: 'pending',
	},
	planStatus: {
		type: String,
		enum: ['active', 'expired', 'pending'],
		default: 'pending',
	},
	expirationDate: {
		type: String,
		default: '',
	},
	subscriptionPeriod: {
		type: String,
	},
	price: {
		type: Number,
		default: 0,
	},
	hablaquiFee: {
		type: Number,
		default: 0.2,
	},
	paymentFee: {
		type: Number,
		default: 0.0399,
	},
});

let psychologist = new Schema({
	avatar: {
		type: String,
		default: '',
	},
	avatarThumbnail: {
		type: String,
	},
	approveAvatar: {
		type: Boolean,
		default: false,
	},
	code: {
		type: String,
	},
	email: {
		type: String,
	},
	linkedin: {
		type: String,
	},
	instagram: {
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
	rut: {
		type: String,
	},
	gender: {
		type: String,
	},
	birthDate: {
		type: String,
	},
	sessionType: {
		type: String,
	},
	languages: {
		type: Array,
	},
	specialties: {
		type: Array,
	},
	experience: [experienceSchema],
	formation: [formationSchema],
	personalDescription: {
		type: String,
		default: '',
	},
	professionalDescription: {
		type: String,
		default: '',
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
	sessionPrices: {
		type: Object,
		default: defaultPrices,
	},
	stampSetPrices: {
		type: String,
	},
	paymentMethod: {
		type: Object,
		required: false,
	},
	ratings: [rating],
	psyPlans: [psyPlan],
	timeZone: {
		type: String,
		default: 'America/Santiago',
	},
	inmediateAttention: {
		type: Object,
		default: defaultInmediateAttention,
	},
});

export default model('psychologist', psychologist);
