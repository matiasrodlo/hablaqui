'use strict';

import uniqueValidator from 'mongoose-unique-validator';
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

let planSchema = new Schema(
	{
		title: {
			type: String,
		},
		fullInfo: {
			type: Object,
		},
		period: {
			type: String,
		},
		psychologist: {
			type: Schema.Types.ObjectId,
			ref: 'psychologist',
		},
		price: {
			type: Number,
		},
		sessionPrice: {
			type: Number,
		},
		status: {
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
	},
	{ timestamps: true }
);
let userState = new Schema({
	psychologist: {
		type: Schema.Types.ObjectId,
		ref: 'psychologist',
	},
	state: {
		type: String,
		default: 'Sin estado',
	},
});
let userSchema = new Schema({
	name: {
		type: String,
	},
	lastName: {
		type: String,
	},
	rut: {
		type: String,
		unique: true,
	},
	email: {
		type: String,
		lowercase: true,
		trim: true,
		unique: true,
	},
	password: {
		type: String,
	},
	inviteCode: {
		type: String,
	},
	googleId: {
		type: String,
	},
	phone: {
		type: String,
		trim: true,
		required: false,
	},
	timeZone: {
		type: String,
		default: 'America/Santiago',
	},
	state: {
		type: Boolean,
		default: true,
	},
	avatar: { type: String, default: '' },
	avatarThumbnail: {
		type: String,
	},
	google: {
		type: Boolean,
		default: false,
	},
	plan: [planSchema],
	hasPaid: {
		type: Boolean,
		default: 'false',
	},
	finishedSessions: {
		type: Array,
		required: false,
	},
	psychologist: {
		type: Schema.Types.ObjectId,
		ref: 'psychologist',
		required: false,
	},
	sessionState: [userState],
	role: {
		type: String,
		default: 'user',
		enum: ['user', 'psychologist', 'superuser'],
	},
});

userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

export default model('User', userSchema);
