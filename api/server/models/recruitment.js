'use strict'

import { Schema, model } from 'mongoose'

// Model for specialist that are not approved
const session = new Schema({
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
  invitedBySpecialist: {
    type: Boolean,
  },
})

const defaultOnboarding = {
  photo: false,
  bankData: false,
  setSchedule: false,
  scheduleIntervals: false,
  timeToSchedule: false,
  timeToReschedule: false,
  sessionPrice: false,
}

const defaultSchedule = {
  monday: 'busy',
  tuesday: 'busy',
  wednesday: 'busy',
  thursday: 'busy',
  friday: 'busy',
  saturday: 'busy',
  sunday: 'busy',
}

const defaultPrices = {
  text: 38000,
  full: 62500,
  video: 50000,
}

const defaultPreferences = {
  marketplaceVisibility: false,
  minimumNewSession: 24,
  minimumRescheduleSession: 24,
  corporativeSessions: true,
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

const rating = new Schema(
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
)

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

const recruitment = new Schema(
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
    profession: {
      type: String,
      default: 'none',
      enum: ['none', 'psychologist', 'nutritionist', 'specchopedagogue'],
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
    yearsExpSpecialist: {
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
    specPlans: [specPlan],
    psyPlans: [specPlan],
    sessions: [session],
    timeZone: {
      type: String,
      default: 'America/Santiago',
    },
    stampSetPrices: {
      type: String,
    },
    flagOnboarding: {
      type: Object,
      default: defaultOnboarding,
    },
  },
  {
    timestamps: true,
  }
)

export default model('recruitment', recruitment)
