/**
 * Specialist Model
 * 
 * This module defines the Specialist schema for the Hablaquí API.
 * It represents specialist accounts in the system, including their professional information,
 * availability, pricing, and ratings.
 * 
 * @module models/specialist
 */

'use strict'

import { Schema, model } from 'mongoose'

/**
 * Default weekly schedule
 * All days marked as busy by default
 * @type {Object}
 */
const defaultSchedule = {
  monday: 'busy',
  tuesday: 'busy',
  wednesday: 'busy',
  thursday: 'busy',
  friday: 'busy',
  saturday: 'busy',
  sunday: 'busy',
}

/**
 * Default specialist preferences
 * @type {Object}
 */
const defaultPreferences = {
  marketplaceVisibility: false,
  minimumNewSession: 24,
  minimumRescheduleSession: 24,
  corporativeSessions: true,
}

/**
 * Default immediate attention settings
 * @type {Object}
 */
const defaultInmediateAttention = {
  activated: false,
  expiration: '',
}

/**
 * Default session prices in CLP
 * @type {Object}
 */
const defaultPrices = {
  text: 38000,
  full: 62500,
  video: 50000,
}

/**
 * Formation Schema
 * Defines the structure for specialist's educational background
 * @type {Schema}
 */
const formationSchema = new Schema({
  /**
   * Type of formation (e.g., degree, certification)
   * @type {String}
   */
  formationType: {
    type: String,
  },

  /**
   * Description of the formation
   * @type {String}
   */
  description: {
    type: String,
  },

  /**
   * Institution where the formation was obtained
   * @type {String}
   */
  intitucion: {
    type: String,
  },

  /**
   * Start date of the formation
   * @type {String}
   */
  start: {
    type: String,
  },

  /**
   * End date of the formation
   * @type {String}
   */
  end: {
    type: String,
  },
})

/**
 * Experience Schema
 * Defines the structure for specialist's work experience
 * @type {Schema}
 */
const experienceSchema = new Schema({
  /**
   * Job title or position
   * @type {String}
   */
  title: {
    type: String,
  },

  /**
   * Workplace or company name
   * @type {String}
   */
  place: {
    type: String,
  },

  /**
   * Start date of the experience
   * @type {String}
   */
  start: {
    type: String,
  },

  /**
   * End date of the experience
   * @type {String}
   */
  end: {
    type: String,
  },

  /**
   * Indicates if this is the current position
   * @type {Boolean}
   */
  current: {
    type: Boolean,
    defautl: false,
  },
})

/**
 * Specialist Plan Schema
 * Defines the structure for specialist's subscription plan
 * @type {Schema}
 */
const specPlan = new Schema({
  /**
   * Plan tier (free or premium)
   * @type {String}
   */
  tier: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free',
  },

  /**
   * Payment status of the plan
   * @type {String}
   */
  paymentStatus: {
    type: String,
    enum: ['success', 'pending'],
    default: 'pending',
  },

  /**
   * Current status of the plan
   * @type {String}
   */
  planStatus: {
    type: String,
    enum: ['active', 'expired', 'pending'],
    default: 'pending',
  },

  /**
   * Plan expiration date
   * @type {String}
   */
  expirationDate: {
    type: String,
    default: '',
  },

  /**
   * Subscription period
   * @type {String}
   */
  subscriptionPeriod: {
    type: String,
  },

  /**
   * Plan price
   * @type {Number}
   */
  price: {
    type: Number,
    default: 0,
  },
})

/**
 * Specialist Schema
 * Defines the structure and validation rules for specialist documents
 * @type {Schema}
 */
