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
    default: '1',
  },
})

let pullUpSchema = new mongoose.Schema({
  reps: {
    type: Number,
    default: 0,
  },
  intensity: {
    type: Number,
    default: 0,
  },
  weight: {
    type: Number,
    default: 0,
  },
  ballast: {
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
  pullUps: {
    type: pullUpSchema,
    default: () => ({}),
  },
  goal: {
    type: Number,
  },
})

let User = mongoose.model('users', userSchema)

module.exports = User
