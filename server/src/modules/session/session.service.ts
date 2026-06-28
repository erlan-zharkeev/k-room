import { Injectable } from '@nestjs/common'
import { type CookieOptions, type Request, type Response } from 'express'
import { REQ_STATUS } from 'global-shared'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import { SERVER_ENV } from 'src/app/env'
import { AppError } from 'src/shared/lib/app-error'

import { clearUserRefreshDevice, hasUserRefreshDevice, setUserRefreshDevice } from '../user/lib/user-persistence'

import { parseTokenExpires } from './lib/parse-token-expires'
import {
  DEVICE_COOKIE_MAX_AGE_MS,
  JWT_ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  SESSION_COOKIE_NAMES
} from './session.constants'
import { SESSION_I18N } from './session.i18n'
import type { TokenPayload } from './session.types'

@Injectable()
export class SessionService {
  private isNativeDesktopRequest(request: Request) {
    const { origin, referer } = request.headers

    if (
      typeof origin === 'string' &&
      SERVER_ENV.nativeDesktopOrigins.some((nativeDesktopOrigin) => origin === nativeDesktopOrigin)
    ) {
      return true
    }

    return (
      typeof referer === 'string' &&
      SERVER_ENV.nativeDesktopOrigins.some((nativeDesktopOrigin) => referer.startsWith(`${nativeDesktopOrigin}/`))
    )
  }

  private getCookieSameSite(request: Request) {
    return this.isNativeDesktopRequest(request) ? 'none' : 'strict'
  }

  private getCookieOptions(maxAgeMs: number, request: Request): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      sameSite: this.getCookieSameSite(request),
      path: '/',
      ...(SERVER_ENV.domain ? { domain: SERVER_ENV.domain } : {}),
      maxAge: maxAgeMs
    }
  }

  private getClearCookieOptions(request: Request): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      sameSite: this.getCookieSameSite(request),
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
    return new Promise<TokenPayload>((resolve, reject) => {
      jwt.verify(token, secret, (error, decoded) => {
        if (error) {
          return reject(error)
        }

        return resolve(decoded as TokenPayload)
      })
    })
  }

  private setToken(
    response: Response,
    tokenName: 'jwt' | 'refresh-jwt',
    userId: string,
    secret: string,
    expiresIn: string | number,
    request: Request
  ) {
    const token = this.signToken(userId, secret, expiresIn)
    response.cookie(tokenName, token, this.getCookieOptions(parseTokenExpires(expiresIn), request))

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
      const deviceId = cookies['device-id']
      const hasRefreshDevice = deviceId ? await hasUserRefreshDevice(decoded.id, deviceId, refreshToken) : false

      if (!deviceId || !hasRefreshDevice) {
        throw new AppError(REQ_STATUS.notAuth, this.getUnauthorizedMessage())
      }

      return decoded.id
    } catch {
      throw new AppError(REQ_STATUS.notAuth, this.getUnauthorizedMessage())
    }
  }

  async updateTokens(userId: string, request: Request, response: Response) {
    this.setToken(response, 'jwt', userId, SERVER_ENV.secret.accessTokenSecret, JWT_ACCESS_TOKEN_EXPIRES_IN, request)
    const refreshToken = this.setToken(
      response,
      'refresh-jwt',
      userId,
      SERVER_ENV.secret.refreshTokenSecret,
      REFRESH_TOKEN_EXPIRES_IN,
      request
    )
    const deviceId = request.cookies['device-id'] ?? uuidv4()

    response.cookie('device-id', deviceId, this.getCookieOptions(DEVICE_COOKIE_MAX_AGE_MS, request))

    await setUserRefreshDevice(userId, deviceId, refreshToken)
  }

  async clearSession(userId: string, request: Request, response: Response) {
    const deviceId = request.cookies['device-id']

    if (deviceId) {
      await clearUserRefreshDevice(userId, deviceId)
    }

    SESSION_COOKIE_NAMES.forEach((cookie) => {
      response.clearCookie(cookie, this.getClearCookieOptions(request))
    })
  }
}
