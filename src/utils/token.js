const jwt = require('jsonwebtoken')
const secret = 'secret'
/* const { error401 } = require('../utils/errors') */

const generate = login => {
  return jwt.sign({ login: login }, secret, { expiresIn: '1 hours' })
}

/* const validate = token => {
  try {
    let resultado = jwt.verify(token, secret)
    return resultado
  } catch (e) {
    console.error('Token could not be validated')
  }
}

let protectRoute = () => {
  return (req, res, next) => {
    let token = req.headers['authorization']
    if (token) {
      token = token.substring(7)
      let result = validate(token)
      if (result) {
        next()
      } else {
        error401(res, 'Not Authorized')
      }
    } else {
      error401(res, 'Not Authorized')
    }
  }
} */

module.exports = {
  generate,
}
