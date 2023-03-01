'use strict'

import { Schema, model } from 'mongoose'

const defaultSchedule = {
  monday: 'busy',
  tuesday: 'busy',
  wednesday: 'busy',
  thursday: 'busy',
  friday: 'busy',
  saturday: 'busy',
  sunday: 'busy',
}

const defaultPreferences = {
  marketplaceVisibility: false,
  minimumNewSession: 24,
  minimumRescheduleSession: 24,
  corporativeSessions: true,
}

const defaultInmediateAttention = {
  activated: false,
  expiration: '',
}

const defaultPrices = {
  text: 38000,
  full: 62500,
  video: 50000,
}

const formationSchema = new Schema({
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
})

const experienceSchema = new Schema({
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
})

const specPlan = new Schema({
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
})

const psychologist = new Schema({
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
  },
  email: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  instagram: {
    type: String,
  },
  username: {
    type: String,
  },
  name: {
    type: String,
  },
  lastName: {
    type: String,
  },
  rut: {
    type: String,
  },
  gender: {
    type: String,
  },
  birthDate: {
    type: String,
  },
  sessionType: {
    type: String,
  },
  languages: {
    type: Array,
  },
  specialties: {
    type: Array,
  },
  profession: {
    type: String,
    default: 'none',
    enum: ['none', 'psychologist', 'nutritionist', 'specchopedagogue'],
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
  },
  country: {
    type: String,
    default: 'Chile',
  },
  region: {
    type: String,
  },
  comuna: {
    type: String,
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
  stampSetPrices: {
    type: String,
  },
  paymentMethod: {
    type: Object,
    required: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  internetRating: {
    type: Number,
    default: 0,
  },
  puntualityRating: {
    type: Number,
    default: 0,
  },
  attentionRating: {
    type: Number,
    default: 0,
  },
  totalEvaluations: {
    type: Number,
    default: 0,
  },
  specPlans: [specPlan],
  psyPlans: [specPlan],
  timeZone: {
    type: String,
    default: 'America/Santiago',
  },
  inmediateAttention: {
    type: Object,
    default: defaultInmediateAttention,
  },
  points: {
    type: Number,
    default: 50,
  },
})

export default model('psychologist', psychologist)
