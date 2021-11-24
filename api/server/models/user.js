'use strict';

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

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
		birthDate: {
			type: String,
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
			enum: ['user', 'psychologist', 'superuser'],
		},
	},
	{
		timestamps: true,
	}
);

export default model('User', userSchema);
