'use strict';

import { Schema, model } from 'mongoose';

let defaultSchedule = {
	monday: [['09:00', '17:00']],
	tuesday: [['09:00', '17:00']],
	wednesday: [['09:00', '17:00']],
	thursday: [['09:00', '17:00']],
	friday: [['09:00', '17:00']],
	saturday: 'busy',
	sunday: 'busy',
};

let defaultPreferences = {
	marketplaceVisibility: true,
	minimumNewSession: 24,
	minimumRescheduleSession: 24,
	corporativeSessions: true,
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

let plan = new Schema({
	status: { type: String },
	hablaquiFee: { type: Number },
	paymentFee: { type: Number },
	expirationDate: { type: String },
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
	paymentMethod: {
		type: Object,
		required: false,
	},
	ratings: [rating],
	plan: [plan],
	timeZone: {
		type: String,
		default: 'America/Santiago',
	},
});

export default model('psychologist', psychologist);