const specialist = new Schema({
  /**
   * URL to specialist's profile picture
   * @type {String}
   */
  avatar: {
    type: String,
    default: '',
  },

  /**
   * URL to specialist's profile picture thumbnail
   * @type {String}
   */
  avatarThumbnail: {
    type: String,
  },

  /**
   * Indicates if profile picture has been approved
   * @type {Boolean}
   */
  approveAvatar: {
    type: Boolean,
    default: false,
  },

  /**
   * Specialist's unique code
   * @type {String}
   */
  code: {
    type: String,
  },

  /**
   * Specialist's email address
   * @type {String}
   */
  email: {
    type: String,
  },

  /**
   * Specialist's LinkedIn profile URL
   * @type {String}
   */
  linkedin: {
    type: String,
  },

  /**
   * Specialist's Instagram profile URL
   * @type {String}
   */
  instagram: {
    type: String,
  },

  /**
   * Specialist's username
   * @type {String}
   */
  username: {
    type: String,
  },

  /**
   * Specialist's first name
   * @type {String}
   */
  name: {
    type: String,
  },

  /**
   * Specialist's last name
   * @type {String}
   */
  lastName: {
    type: String,
  },

  /**
   * Specialist's RUT (Chilean national ID)
   * @type {String}
   */
  rut: {
    type: String,
  },

  /**
   * Specialist's gender
   * @type {String}
   */
  gender: {
    type: String,
  },

  /**
   * Specialist's date of birth
   * @type {String}
   */
  birthDate: {
    type: String,
  },

  /**
   * Type of sessions offered
   * @type {String}
   */
  sessionType: {
    type: String,
  },

  /**
   * Languages spoken by the specialist
   * @type {Array}
   */
  languages: {
    type: Array,
  },

  /**
   * Specialist's areas of expertise
   * @type {Array}
   */
  specialties: {
    type: Array,
  },

  /**
   * Specialist's professional qualification
   * @type {String}
   */
  profession: {
    type: String,
    default: 'none',
    enum: ['none', 'psychologist', 'nutritionist', 'specchopedagogue'],
  },

  /**
   * Specialist's work experience
   * @type {Array<experienceSchema>}
   */
  experience: [experienceSchema],

  /**
   * Specialist's educational background
   * @type {Array<formationSchema>}
   */
  formation: [formationSchema],

  /**
   * Personal description
   * @type {String}
   */
  personalDescription: {
    type: String,
    default: '',
  },

  /**
   * Professional description
   * @type {String}
   */
  professionalDescription: {
    type: String,
    default: '',
  },

  /**
   * Therapeutic models used
   * @type {Array}
   */
  models: {
    type: Array,
  },

  /**
   * Country of residence
   * @type {String}
   */
  country: {
    type: String,
    default: 'Chile',
  },

  /**
   * Region of residence
   * @type {String}
   */
  region: {
    type: String,
  },

  /**
   * City/commune of residence
   * @type {String}
   */
  comuna: {
    type: String,
  },

  /**
   * Weekly availability schedule
   * @type {Object}
   */
  schedule: {
    type: Object,
    default: defaultSchedule,
  },

  /**
   * Specialist's preferences
   * @type {Object}
   */
  preferences: {
    type: Object,
    default: defaultPreferences,
  },

  /**
   * Session prices in CLP
   * @type {Object}
   */
  sessionPrices: {
    type: Object,
    default: defaultPrices,
  },

  /**
   * Stamp set prices
   * @type {String}
   */
  stampSetPrices: {
    type: String,
  },

  /**
   * Payment method information
   * @type {Object}
   */
  paymentMethod: {
    type: Object,
    required: false,
  },

  /**
   * Overall rating
   * @type {Number}
   */
  rating: {
    type: Number,
    default: 0,
  },

  /**
   * Internet connection rating
   * @type {Number}
   */
  internetRating: {
    type: Number,
    default: 0,
  },

  /**
   * Punctuality rating
   * @type {Number}
   */
  puntualityRating: {
    type: Number,
    default: 0,
  },

  /**
   * Attention quality rating
   * @type {Number}
   */
  attentionRating: {
    type: Number,
    default: 0,
  },

  /**
   * Total number of evaluations received
   * @type {Number}
   */
  totalEvaluations: {
    type: Number,
    default: 0,
  },

  /**
   * Specialist's subscription plans
   * @type {Array<specPlan>}
   */
  specPlans: [specPlan],

  /**
   * Timezone
   * @type {String}
   */
  timeZone: {
    type: String,
    default: 'America/Santiago',
  },

  /**
   * Immediate attention settings
   * @type {Object}
   */
  inmediateAttention: {
    type: Object,
    default: defaultInmediateAttention,
  },

  /**
   * Specialist's points/reputation
   * @type {Number}
   */
  points: {
    type: Number,
    default: 50,
  },
})

export default model('specialist', specialist)
