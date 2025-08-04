import { Response } from 'express'
import { ENV } from '../../app/config/constants'
import { ServerNotificationMessage } from 'shared/types'
import { StatusEnum } from 'common-types'
import type { AuthTokensType } from 'common-types'

import { throwError } from '../../utils'
import { UserModel } from 'entities/user'

const clc = require('cli-color')

export const jwt = require('jsonwebtoken')

const generateToken = (id: string, secret: string, expiresIn: number | string) => {
  const payload = { id }
  const result = jwt.sign(payload, secret, { expiresIn })
  return result
}

const setToken = (
  res: Response,
  tokenName: AuthTokensType,
  id: string,
  secret: string,
  expiresIn: number | string
): string => {
  const token = generateToken(id, secret, expiresIn)
  res.cookie(tokenName, token, {
    secure: true
  })
  return token
}

export const updateTokens = async (id: string, res: Response) => {
  if (!ENV?.K_ROOM_ACCESS_TOKEN_SECRET || !ENV?.K_ROOM_REFRESH_TOKEN_SECRET) {
    console.log(clc.red.bgWhite('failed to load - K_ROOM_ACCESS_TOKEN_SECRET'))
    throwError(StatusEnum.Server, res, ServerNotificationMessage.CommonServerError)
  }
  setToken(res, 'jwt', id, ENV?.K_ROOM_ACCESS_TOKEN_SECRET, ENV.JWT_ACCESS_EXPIRES_INTERVAL)
  const refreshToken = setToken(
    res,
    'refresh-jwt',
    id,
    ENV.K_ROOM_REFRESH_TOKEN_SECRET,
    ENV.JWTR_ACCESS_EXPIRES_INTERVAL
  )
  console.log(clc.green.bgWhite('-Token pair updated'))
  return await UserModel.updateOne({ _id: id }, { refreshToken })
}
