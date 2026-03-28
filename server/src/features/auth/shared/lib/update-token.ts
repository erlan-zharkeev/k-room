import { type Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

import { setCookie } from 'src/features/cookie'

import { UserModel } from 'src/entities/user'

import { ENV, IAppRequest } from 'src/shared/config'
import { log, serverCaptureSentryException } from 'src/shared/lib'

import { setToken } from './set-token'

export const updateTokens = async (id: string, req: IAppRequest, res: Response) => {
  setToken(res, 'jwt', id, ENV.K_ROOM_ACCESS_TOKEN_SECRET, ENV.JWT_ACCESS_EXPIRES_INTERVAL)
  const refreshToken = setToken(
    res,
    'refresh-jwt',
    id,
    ENV.K_ROOM_REFRESH_TOKEN_SECRET,
    ENV.JWTR_ACCESS_EXPIRES_INTERVAL
  )
  const deviceId = req.cookies['device-id'] ?? uuidv4()
  setCookie(res, 'device-id', deviceId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    domain: ENV.IS_DEV ? undefined : ENV.COOKIE_DOMAIN || undefined,
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
