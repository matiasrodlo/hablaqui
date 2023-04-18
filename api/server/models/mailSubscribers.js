'use strict'

import { Schema, model } from 'mongoose'

const subscriber = new Schema(
  {
    email: { type: String },
    preferences: {
      type: Array,
      default: ['blog'],
    },
  },
  { timestamps: true }
)

export default model('emailSubscriber', subscriber)
