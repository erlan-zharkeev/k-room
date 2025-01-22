import { Response } from 'express'
import { ENV } from '../../ENV'
import { UserModel } from '../../models'
import { AuthTokens, NotificationMessage, Status } from '../../@types'
import { parseTimeToMs, throwError } from '../../utils'

const clc = require('cli-color')

export const jwt = require('jsonwebtoken')

const generateToken = (id: string, secret: string, expiresIn: number | string) => {
  const payload = { id }
  const result = jwt.sign(payload, secret, { expiresIn })
  return result
}

const setToken = (res: Response, tokenName: AuthTokens, id: string, secret: string, expiresIn: number | string): string => {
  const token = generateToken(id, secret, expiresIn)
  res.cookie(tokenName, token, {
    secure: true,
  });
  return token
}

export const updateTokens = async (id: string, res: Response) => {
  if (!ENV?.K_ROOM_ACCESS_TOKEN_SECRET || !ENV?.K_ROOM_REFRESH_TOKEN_SECRET) {
    console.log(clc.red.bgWhite('failed to load - K_ROOM_ACCESS_TOKEN_SECRET'))
    throwError(Status.server, res, NotificationMessage.commonServerError)
  }
  setToken(res, AuthTokens.accessToken, id, ENV?.K_ROOM_ACCESS_TOKEN_SECRET, ENV.JWT_ACCESS_EXPIRES_INTERVAL)
  const refreshToken = setToken(
    res,
    AuthTokens.refreshToken,
    id,
    ENV.K_ROOM_REFRESH_TOKEN_SECRET,
    ENV.JWTR_ACCESS_EXPIRES_INTERVAL
  )
  console.log(clc.green.bgWhite('-Token pair updated'))
  return await UserModel.updateOne({ _id: id }, { refreshToken })
}
