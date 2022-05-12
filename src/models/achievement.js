const mongoose = require('mongoose')

let achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  boulder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'boulders',
  },
  date: {
    type: Date,
    required: true,
  },
  attemps: {
    type: Number,
    min: 1,
    required: true,
  },
  grade: {
    type: String,
    required: true,
    enum: [
      '4',
      '4+',
      '5',
      '5+',
      '6a',
      '6a+',
      '6b',
      '6b+',
      '6c',
      '6c+',
      '7a',
      '7a+',
      '7b',
      '7b+',
      '7c',
      '7c+',
      '8a',
      '8a+',
      '8b',
      '8b+',
      '8c',
      '8c+',
      '9a',
      '9a+',
      '9b',
      '9b+',
    ],
  },
  comment: {
    type: String,
  },
  video: {
    type: String,
  },
  valoration: {
    type: Number,
    min: 1,
    max: 5,
  },
})

achievementSchema.index({ user: 1, boulder: 1 }, { unique: true })
let Achievement = mongoose.model('achievements', achievementSchema)

module.exports = Achievement
