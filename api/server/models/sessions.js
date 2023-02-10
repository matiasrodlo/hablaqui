import { Schema, model } from 'mongoose'

const session = new Schema({
  date: {
    type: String
  },
  sessionNumber: {
    type: String
  },
  paidToSpecialist: {
    type: Boolean,
    default: 'false'
  },
  request: {
    type: String,
    default: 'none',
    enum: ['none', 'pending', 'paid']
  },
  requestDate: {
    type: String,
    default: 'Por cobrar'
  },
  paymentDate: {
    type: String,
    default: 'Por cobrar'
  },
  // TODO: en un futuro se puede agregar sistema de mensajeria para confirmar sesion o cancelar
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'upnext', 'success', 'canceled']
  }
})

const plan = new Schema(
  {
    title: {
      type: String
    },
    period: {
      type: String
    },
    totalPrice: {
      type: Number
    },
    sessionPrice: {
      type: Number
    },
    payment: {
      type: String,
      default: 'pending',
      enum: ['pending', 'success', 'failed']
    },
    datePayment: {
      type: String
    },
    expiration: {
      type: String
    },
    usedCoupon: {
      type: String
    },
    totalSessions: {
      type: Number
    },
    remainingSessions: {
      type: Number
    },
    tokenToPay: { type: String, default: '' },
    session: [session]
  },
  { timestamps: true }
)
const sessionSchema = new Schema({
  observation: {
    type: String
  },
  plan: [plan],
  specialist: {
    type: Schema.Types.ObjectId,
    ref: 'specialist'
  },
  psychologist: {
    type: Schema.Types.ObjectId,
    ref: 'psychologist'
  },
  numberSessionSuccess: {
    type: Number,
    default: 0
  },
  evaluationNotifcation: { type: Boolean, default: false },
  roomsUrl: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

export default model('session', sessionSchema)
