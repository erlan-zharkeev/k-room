import { Injectable } from '@nestjs/common'
import { type CookieOptions, type Request, type Response } from 'express'
import { REQ_STATUS } from 'global-shared'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import { SERVER_ENV } from 'src/app/env'
import { AppError } from 'src/shared/lib/app-error'

import { UserModel } from '../user/user.model'

import {
  DEVICE_COOKIE_MAX_AGE_MS,
  JWT_ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  SESSION_COOKIE_NAMES
} from './constants'
import { parseTokenExpires } from './lib/parse-token-expires'
import { SESSION_I18N } from './session.i18n'
import type { ITokenPayload } from './types'

@Injectable()
export class SessionService {
  private getCookieOptions(maxAgeMs: number): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      ...(SERVER_ENV.domain ? { domain: SERVER_ENV.domain } : {}),
      maxAge: maxAgeMs
    }
  }

  private getClearCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      ...(SERVER_ENV.domain ? { domain: SERVER_ENV.domain } : {})
    }
  }

  getUnauthorizedMessage() {
    return SESSION_I18N.nonAuthorized
  }

  signToken(id: string, secret: string, expiresIn: string | number) {
    return jwt.sign({ id }, secret, { expiresIn } as SignOptions)
  }

  async verifyToken(token: string, secret: string) {
    return new Promise<ITokenPayload>((resolve, reject) => {
      jwt.verify(token, secret, (error, decoded) => {
        if (error) {
          return reject(error)
        }

        return resolve(decoded as ITokenPayload)
      })
    })
  }

  private setToken(
    response: Response,
    tokenName: 'jwt' | 'refresh-jwt',
    userId: string,
    secret: string,
    expiresIn: string | number
  ) {
    const token = this.signToken(userId, secret, expiresIn)
    response.cookie(tokenName, token, this.getCookieOptions(parseTokenExpires(expiresIn)))

    return token
  }

  async validateRefreshRequest(request: Request) {
    const { cookies } = request
    const refreshToken = cookies['refresh-jwt']

    if (!refreshToken) {
      throw new AppError(REQ_STATUS.notAuth, this.getUnauthorizedMessage())
    }

    try {
      const decoded = await this.verifyToken(refreshToken, SERVER_ENV.secret.refreshTokenSecret)
      const user = await UserModel.findById(decoded.id)
      const deviceId = cookies['device-id']
      const device = deviceId ? user?.system.device[deviceId] : undefined

      if (!user || !deviceId || !device || device.refreshToken !== refreshToken) {
        throw new AppError(REQ_STATUS.notAuth, this.getUnauthorizedMessage())
      }

      return decoded.id
    } catch {
      throw new AppError(REQ_STATUS.notAuth, this.getUnauthorizedMessage())
    }
  }

  async updateTokens(userId: string, request: Request, response: Response) {
    this.setToken(response, 'jwt', userId, SERVER_ENV.secret.accessTokenSecret, JWT_ACCESS_TOKEN_EXPIRES_IN)
    const refreshToken = this.setToken(
      response,
      'refresh-jwt',
      userId,
      SERVER_ENV.secret.refreshTokenSecret,
      REFRESH_TOKEN_EXPIRES_IN
    )
    const deviceId = request.cookies['device-id'] ?? uuidv4()

    response.cookie('device-id', deviceId, this.getCookieOptions(DEVICE_COOKIE_MAX_AGE_MS))

    const user = await UserModel.findById(userId)
    if (!user) {
      return
    }

    user.system.device = {
      ...user.system.device,
      [deviceId]: {
        refreshToken
      }
    }
    user.markModified('system.device')
    await user.save()
  }

  async clearSession(userId: string, request: Request, response: Response) {
    const deviceId = request.cookies['device-id']
    const user = await UserModel.findById(userId)

    if (user && deviceId && user.system.device[deviceId]) {
      const nextDevices = { ...user.system.device }
      delete nextDevices[deviceId]
      user.system.device = nextDevices
      user.markModified('system.device')
      await user.save()
    }

    SESSION_COOKIE_NAMES.forEach((cookie) => {
      response.clearCookie(cookie, this.getClearCookieOptions())
    })
  }
}
