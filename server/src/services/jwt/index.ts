import { Response } from 'express'
import ENV from '../../ENV'
import { UserModel } from '../../models/user.model'

export const jwt = require('jsonwebtoken')

const generateToken = (id: string, secret: string, expiresIn: number | string) => {
  const payload = { id }
  return jwt.sign(payload, secret, { expiresIn })
}

const setToken = (res: Response, tokenName: string, id: string, secret: string, expiresIn: number | string): string => {
  const token = generateToken(id, secret, expiresIn)
  res.cookie(tokenName, token)
  return token
}

export const updateTokens = async (id: string, res: Response) => {
  setToken(res, 'jwt', id, ENV?.K_ROOM_ACCESS_TOKEN_SECRET, '60s')
  const refreshToken = setToken(res, 'refresh-jwt', id, ENV?.K_ROOM_REFRESH_TOKEN_SECRET, '1d')
  return await UserModel.updateOne({ _id: id }, { refreshToken })
}
