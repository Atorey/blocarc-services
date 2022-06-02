/* eslint-disable no-undef */
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const boulders = require(__dirname + '/routes/boulders')
const walls = require(__dirname + '/routes/walls')
const auth = require(__dirname + '/routes/auth')
const users = require(__dirname + '/routes/users')

mongoose.connect('mongodb+srv://atorey:Jk15wpoaq9c@cluster0.qxnl4.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

/* mongoose.connect('mongodb://localhost:27017/blocarc', { useNewUrlParser: true })
 */
let app = express()

app.use(cors({origin: true}))
app.use(express.json({ limit: '50mb' }))
app.use(express.static('public'))
app.use('/boulders', boulders)
app.use('/walls', walls)
app.use('/auth', auth)
app.use('/users', users)
app.use('/img/boulders', express.static('./public/img/boulders'))

const PORT = 5000
app.listen(process.env.PORT || PORT)
/* app.listen(PORT) */

