import { type Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

import { setToken } from 'features/auth'
import { setCookie } from 'features/cookie'

import { UserModel } from 'entities/user'

import { ENV, IAppRequest } from 'shared-config'
import { log } from 'shared-lib'

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
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
    maxAge: 3_153_600_000_000 // SET FOR 100 years
  })

  try {
    await UserModel.updateOne(
      { _id: id },
      [
        {
          $set: {
            [`system.device.${deviceId}`]: {
              $mergeObjects: [
                { $ifNull: [`$system.device.${deviceId}`, {}] },
                { refreshToken, socketId: null }
              ]
            }
          }
        }
      ]
    )
  } catch (e) {
    log.error(String(e))
  }


  log.success('-Token pair updated')
}
