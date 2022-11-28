import { Response } from 'express'
import ENV from '../../ENV'

const config = {
  secret: 'SECRET_KEY_RANDOM'
}

const jwt = require('jsonwebtoken')

export const generateAccessToken = (id: string) => {
  const payload = { id }
  return jwt.sign(payload, config.secret, { expiresIn: ENV?.JWT_ACCESS_EXPIRES_INTERVAL })
}

export const setAccessToken = (id: unknown, res: Response) => {
  const accessToken = generateAccessToken(String(id))
  res.cookie('jwt', accessToken)
}

export default setAccessToken
