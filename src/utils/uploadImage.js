const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const saveImage = async (dir, image) => {
  await sharp(image).webp({ quality: 20 })
  const data = image.split(',')[1] || image
  const file = `${Date.now()}.webp`
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
