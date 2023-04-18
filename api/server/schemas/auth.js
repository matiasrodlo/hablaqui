import Joi from '@hapi/joi'

const authSchema = {
  register: Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .required(),
    lastName: Joi.string()
      .min(3)
      .max(100)
      .required(),
    role: Joi.string()
      .min(3)
      .max(100)
      .allow(''),
    profession: Joi.string().allow(''),
    rut: Joi.string()
      .min(3)
      .max(100)
      .allow(''),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(5)
      .max(100)
      .required(),
    inviteCode: Joi.string().allow(''),
    phone: Joi.string().allow(''),
  }),
  login: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(5)
      .max(100)
      .required(),
  }),
  registerTemp: Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(5)
      .max(100)
      .required(),
    phone: Joi.number().required(),
    role: Joi.string().required(),
    analyst: Joi.boolean(),
    idPerson: Joi.string(),
    company: Joi.string()
      .optional()
      .allow(''),
  }),
}

export default Object.freeze(authSchema)
