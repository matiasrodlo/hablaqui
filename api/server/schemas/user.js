import Joi from '@hapi/joi'
import joiObjectId from 'joi-objectid'
Joi.objectId = joiObjectId(Joi)

const userSchema = {
  updateProfile: Joi.object({
    _id: Joi.string().allow(''),
    avatar: Joi.string().allow(''),
    avatarThumbnail: Joi.string().allow(''),
    birthDate: Joi.string().allow(''),
    direction: Joi.string().allow(''),
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
    specialist: Joi.string().allow(''),
    onboarding: Joi.boolean(),
    isVerified: Joi.boolean(),
    role: Joi.string().allow(''),
    rut: Joi.string().allow(''),
    sessions: Joi.array(),
    state: Joi.boolean().allow(''),
    timeZone: Joi.string().allow(),
    gender: Joi.string().allow(),
    profession: Joi.string().allow(),
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
  updateSpecialist: Joi.object({
    newSpecialist: Joi.object().required(),
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
  newUserBySpec: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    name: Joi.string().required(),
    lastName: Joi.string().allow(''),
    rut: Joi.string().allow(''),
    phone: Joi.string().allow(''),
    invitedBy: Joi.objectId(),
  }),
}

export default Object.freeze(userSchema)
