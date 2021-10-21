import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi);

const userSchema = {
	updateProfile: Joi.object({
		__v: Joi.number(),
		_id: Joi.string().allow(''),
		adminNotifyTime: Joi.string().allow(''),
		avatar: Joi.string().allow(''),
		chats: Joi.array(),
		email: Joi.string().allow(''),
		finishedSessions: Joi.string().allow(''),
		google: Joi.boolean().allow(''),
		googleCalendar: Joi.object(),
		googleId: Joi.string().allow(''),
		inviteCode: Joi.string().allow(''),
		lastName: Joi.string().allow(''),
		myPlan: Joi.optional(),
		name: Joi.string().allow(''),
		phone: Joi.string().allow(''),
		plan: Joi.array(),
		psychologist: Joi.string().allow(''),
		hasPaid: Joi.optional(),
		role: Joi.string().allow(''),
		rut: Joi.string().allow(''),
		state: Joi.boolean().allow(''),
		timeZone: Joi.string().allow(),
	}).min(1),
	updatePassword: Joi.object({
		oldPassword: Joi.string()
			.min(5)
			.max(100)
			.required(),
		newPassword: Joi.string()
			.min(5)
			.max(100)
			.required(),
	}),
	updatePlan: Joi.object({
		newPlan: Joi.string().required(),
	}),
	updatePsychologist: Joi.object({
		newPsychologist: Joi.object().required(),
	}),
	updateAvatar: Joi.object({
		newAvatar: Joi.string().required(),
	}),
	idPerson: Joi.object({
		idPerson: Joi.objectId(),
	}),
	share: Joi.object({
		email: Joi.string()
			.email()
			.required(),
	}),
	newUserByPsy: Joi.object({
		email: Joi.string()
			.email()
			.required(),
		name: Joi.string().required(),
		rut: Joi.string().allow(''),
		phone: Joi.string().allow(''),
	}),
};

export default Object.freeze(userSchema);
