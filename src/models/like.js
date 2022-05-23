const mongoose = require('mongoose')

let likeSchema = new mongoose.Schema({
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

likeSchema.index({ user: 1, boulder: 1 }, { unique: true })
let Like = mongoose.model('likes', likeSchema)

module.exports = Like
