'use strict'

import { Schema, model } from 'mongoose'

const transaction = new Schema(
  {
    specialist: {
      type: Schema.Types.ObjectId,
      ref: 'specialist',
    },
    psychologist: {
      type: Schema.Types.ObjectId,
      ref: 'psychologist',
    },
    total: { type: Number },
    sessions: { type: Array },
  },
  { timestamps: true }
)

export default model('transaction', transaction)
