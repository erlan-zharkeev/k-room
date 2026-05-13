import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { type Request, type Response } from 'express'

import { SERVER_ENV } from 'src/app/env'
import { AppError } from 'src/shared/lib/app-error'

import { SessionService } from './session.service'

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const userId = await this.sessionService.validateRefreshRequest(request)
    request.authUserId = userId

    return true
  }
}

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()
    const { language, cookies } = request
    const accessToken = cookies.jwt

    if (!accessToken) {
      throw new AppError(401, this.sessionService.getUnauthorizedMessage(language))
    }

    try {
      const decoded = await this.sessionService.verifyToken(accessToken, SERVER_ENV.secret.accessTokenSecret)
      request.authUserId = decoded.id

      return true
    } catch {
      const userId = await this.sessionService.validateRefreshRequest(request)
      await this.sessionService.updateTokens(userId, request, response)
      request.authUserId = userId

      return true
    }
  }
}
