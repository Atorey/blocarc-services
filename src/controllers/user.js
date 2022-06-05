const jwt = require('jsonwebtoken')
const fs = require('fs')

const User = require('../models/user.js')
const Achievement = require('../models/achievement.js')
const sha256 = require('crypto-js/sha256')

const { error404, error400 } = require('../utils/errors')
const saveImage = require('../utils/uploadImage')

const findMe = (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      if (result) {
        result.me = true
        res.status(200).send({ user: result })
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const findOne = (req, res) => {
  User.findById(req.params['id'])
    .then(result => {
      if (result) {
        result.me = false
        res.status(200).send({ user: result })
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const getAchievements = (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      if (result) {
        let firstDate = new Date(req.query.dateFirst)
        firstDate.setDate(firstDate.getDate())
        firstDate = new Date(firstDate.setHours(0, 0, 0, 0))

        let lastDate = new Date(req.query.dateLast)
        lastDate.setDate(lastDate.getDate())
        lastDate = new Date(lastDate.setHours(0, 0, 0, 0))

        Achievement.find({
          user: result,
          date: {
            $gte: new Date(firstDate),
            $lte: new Date(lastDate),
          },
        })
          .populate('boulder')
          .populate('user')
          .then(result => {
            if (result) {
              res.status(200).send({ achievements: result })
            } else {
              error404(res, 'Achievements not found')
            }
          })
          .catch(() => {
            error404(res, 'Achievements not found')
          })
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const findLastAchieved = (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      if (result) {
        Achievement.find({
          user: result,
        })
          .sort({ _id: -1 })
          .populate('boulder')
          .populate('user')
          .then(result => {
            if (result) {
              res.status(200).send({ achievement: result[0] })
            } else {
              error404(res, 'Achievement not found')
            }
          })
          .catch(() => {
            error404(res, 'Achievement not found')
          })
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const getTimer = (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      if (result) {
        res.status(200).send({ timer: result.timer })
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const postTimer = (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      if (result) {
        User.findByIdAndUpdate(
          result.id,
          {
            $set: {
              timer: req.body.timer,
            },
          },
          { new: true }
        )
          .then(result => {
            if (result) {
              res.status(200).send()
            } else {
              error404(res, 'User not found')
            }
          })
          .catch(err => error400(res, err))
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const getPullUps = (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      if (result) {
        res.status(200).send({ pullUps: result.pullUps })
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const getGoal = (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      if (result) {
        res.status(200).send({ goal: result.goal })
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const postPullUps = (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      if (result) {
        User.findByIdAndUpdate(
          result.id,
          {
            $set: {
              pullUps: req.body.pullUps,
            },
          },
          { new: true }
        )
          .then(result => {
            if (result) {
              res.status(200).send()
            } else {
              error404(res, 'User not found')
            }
          })
          .catch(err => error400(res, err))
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const postGoal = (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      if (result) {
        User.findByIdAndUpdate(
          result.id,
          {
            $set: {
              goal: req.body.goal,
            },
          },
          { new: true }
        )
          .then(result => {
            if (result) {
              res.status(200).send()
            } else {
              error404(res, 'User not found')
            }
          })
          .catch(err => error400(res, err))
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const update = async (req, res) => {
  const avatarURL = req.body.avatar ? await saveImage('users', req.body.avatar) : undefined
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  if (!req.body.password || regex.test(req.body.password)) {
    User.findOne({ email: userLoged })
      .then(async result => {
        if (!result) {
          error404(res, 'User not found')
        } else {
          console.log(sha256(req.body.password).toString())
          User.findByIdAndUpdate(
            result.id,
            {
              $set: {
                email: req.body.email,
                username: req.body.username,
                password: sha256(req.body.password).toString(),
                avatar: avatarURL,
              },
            },
            { new: true }
          )
            .then(result => {
              res.status(200).send({ boulder: result })
            })
            .catch(err => {
              if (avatarURL) {
                fs.unlinkSync('./public/' + avatarURL)
              }
              error400(res, err)
            })
        }
      })
      .catch(() => {
        error404(res, 'Boulder not found')
      })
  } else {
    error400(res, { message: 'Invalid password' })
  }
}

module.exports = {
  findMe,
  findOne,
  getAchievements,
  getTimer,
  getGoal,
  postTimer,
  getPullUps,
  postPullUps,
  postGoal,
  findLastAchieved,
  update,
}
