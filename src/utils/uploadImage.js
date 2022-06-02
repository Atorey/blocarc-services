/* const fs = require('fs') */
const Buffer = require('buffer').Buffer
const path = require('path')
const sharp = require('sharp')

const saveImage = async (dir, image) => {
  const data = image.split(',')[1] || image
  const file = `${Date.now()}.webp`
  const ref = path.join('public/img', dir, file)
  const buffer = Buffer.from(data, 'base64')

  await sharp(buffer).webp({ quality: 75 }).toFile(ref)
  return `img/${dir}/${file}`
}

/* const saveImage = (dir, image) => {
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
    sharp(filePath).webp({ quality: 20 })
  })
} */

module.exports = saveImage
