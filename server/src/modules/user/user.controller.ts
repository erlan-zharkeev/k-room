import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { type Request, type Response } from 'express'
import { type IBackendResponse, type IGetUserDataResponse, USER_ENDPOINTS } from 'shared'

import { SHARED_I18N } from '../../shared/config/i18n'
import { AppError } from '../../shared/lib/app-error'
import { localizedText } from '../../shared/lib/localized-text'
import { AccessTokenGuard } from '../auth/auth.guard'
import { AUTH_I18N } from '../auth/auth.i18n'
import { AuthService } from '../auth/auth.service'

import { UserService } from './user.service'

@Controller()
export class UserController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Get(USER_ENDPOINTS.getUserData)
  @UseGuards(AccessTokenGuard)
  async getUserData(@Req() request: Request, @Res() response: Response<IBackendResponse<IGetUserDataResponse>>) {
    const language = request.language ?? 'en'
    const userId = request.authUserId

    if (!userId) {
      throw new AppError(401, localizedText(AUTH_I18N.nonAuthorized, language))
    }

    const user = await this.userService.requireUser(userId, language)
    await this.authService.updateTokens(userId, request, response)

    return response.json({
      payload: this.userService.mapUserToDto(user),
      message: {
        text: localizedText(SHARED_I18N.success, language),
        silent: true
      }
    })
  }
}
