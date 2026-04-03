import { Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

import { setCookie } from 'src/features/cookie'

import { UserModel } from 'src/entities/user'

import { IAppRequest, SERVER_ENV } from 'src/shared/config'
import { log, serverCaptureSentryException } from 'src/shared/lib'

import { JWT_ACCESS_EXPIRES_INTERVAL, JWTR_ACCESS_EXPIRES_INTERVAL } from './../config'
import { setToken } from './set-token'

export const updateTokens = async (id: string, req: IAppRequest, res: Response) => {
  setToken(res, 'jwt', id, SERVER_ENV.accessTokenSecret, JWT_ACCESS_EXPIRES_INTERVAL)
  const refreshToken = setToken(
    res,
    'refresh-jwt',
    id,
    SERVER_ENV.refreshTokenSecret,
    JWTR_ACCESS_EXPIRES_INTERVAL
  )
  const deviceId = req.cookies['device-id'] ?? uuidv4()
  setCookie(res, 'device-id', deviceId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    domain: SERVER_ENV.domain,
    maxAge: 3_153_600_000_000 // SET FOR 100 years
  })

  try {
    await UserModel.updateOne({ _id: id }, [
      {
        $set: {
          [`system.device.${deviceId}`]: {
            $mergeObjects: [{ $ifNull: [`$system.device.${deviceId}`, {}] }, { refreshToken, socketId: null }]
          }
        }
      }
    ])
  } catch (error) {
    log.error(String(error))
    serverCaptureSentryException(error)
  }

  log.success('-Token pair updated')
}
