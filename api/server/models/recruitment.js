/**
 * Recruitment Model
 * 
 * This module defines the schema for specialist recruitment in the Hablaquí system.
 * It represents specialist applications that are pending approval, including their
 * professional information, availability, and onboarding status.
 * 
 * @module models/recruitment
 */

'use strict'

import { Schema, model } from 'mongoose'

/**
 * Session Schema
 * Defines the structure for sessions during the recruitment process
 * @type {Schema}
 */
const session = new Schema({
  /**
   * Date of the session
   * @type {String}
   */
  date: {
    type: String,
  },
  /**
   * Start time of the session
   * @type {String}
   */
  start: {
    type: String,
  },
  /**
   * End time of the session
   * @type {String}
   */
  end: {
    type: String,
  },
  /**
   * Reference to the user
   * @type {ObjectId}
   */
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  /**
   * Type of session
   * @type {String}
   */
  typeSession: {
    type: String,
  },
  /**
   * Type of payment
   * @type {String}
   */
  typePayments: {
    type: String,
  },
  /**
   * Payment status
   * @type {String}
   */
  statePayments: {
    type: String,
  },
  /**
   * Plan type
   * @type {String}
   */
  plan: {
    type: String,
  },
  /**
   * Indicates if session was invited by specialist
   * @type {Boolean}
   */
  invitedBySpecialist: {
    type: Boolean,
  },
})

/**
 * Default onboarding status
 * All steps marked as incomplete by default
 * @type {Object}
 */
const defaultOnboarding = {
  photo: false,
  bankData: false,
  setSchedule: false,
  scheduleIntervals: false,
  timeToSchedule: false,
  timeToReschedule: false,
  sessionPrice: false,
}

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
 * Default session prices in CLP
 * @type {Object}
 */
const defaultPrices = {
  text: 38000,
  full: 62500,
  video: 50000,
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
 * Rating Schema
 * Defines the structure for specialist ratings
 * @type {Schema}
 */
const rating = new Schema(
  {
    /**
     * Reference to the user who gave the rating
     * @type {ObjectId}
     */
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    /**
     * Rating comment
     * @type {String}
     */
    comment: {
      type: String,
    },
    /**
     * Number of stars given (1-5)
     * @type {Number}
     */
    stars: {
      type: Number,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
)

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
 * Recruitment Schema
 * Defines the structure and validation rules for recruitment documents
 * @type {Schema}
 */
const recruitment = new Schema(
  {
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
      default: '',
    },
    /**
     * Indicates if specialist has been verified
     * @type {Boolean}
     */
    isVerified: {
      type: Boolean,
      default: false,
    },
    /**
     * Specialist's email address
     * @type {String}
     */
    email: {
      type: String,
      default: '',
    },
    /**
     * Specialist's LinkedIn profile URL
     * @type {String}
     */
    linkedin: {
      type: String,
      default: '',
    },
    /**
     * Specialist's Instagram profile URL
     * @type {String}
     */
    instagram: {
      type: String,
      default: '',
    },
    /**
     * Specialist's username
     * @type {String}
     */
    username: {
      type: String,
      default: '',
    },
    /**
     * Specialist's first name
     * @type {String}
     */
    name: {
      type: String,
      default: '',
    },
    /**
     * Specialist's last name
     * @type {String}
     */
    lastName: {
      type: String,
      default: '',
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
      default: '',
    },
    /**
     * Specialist's profession
     * @type {String}
     */
    profession: {
      type: String,
      default: 'none',
      enum: ['none', 'psychologist', 'nutritionist', 'specchopedagogue'],
    },
    /**
     * Specialist's date of birth
     * @type {String}
     */
    birthDate: {
      type: String,
      default: '',
    },
    /**
     * Type of sessions offered
     * @type {String}
     */
    sessionType: {
      type: String,
      default: '',
    },
    /**
     * Languages spoken by the specialist
     * @type {Array}
     */
    languages: {
      type: Array,
      default: [],
    },
    /**
     * Specialist's specialties
     * @type {Array}
     */
    specialties: {
      type: Array,
      default: [],
    },
    /**
     * Array of work experiences
     * @type {Array<experienceSchema>}
     */
    experience: [experienceSchema],
    /**
     * Array of educational formations
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
      default: [],
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
      default: '',
    },
    /**
     * Commune of residence
     * @type {String}
     */
    comuna: {
      type: String,
      default: '',
    },
    /**
     * Specialist's schedule
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
     * Specialist's session prices
     * @type {Object}
     */
    sessionPrices: {
      type: Object,
      default: defaultPrices,
    },
    /**
     * Payment method
     * @type {Object}
     */
    paymentMethod: {
      type: Object,
      required: false,
    },
    /**
     * Specialist's years of experience in special sessions
     * @type {String}
     */
    yearsExpSpecialist: {
      type: String,
      default: '',
    },
    /**
     * Specialist's years of experience in videocalls
     * @type {String}
     */
    yearsExpVideocalls: {
      type: String,
      default: '',
    },
    /**
     * Specialist's average number of patients
     * @type {String}
     */
    avgPatients: {
      type: String,
      default: '',
    },
    /**
     * How the specialist was found
     * @type {String}
     */
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
    /**
     * Specialist's phone number
     * @type {Object}
     */
    phone: {
      type: Object,
      default: { number: '', code: '', flag: '' },
    },
    /**
     * Indicates if the specialist is involved in an exclusive activity
     * @type {Boolean}
     */
    isExclusiveActivity: {
      type: Boolean,
      default: false,
    },
    /**
     * Indicates if the specialist is under supervision
     * @type {Boolean}
     */
    isUnderSupervision: {
      type: Boolean,
      default: false,
    },
    /**
     * Indicates if the specialist is a supervisor
     * @type {Boolean}
     */
    isSupervisor: {
      type: Boolean,
      default: false,
    },
    /**
     * Indicates if the specialist is a content creator
     * @type {Boolean}
     */
    isContentCreator: {
      type: Boolean,
      default: false,
    },
    /**
     * Indicates if the specialist is an affiliate external
     * @type {Boolean}
     */
    isAffiliateExternal: {
      type: Boolean,
      default: false,
    },
    /**
     * Indicates if the specialist is interested in business
     * @type {Boolean}
     */
    isInterestedBusiness: {
      type: Boolean,
      default: false,
    },
    /**
     * Indicates if the specialist's form is completed
     * @type {Boolean}
     */
    isFormCompleted: {
      type: Boolean,
      default: false,
    },
    /**
     * Creation date of the recruitment document
     * @type {Date}
     */
    createdAt: {
      type: Date,
      default: Date.now,
    },
    /**
     * Last update date of the recruitment document
     * @type {Date}
     */
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    /**
     * Array of ratings
     * @type {Array<rating>}
     */
    ratings: [rating],
    /**
     * Array of specialist plans
     * @type {Array<specPlan>}
     */
    specPlans: [specPlan],
    /**
     * Array of psy plans
     * @type {Array<specPlan>}
     */
    psyPlans: [specPlan],
    /**
     * Array of sessions
     * @type {Array<session>}
     */
    sessions: [session],
    /**
     * Specialist's time zone
     * @type {String}
     */
    timeZone: {
      type: String,
      default: 'America/Santiago',
    },
    /**
     * Specialist's stamp set prices
     * @type {String}
     */
    stampSetPrices: {
      type: String,
    },
    /**
     * Specialist's onboarding status
     * @type {Object}
     */
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
