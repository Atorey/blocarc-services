const mongoose = require('mongoose')

let timerSchema = new mongoose.Schema({
  preparationTime: {
    type: String,
    default: '00:00',
  },
  workTime: {
    type: String,
    default: '00:00',
  },
  restTime: {
    type: String,
    default: '00:00',
  },
  rounds: {
    type: String,
    default: 0,
  },
})

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
  },
  avatar: {
    type: String,
  },
  me: {
    type: Boolean,
    default: false,
  },
  timer: {
    type: timerSchema,
    default: () => ({}),
  },
})

let User = mongoose.model('users', userSchema)

module.exports = User
