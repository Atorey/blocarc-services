const fs = require('fs')
const jwt = require('jsonwebtoken')

const Boulder = require('../models/boulder.js')
const User = require('../models/user.js')
const Achievement = require('../models/achievement.js')
const Like = require('../models/like.js')

const { error400, error403, error404, error500 } = require('../utils/errors')
const saveImage = require('../utils/uploadImage')
const BoulderMark = require('../models/bouldermark.js')

//TODO: Crear función que cambie el atributo 'mine' de boulder en el caso de que el creador coincida con el usuario logeado

const findAll = (req, res) => {
  if (req.query.creator) {
    Boulder.find({ creator: req.query.creator })
      .sort({ creationDate: -1 })
      .populate('creator')
      .then(result => {
        const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
        if (result && result.length > 0) {
          result.forEach(boulder => {
            if (boulder.creator === userLoged) {
              boulder.mine = true
            }
          })
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
          result.forEach(boulder => {
            if (boulder.creator === userLoged) {
              boulder.mine = true
            }
          })
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

const findAllAchievements = (req, res) => {
  Boulder.find()
    .sort({ creationDate: -1 })
    .populate('creator')
    .then(result => {
      const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
      if (result && result.length > 0) {
        User.findOne({ email: userLoged })
          .then(user => {
            if (user) {
              Achievement.find({ user: user })
                .populate('boulder')
                .then(achievements => {
                  if (achievements && achievements.length > 0) {
                    let filteredBoulders = result.filter(boulder => {
                      return achievements.some(achievement => {
                        return boulder.id === achievement.boulder.id
                      })
                    })
                    console.log(filteredBoulders)

                    filteredBoulders.forEach(boulder => {
                      if (boulder.creator === userLoged) {
                        boulder.mine = true
                      }
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
      const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
      if (result && result.length > 0) {
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
  Boulder.find()
    .sort({ creationDate: -1 })
    .populate('creator')
    .then(result => {
      const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
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

const findOne = (req, res) => {
  Boulder.findById(req.params['id'])
    .populate('creator')
    .then(result => {
      if (result) {
        res.status(200).send({ boulder: result })
      } else {
        error404(res, 'Boulder not found')
      }
    })
    .catch(() => {
      error404(res, 'Boulder not found')
    })
}

const create = async (req, res) => {
  const imageUrl = await saveImage('boulders', req.body.image)
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      console.log(result)
      if (result) {
        let creator = result

        const newBoulder = new Boulder({
          name: req.body.name,
          grade: req.body.grade,
          wall: req.body.wall,
          share: req.body.share,
          image: imageUrl,
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
            fs.unlinkSync('./public/' + imageUrl)
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

const remove = (req, res) => {
  Boulder.findById(req.params['id'])
    .then(result => {
      if (result) {
        if (result.mine) {
          Boulder.deleteOne({ _id: result.id })
            .then(() => {
              res.status(200).send()
            })
            .catch(err => {
              error500(res, err)
            })
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

const update = (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      console.log(result)
      if (result) {
        let creator = result

        Boulder.findById(req.params['id'])
          .then(async result => {
            if (!result) {
              error404(res, 'Boulder not found')
            } else if (result && !result.mine) {
              error403(res, 'This is not your boulder')
            } else {
              const imageUrl = await saveImage('boulders', req.body.image)

              Boulder.findByIdAndUpdate(
                result.id,
                {
                  $set: {
                    name: req.body.name,
                    grade: req.body.grade,
                    wall: req.body.wall,
                    share: req.body.share,
                    image: imageUrl,
                    creationDate: req.body.creationDate,
                    creator: creator,
                    mine: req.body.mine,
                    holds: req.body.holds,
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
      } else {
        error404(res, 'User not found')
      }
    })
    .catch(() => {
      error404(res, 'User not found')
    })
}

const getAchievements = (req, res) => {
  Achievement.find({ boulder: req.params['id'] })
    .then(result => {
      console.log(result)
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

const postAchievement = async (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      if (result) {
        let userLoged = result

        Boulder.findById(req.params['id'])
          .then(result => {
            if (result) {
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
                  updateBoulderValoration(result.boulder)
                })
                .catch(err => {
                  error400(res, err)
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

const postBoulderMark = async (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      if (result) {
        let userLoged = result

        Boulder.findById(req.params['id'])
          .then(result => {
            if (result) {
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

const postLike = async (req, res) => {
  const userLoged = jwt.decode(req.headers['authorization'].substring(7)).login
  User.findOne({ email: userLoged })
    .then(result => {
      if (result) {
        let userLoged = result

        Boulder.findById(req.params['id'])
          .then(result => {
            if (result) {
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

const updateBoulderValoration = boulder => {
  Achievement.find({ boulder: boulder }).then(result => {
    let valorationSum = 0
    result.forEach(achievement => {
      valorationSum = valorationSum + achievement.valoration
    })
    let newValoration = valorationSum / result.length
    console.log(newValoration)
    Boulder.findOneAndUpdate(
      { _id: boulder.id },
      {
        $inc: { reps: 1 },
        $set: {
          valoration: newValoration,
        },
      },
      { upsert: true }
    ).exec()
  })
}

/* 
const updateBoulderReps = boulder => {
  Boulder.findByIdAndUpdate(
    boulder.id,
    {
      $inc: {
        reps: 1,
      },
    },
    { new: true }
  )
} */

const getComments = (req, res) => {
  Boulder.findById(req.params['id'])
    .then(result => {
      if (result) {
        res.status(200).send({ comments: result.comments })
      } else {
        error404(res, 'Boulder not found')
      }
    })
    .catch(() => {
      error404(res, 'Boulder not found')
    })
}

const postComment = (req, res) => {
  Boulder.findById(req.params['id'])
    .then(result => {
      if (result) {
        Boulder.findByIdAndUpdate(
          result.id,
          {
            $push: {
              comments: [{ comment: req.body.comment }],
            },
          },
          { new: true }
        )
          .then(result => {
            res.status(200).send(result.comments[result.comments.length - 1])
          })
          .catch(err => {
            error400(res, err)
          })
      } else {
        error404(res, 'Boulder not found')
      }
    })
    .catch(() => {
      error404(res, 'Boulder not found')
    })
}

const deleteComment = (req, res) => {
  Boulder.findById(req.params['id'])
    .then(result => {
      if (!result) {
        error404(res, 'Boulder not found')
      }
      //TODO: añadir a la condición si el usuario actual no es el autor del comentario. Por ejemplo: result.mine || result.comment.user === loguedUser
      else if (!result.mine) {
        error403(res, 'You are not authorized to delete this comment')
      } else {
        if (result.comments.some(comment => comment.id === req.params['comment'])) {
          Boulder.updateOne(
            result.id,
            {
              $pull: {
                comments: { _id: req.params['comment'] },
              },
            },
            { new: true }
          )
            .then(() => {
              res.status(200).send()
            })
            .catch(err => {
              error400(res, err)
            })
        } else {
          error404(res, 'Comment not found')
        }
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

module.exports = {
  findAll,
  findAllAchievements,
  findAllBouldersMarks,
  findAllLikes,
  findOne,
  create,
  remove,
  update,
  getAchievements,
  postAchievement,
  postBoulderMark,
  postLike,
  getComments,
  postComment,
  deleteComment,
  getGrades,
}
