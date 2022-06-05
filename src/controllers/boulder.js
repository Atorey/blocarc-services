const jwt = require('jsonwebtoken')

const Boulder = require('../models/boulder.js')
const User = require('../models/user.js')
const Achievement = require('../models/achievement.js')
const Like = require('../models/like.js')
const BoulderMark = require('../models/bouldermark.js')

const { error400, error403, error404, error500 } = require('../utils/errors')

const findAll = (req, res) => {
  if (req.query.creator) {
    Boulder.find({ creator: req.query.creator })
      .sort({ creationDate: -1 })
      .populate('creator')
      .then(result => {
        if (result && result.length > 0) {
          res.status(200).send({ boulders: result })
        } else {
          error404(res, 'Boulders not found')
        }
      })
      .catch(err => {
        error500(res, err)
      })
  } else {
    Boulder.find()
      .sort({ creationDate: -1 })
      .populate('creator')
      .then(result => {
        const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login

        if (result && result.length > 0) {
          result = result.filter(boulder => boulder.share || boulder.creator.email === userLoged)
          res.status(200).send({ boulders: result })
        } else {
          error404(res, 'Boulders not found')
        }
      })
      .catch(err => {
        error500(res, err)
      })
  }
}

const findOne = (req, res) => {
  Boulder.findById(req.params['id'])
    .populate('creator')
    .then(result => {
      const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
      if (!result) {
        error404(res, 'Boulder not found')
      } else {
        User.findOne({ email: userLoged }).then(userFind => {
          if (userFind) {
            Like.find({ user: userFind }).then(likes => {
              Achievement.find({ user: userFind }).then(achievements => {
                BoulderMark.find({ user: userFind }).then(boulderMarks => {
                  result.mine = checkIfItsMine(result, userLoged)
                  result.like = checkIfLike(likes, result, userFind)
                  result.completed = checkIfCompleted(achievements, result, userFind)
                  result.saved = checkIfSaved(boulderMarks, result, userFind)

                  if (result && !result.share && !result.mine) {
                    error403(res, 'This boulder is not being shared to the community')
                  } else {
                    res.status(200).send({ boulder: result })
                  }
                })
              })
            })
          } else {
            error404(res, 'User not found')
          }
        })
      }
    })
    .catch(() => {
      error404(res, 'Boulder not found')
    })
}

const getGrades = (req, res) => {
  try {
    let grades = Boulder.schema.path('grade').enumValues
    if (grades) {
      res.status(200).send({ grades: grades })
    } else {
      error404(res, 'Grades not found')
    }
  } catch (error) {
    error404(res, 'Grades not found')
  }
}

const getAchievements = (req, res) => {
  Achievement.find({ boulder: req.params['id'] })
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
}

const findAllBouldersAchieved = (req, res) => {
  Boulder.find()
    .sort({ creationDate: -1 })
    .populate('creator')
    .then(result => {
      if (result && result.length > 0) {
        User.findById(req.query.user)
          .then(user => {
            if (user) {
              Achievement.find({ user: user })
                .populate('boulder')
                .populate('user')
                .then(achievements => {
                  if (achievements && achievements.length > 0) {
                    let filteredBoulders = result.filter(boulder => {
                      return achievements.some(achievement => {
                        return boulder.id === achievement.boulder.id
                      })
                    })
                    res.status(200).send({ boulders: filteredBoulders })
                  } else {
                    error404(res, 'Boulders completed not found')
                  }
                })
                .catch(err => {
                  error500(res, err)
                })
            } else {
              error404(res, 'User not found')
            }
          })
          .catch(() => {
            error404(res, 'User not found')
          })
      } else {
        error404(res, 'Boulders not found')
      }
    })
    .catch(err => {
      error500(res, err)
    })
}

const findAllBouldersMarks = (req, res) => {
  Boulder.find()
    .sort({ creationDate: -1 })
    .populate('creator')
    .then(result => {
      if (result && result.length > 0) {
        const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login

        User.findOne({ email: userLoged })
          .then(user => {
            if (user) {
              BoulderMark.find({ user: user })
                .populate('boulder')
                .then(bouldersmarks => {
                  if (bouldersmarks && bouldersmarks.length > 0) {
                    let filteredBoulders = result.filter(boulder => {
                      return bouldersmarks.some(bouldermark => {
                        return boulder.id === bouldermark.boulder.id
                      })
                    })
                    res.status(200).send({ boulders: filteredBoulders })
                  } else {
                    error404(res, 'Boulders saved not found')
                  }
                })
                .catch(err => {
                  error500(res, err)
                })
            } else {
              error404(res, 'User not found')
            }
          })
          .catch(() => {
            error404(res, 'User not found')
          })
      } else {
        error404(res, 'Boulders not found')
      }
    })
    .catch(err => {
      error500(res, err)
    })
}

