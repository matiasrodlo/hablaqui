import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi);

const userSchema = {
	updateProfile: Joi.object({
		name: Joi.string().allow(''),
		email: Joi.string().allow(''),
		phone: Joi.string().allow(''),
		timeZone: Joi.string().allow(),
		phone: Joi.string().allow(''),
		state: Joi.boolean().allow(''),
		google: Joi.boolean().allow(''),
		googleId: Joi.string().allow(''),
		psychologist: Joi.object().allow(''),
		adminNotifyTime: Joi.string().allow(''),
		__v: Joi.number(),
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
		newPlan: Joi.string()
			.required(),
	}),
	updatePsychologist: Joi.object({
		newPsychologist: Joi.object()
			.required(),
	}),
	idPerson: Joi.object({
		idPerson: Joi.objectId(),
	}),
	share: Joi.object({
		email: Joi.string()
			.email()
			.required(),
	}),
};

export default Object.freeze(userSchema);
