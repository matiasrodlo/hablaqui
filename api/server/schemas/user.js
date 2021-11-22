import Joi from '@hapi/joi';
Joi.objectId = require('joi-objectid')(Joi);

const userSchema = {
	updateProfile: Joi.object({
		_id: Joi.string().allow(''),
		avatar: Joi.string().allow(''),
		avatarThumbnail: Joi.string().allow(''),
		email: Joi.string().allow(''),
		finishedSessions: Joi.string().allow(''),
		google: Joi.boolean().allow(''),
		googleId: Joi.string().allow(''),
		hasPaid: Joi.boolean(),
		inviteCode: Joi.string().allow(''),
		lastName: Joi.string().allow(''),
		name: Joi.string().allow(''),
		phone: Joi.string().allow(''),
		plan: Joi.array(),
		psychologist: Joi.string().allow(''),
		role: Joi.string().allow(''),
		rut: Joi.string().allow(''),
		sessions: Joi.array(),
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
