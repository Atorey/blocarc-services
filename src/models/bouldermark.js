const mongoose = require('mongoose')

let boulderMarkSchema = new mongoose.Schema({
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
    default: Date.now,
  },
})

boulderMarkSchema.index({ user: 1, boulder: 1 }, { unique: true })
let BoulderMark = mongoose.model('bouldermarks', boulderMarkSchema)

module.exports = BoulderMark
