import Joi from '@hapi/joi';

const sessionSchema = {
	newSession: Joi.object({
		date: Joi.date().required(),
		title: Joi.string().required(),
		specialist: Joi.string().required(),
		client: Joi.string().required(),
	}),
};

export default Object.freeze(sessionSchema);
