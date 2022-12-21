'use strict';
import { Schema, model } from 'mongoose';

let userSchema = new Schema(
	{
		name: {
			type: String,
		},
		lastName: {
			type: String,
		},
		rut: {
			type: String,
		},
		email: {
			type: String,
			lowercase: true,
			trim: true,
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
		isVerified: {
			type: Boolean,
			default: false,
		},
		avatar: { type: String, default: '' },
		avatarThumbnail: {
			type: String,
		},
		google: {
			type: Boolean,
			default: false,
		},
		onboarding: {
			type: Boolean,
			default: false,
		},
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
		role: {
			type: String,
			default: 'user',
			enum: ['user', 'specialist', 'superuser'],
		},
		profesion: {
			type: String,
			default: 'none',
			enum: ['none', 'psychologist', 'nutritionist', 'psychopedagogue'],
		},
		gender: {
			type: String,
		},
		direction: {
			type: String,
		},
		birthDate: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

export default model('User', userSchema);
