import { UserModel } from 'entities/user'
import { type Response } from 'express'
import { setToken } from 'features/auth'
import { setCookie } from 'features/cookie'
import { ENV, IRequest } from 'shared-config'
import { log } from 'shared-lib'
import { v4 as uuidv4 } from 'uuid'

export const updateTokens = async (id: string, req: IRequest, res: Response) => {
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

  await UserModel.updateOne(
    { id },
    {
      $set: {
        [`system.device.${deviceId}.refreshToken`]: refreshToken
      }
    }
  )

  log.success('-Token pair updated')
}
