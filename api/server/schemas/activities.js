import Joi from '@hapi/joi';

const activitiesSchema = {
	create: Joi.object({
		workPlace: Joi.string().required(),
		whatWasDone: Joi.array().required(),
		ncamas: Joi.number()
			.integer()
			.required(),
		date: Joi.date(),
	}),
};

export default Object.freeze(activitiesSchema);
