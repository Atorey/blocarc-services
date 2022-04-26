const mongoose = require('mongoose')

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
})

let User = mongoose.model('users', userSchema)

module.exports = User
