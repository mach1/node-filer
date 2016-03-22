import crypto from 'crypto'
import fs from 'fs'

const algorithm = 'aes-256-ctr'
const password = 'd6F3Efeq'

export function encrypt(filePath) {
  return new Promise((resolve, reject) => {
    try {
      const resultPath = `${filePath}.enc`
      const encrypt = crypto.createCipher(algorithm, password);
      const input = fs.createReadStream(filePath)
      const output = fs.createWriteStream(resultPath)
      input.pipe(encrypt).pipe(output)

      output.on('finish', () => {
        resolve(resultPath)
      })
    } catch (e) {
      reject(e)
    }
  })
}

export function decrypt(filePath) {
  return new Promise((resolve, reject) => {
    try {
      const resultPath = filePath.substring(0, filePath.length - 4)
      const decrypt = crypto.createDecipher(algorithm, password);
      const input = fs.createReadStream(filePath)
      const output = fs.createWriteStream(resultPath)
      input.pipe(decrypt).pipe(output)

      output.on('finish', () => {
        resolve(resultPath)
      })
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}
