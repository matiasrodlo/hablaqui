'use strict'

import { Schema, model } from 'mongoose'

const appointment = new Schema({
  name: {
    type: String,
  },
})

export default model('appointment', appointment)
