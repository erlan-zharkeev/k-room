import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { type Request, type Response } from 'express'

import { SERVER_ENV } from 'src/app/config/env'
import { AppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'

import { AUTH_I18N } from './auth.i18n'
import { AuthService } from './auth.service'

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const userId = await this.authService.validateRefreshRequest(request)
    request.authUserId = userId

    return true
  }
}

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()
    const { language, cookies } = request
    const accessToken = cookies.jwt

    if (!accessToken) {
      throw new AppError(401, localizedText(AUTH_I18N.nonAuthorized, language))
    }

    try {
      const decoded = await this.authService.verifyToken(accessToken, SERVER_ENV.secret.accessTokenSecret)
      request.authUserId = decoded.id

      return true
    } catch {
      const userId = await this.authService.validateRefreshRequest(request)
      await this.authService.updateTokens(userId, request, response)
      request.authUserId = userId

      return true
    }
  }
}
