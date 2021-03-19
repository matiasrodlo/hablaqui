import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi);

const userSchema = {
	shareWithMe: Joi.object({
		sharingUserId: Joi.string().required(),
		email: Joi.string()
			.email()
			.required(),
	}),
	updateInvoice: Joi.object({
		id: Joi.objectId().required(),
		log: Joi.string()
			.max(150)
			.required(),
		status: Joi.string()
			.max(15)
			.required(),
	}),
	updateProfile: Joi.object({
		name: Joi.string(),
		lastName: Joi.string().allow(''),
		role: Joi.string(),
		idPerson: Joi.optional(),
		img: Joi.optional(),
		company: Joi.string().allow(''),
		phone: Joi.string().allow(''),
		sharingWithMeEmails: Joi.array(),
		state: Joi.boolean().allow(''),
		google: Joi.boolean().allow(''),
		sharingWithUsers: Joi.array(),
		sharingWithMe: Joi.array(),
		googleId: Joi.string().allow(''),
		adminNotifyTime: Joi.string(),
		__v: Joi.number(),
	}).min(1),
	updatePassword: Joi.object({
		password: Joi.string()
			.min(5)
			.max(100)
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
