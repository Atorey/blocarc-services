const jwt = require('jsonwebtoken')

const User = require('../models/user.js')
const Achievement = require('../models/achievement.js')

const { error404, error400 } = require('../utils/errors')

//TODO: Crear función que cambie el atributo 'mine' de boulder en el caso de que el creador coincida con el usuario logeado
//TODO: Crear servicio GET /boulders?creator={id} para obetener los bloques de un creador

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
        firstDate = new Date(firstDate.setHours(23, 59, 59, 9999))

        let lastDate = new Date(req.query.dateLast)
        lastDate.setDate(lastDate.getDate())
        lastDate = new Date(lastDate.setHours(23, 59, 59, 9999))

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
}
