const Buffer = require('buffer').Buffer
const path = require('path')
const sharp = require('sharp')

const saveImage = async (dir, image) => {
  const data = image.split(',')[1] || image
  const file = `${Date.now()}.webp`
  const ref = path.join('public/img', dir, file)
  const buffer = Buffer.from(data, 'base64')

  await sharp(buffer).webp({ quality: 50 }).toFile(ref)
  return `img/${dir}/${file}`
}

module.exports = saveImage
