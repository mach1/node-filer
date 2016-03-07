import crypto from 'crypto'

const algorithm = 'aes-256-ctr'
const password = 'asd123'

export function getCipher() {
  return crypto.createCipher(algorithm, password)
}

export function getDecipher() {
  return crypto.createDecipher(algorithm, password)
}
