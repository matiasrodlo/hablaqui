'use strict';

import { Schema, model } from 'mongoose';

// Model for psychologist that are not approved
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
	monday: [['09:00', '17:00']],
	tuesday: [['09:00', '17:00']],
	wednesday: [['09:00', '17:00']],
	thursday: [['09:00', '17:00']],
	friday: [['09:00', '17:00']],
	saturday: 'busy',
	sunday: 'busy',
};

const defaultPrices = {
	text: 38000,
	full: 62500,
	video: 50000,
};

let defaultPreferences = {
	marketplaceVisibility: true,
	minimumNewSession: 24,
	minimumRescheduleSession: 24,
	corporativeSessions: true,
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

let recruitment = new Schema(
	{
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
			default: '',
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		email: {
			type: String,
			default: '',
		},
		linkedin: {
			type: String,
			default: '',
		},
		instagram: {
			type: String,
			default: '',
		},
		username: {
			type: String,
			default: '',
		},
		name: {
			type: String,
			default: '',
		},
		lastName: {
			type: String,
			default: '',
		},
		rut: {
			type: String,
		},
		gender: {
			type: String,
			default: '',
		},
		birthDate: {
			type: String,
			default: '',
		},
		sessionType: {
			type: String,
			default: '',
		},
		languages: {
			type: Array,
			default: [],
		},
		specialties: {
			type: Array,
			default: [],
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
			default: [],
		},
		country: {
			type: String,
			default: 'Chile',
		},
		region: {
			type: String,
			default: '',
		},
		comuna: {
			type: String,
			default: '',
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
		yearsExpPsychologist: {
			type: String,
			default: '',
		},
		yearsExpVideocalls: {
			type: String,
			default: '',
		},
		avgPatients: {
			type: String,
			default: '',
		},
		howFindOut: {
			type: String,
			default: 'Búsqueda de internet',
			enum: [
				'Búsqueda de internet',
				'Por redes sociales',
				'Por amigos/familiares',
				'Por blog',
				'Anuncio en google',
				'Otro',
			],
		},
		phone: {
			type: Object,
			default: { number: '', code: '', flag: '' },
		},
		isExclusiveActivity: {
			type: Boolean,
			default: false,
		},
		isUnderSupervision: {
			type: Boolean,
			default: false,
		},
		isSupervisor: {
			type: Boolean,
			default: false,
		},
		isContentCreator: {
			type: Boolean,
			default: false,
		},
		isAffiliateExternal: {
			type: Boolean,
			default: false,
		},
		isInterestedBusiness: {
			type: Boolean,
			default: false,
		},
		isFormCompleted: {
			type: Boolean,
			default: false,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
		ratings: [rating],
		psyPlans: [psyPlan],
		sessions: [session],
		timeZone: {
			type: String,
			default: 'America/Santiago',
		},
	},
	{
		timestamps: true,
	}
);

export default model('recruitment', recruitment);
