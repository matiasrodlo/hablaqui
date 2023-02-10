'use strict'

import { Schema, model } from 'mongoose'

const messageSchema = new Schema(
  {
    sentBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String
    },
    read: {
      type: Boolean,
      default: 'false'
    }
  },
  { timestamps: true }
)

const reportSchema = new Schema(
  {
    reportedBy: {
      type: String
    },
    reportType: {
      type: String,
      enum: ['inappropiate', 'no-answer', 'too-late', 'other']
    },
    issue: {
      type: String
    }
  },
  { timestamps: true }
)

const chatSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    specialist: {
      type: Schema.Types.ObjectId,
      ref: 'specialist'
    },
    psychologist: {
      type: Schema.Types.ObjectId,
      ref: 'psychologist'
    },
    isLastRead: {
      type: Boolean,
      default: true
    },
    lastMessageSendBy: {
      type: String,
      default: null
    },
    messages: [messageSchema],
    reports: [reportSchema]
  },
  { timestamps: true }
)

export default model('chat', chatSchema)
