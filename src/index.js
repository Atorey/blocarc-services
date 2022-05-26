/* eslint-disable no-undef */
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const boulders = require(__dirname + '/routes/boulders')
const walls = require(__dirname + '/routes/walls')
const auth = require(__dirname + '/routes/auth')
const users = require(__dirname + '/routes/users')

mongoose.connect('mongodb://mongo:EaPVlxFywgNt6BFLBL5f@containers-us-west-54.railway.app:5621', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

let app = express()

// Add headers before the routes are defined
/* app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
}) */

app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.static('public'))
app.use('/boulders', boulders)
app.use('/walls', walls)
app.use('/auth', auth)
app.use('/users', users)
app.use('/img/boulders', express.static('./public/img/boulders'))

const PORT = 5000
app.listen(process.env.PORT || PORT, () => console.log('run server ' + PORT))
