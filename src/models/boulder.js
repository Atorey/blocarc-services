const mongoose = require('mongoose')

let holdSchema = new mongoose.Schema({
  coords: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    enum: ['green', 'blue', 'red'],
    required: true,
  },
})

let boulderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
    unique: true,
    trim: true,
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
  wall: {
    type: String,
    required: true,
  },
  share: {
    type: Boolean,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  mine: {
    type: Boolean,
    default: true,
  },
  valoration: {
    type: Number,
    default: 0
  },
  holds: [holdSchema],
})

let Boulder = mongoose.model('boulders', boulderSchema)

module.exports = Boulder
