import { Response } from 'express'
import { ENV } from '../../ENV'
import { UserModel } from '../../models'
import { AuthTokens } from '../../@types'

const clc = require('cli-color')

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
  console.log(clc.green.bgWhite('- Token pair updated'))
  setToken(res, 'jwt', id, ENV?.K_ROOM_ACCESS_TOKEN_SECRET, ENV.JWT_ACCESS_EXPIRES_INTERVAL)
  const refreshToken = setToken(
    res,
    AuthTokens.refreshToken,
    id,
    ENV?.K_ROOM_REFRESH_TOKEN_SECRET,
    ENV?.JWTR_ACCESS_EXPIRES_INTERVAL
  )
  return await UserModel.updateOne({ _id: id }, { refreshToken })
}
