const fs = require('fs')
const path = require('path')

const saveImage = (dir, image) => {
  const data = image.split(',')[1] || image
  const file = `${Date.now()}.jpg`
  return new Promise((resolve, reject) => {
    const filePath = path.join('public/img', dir, file)
    fs.writeFile(filePath, data, { encoding: 'base64' }, err => {
      if (err) {
        reject(err)
      }
      resolve(`img/${dir}/${file}`)
    })
  })
}

module.exports = saveImage