const findAllLikes = (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  Boulder.find()
    .sort({ creationDate: -1 })
    .populate('creator')
    .then(result => {
      if (result && result.length > 0) {
        User.findOne({ email: userLoged })
          .then(user => {
            if (user) {
              Like.find({ user: user })
                .populate('boulder')
                .then(likes => {
                  if (likes && likes.length > 0) {
                    let filteredBoulders = result.filter(boulder => {
                      return likes.some(like => {
                        return boulder.id === like.boulder.id
                      })
                    })
                    res.status(200).send({ boulders: filteredBoulders })
                  } else {
                    error404(res, 'Boulders liked not found')
                  }
                })
                .catch(err => {
                  error500(res, err)
                })
            } else {
              error404(res, 'User not found')
            }
          })
          .catch(() => {
            error404(res, 'User not found')
          })
      } else {
        error404(res, 'Boulders not found')
      }
    })
    .catch(err => {
      error500(res, err)
    })
}

const create = async (req, res) => {
  /* const imageUrl = await saveImage('boulders', req.body.image) */
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      if (result) {
        let creator = result

        const newBoulder = new Boulder({
          name: req.body.name,
          grade: req.body.grade,
          wall: req.body.wall,
          share: req.body.share,
          image: req.body.image,
          creationDate: req.body.creationDate,
          creator: creator,
          mine: req.body.mine,
          holds: req.body.holds,
        })

        newBoulder
          .save()
          .then(result => {
            res.status(200).send({ boulder: result })
          })
          .catch(err => {
            /* fs.unlinkSync('./public/' + imageUrl) */
            error400(res, err)
          })
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const postAchievement = async (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      if (result) {
        let userLoged = result

        Boulder.findById(req.params['id'])
          .then(result => {
            if (!result) {
              error404(res, 'Boulder not found')
            }
            if (result && !result.share && !result.mine) {
              error403(res, 'You cant complete this boulder')
            } else {
              const newAchievement = new Achievement({
                user: userLoged,
                boulder: result,
                date: req.body.date,
                attemps: req.body.attemps,
                grade: req.body.grade,
                comment: req.body.comment,
                video: req.body.video,
                valoration: req.body.valoration,
              })

              newAchievement
                .save()
                .then(result => {
                  res.status(200).send({ achievement: result })
                  updateBoulder(result.boulder, 1)
                })
                .catch(err => {
                  error400(res, err)
                })
            }
          })
          .catch(() => {
            error404(res, 'Boulder not found')
          })
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const postBoulderMark = async (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      if (result) {
        let userLoged = result

        Boulder.findById(req.params['id'])
          .then(result => {
            if (!result) {
              error404(res, 'Boulder not found')
            }
            if (result && !result.share && !result.mine) {
              error403(res, 'You cant save this boulder')
            } else {
              const newBoulderMark = new BoulderMark({
                user: userLoged,
                boulder: result,
              })

              newBoulderMark
                .save()
                .then(result => {
                  res.status(200).send({ boulderMark: result })
                })
                .catch(err => {
                  error400(res, err)
                })
            }
          })
          .catch(() => {
            error404(res, 'Boulder not found')
          })
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const postLike = async (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      if (result) {
        let userLoged = result

        Boulder.findById(req.params['id'])
          .then(result => {
            if (!result) {
              error404(res, 'Boulder not found')
            }
            if (result && !result.share && !result.mine) {
              error403(res, 'You cant like this boulder')
            } else {
              const newLike = new Like({
                user: userLoged,
                boulder: result,
              })

              newLike
                .save()
                .then(result => {
                  res.status(200).send({ like: result })
                })
                .catch(err => {
                  error400(res, err)
                })
            }
          })
          .catch(() => {
            error404(res, 'Boulder not found')
          })
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const update = (req, res) => {
  Boulder.findById(req.params['id'])
    .then(async result => {
      if (!result) {
        error404(res, 'Boulder not found')
      } else if (result && !result.mine) {
        error403(res, 'This is not your boulder')
      } else {
        Boulder.findByIdAndUpdate(
          result.id,
          {
            $set: {
              name: req.body.name,
              grade: req.body.grade,
              share: req.body.share,
            },
          },
          { new: true }
        )
          .then(result => {
            res.status(200).send({ boulder: result })
          })
          .catch(err => {
            error400(res, err)
          })
      }
    })
    .catch(() => {
      error404(res, 'Boulder not found')
    })
}

const removeLike = (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(user => {
      if (user) {
        Boulder.findById(req.params['id'])
          .then(result => {
            if (result) {
              Like.deleteOne({ boulder: result, user: user })
                .then(() => {
                  res.status(200).send()
                })
                .catch(err => {
                  error500(res, err)
                })
            } else {
              error404(res, 'Boulder not found')
            }
          })
          .catch(() => {
            error404(res, 'Boulder not found')
          })
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const removeBoulderMark = (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(user => {
      if (user) {
        Boulder.findById(req.params['id'])
          .then(result => {
            if (result) {
              BoulderMark.deleteOne({ boulder: result, user: user })
                .then(() => {
                  res.status(200).send()
                })
                .catch(err => {
                  error500(res, err)
                })
            } else {
              error404(res, 'Boulder not found')
            }
          })
          .catch(() => {
            error404(res, 'Boulder not found')
          })
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const removeAchievement = (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(user => {
      if (user) {
        Boulder.findById(req.params['id'])
          .then(result => {
            if (result) {
              Achievement.deleteOne({ boulder: result, user: user })
                .then(() => {
                  updateBoulder(result, -1)
                  res.status(200).send()
                })
                .catch(err => {
                  error500(res, err)
                })
            } else {
              error404(res, 'Boulder not found')
            }
          })
          .catch(() => {
            error404(res, 'Boulder not found')
          })
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const remove = (req, res) => {
  Boulder.findById(req.params['id'])
    .then(result => {
      const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
      if (result) {
        if ((result.creator.email = userLoged)) {
          if (!result.share) {
            Boulder.deleteOne({ _id: result.id })
              .then(() => {
                Like.deleteMany({ boulder: result }).exec()
                BoulderMark.deleteMany({ boulder: result }).exec()
                Achievement.deleteMany({ boulder: result }).exec()
                res.status(200).send()
              })
              .catch(err => {
                error500(res, err)
              })
          } else {
            error403(res, 'You cannot delete a boulder that is being shared with the community')
          }
        } else {
          error403(res, 'This is not your boulder')
        }
      } else {
        error404(res, 'Boulder not found')
      }
    })
    .catch(() => {
      error404(res, 'Boulder not found')
    })
}

const checkIfItsMine = (boulder, userLoged) => {
  if (boulder.creator.email === userLoged) {
    return true
  } else {
    return false
  }
}

const checkIfLike = (likes, boulder, user) => {
  if (likes.filter(like => like.boulder.toString() === boulder.id && like.user.toString() === user.id).length > 0) {
    return true
  } else {
    return false
  }
}

const checkIfCompleted = (achievements, boulder, user) => {
  if (
    achievements.filter(
      achievement => achievement.boulder.toString() === boulder.id && achievement.user.toString() === user.id
    ).length > 0
  ) {
    return true
  } else {
    return false
  }
}

const checkIfSaved = (boulderMarks, boulder, user) => {
  if (
    boulderMarks.filter(
      boulderMark => boulderMark.boulder.toString() === boulder.id && boulderMark.user.toString() === user.id
    ).length > 0
  ) {
    return true
  } else {
    return false
  }
}

const updateBoulder = (boulder, numReps) => {
  Achievement.find({ boulder: boulder }).then(result => {
    let valorationSum = 0

    const uniqueGrades = [...new Set(result.map(achievement => achievement.grade))]
    if (!uniqueGrades.some(grade => grade === boulder.grade)) {
      uniqueGrades.push(boulder.grade)
    }

    let grades = []
    uniqueGrades.forEach(grade => {
      const repetitions = result.filter(achievement => achievement.grade === grade)
      if (boulder.grade === grade) {
        repetitions.push([])
      }
      grades.push({
        value: grade,
        reps: repetitions.length,
      })
    })

    let newGrade = grades.filter(
      grade =>
        grade.reps ===
        Math.max.apply(
          Math,
          grades.map(grade => grade.reps)
        )
    )

    result.forEach(achievement => {
      if (achievement.valoration !== 0) {
        valorationSum = valorationSum + achievement.valoration
      }
    })
    let newValoration = valorationSum / result.length

    Boulder.findByIdAndUpdate(
      boulder.id,
      {
        $inc: { reps: numReps },
        $set: {
          valoration: newValoration,
          grade: newGrade.length > 1 ? undefined : newGrade[0].value,
        },
      },
      { upsert: true }
    ).exec()
  })
}

module.exports = {
  findAll,
  findOne,
  getGrades,
  getAchievements,
  findAllBouldersAchieved,
  findAllBouldersMarks,
  findAllLikes,
  create,
  postAchievement,
  postBoulderMark,
  postLike,
  update,
  remove,
  removeLike,
  removeAchievement,
  removeBoulderMark,
}
