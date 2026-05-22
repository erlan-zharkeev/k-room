import { Body, Controller, Get, Patch, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { type Request, type Response } from 'express'
import {
  type BackendResponse,
  type ChangePasswordPayload,
  type CreateNewPasswordPayload,
  type GetUserDataResponse,
  USER_ENDPOINTS
} from 'global-shared'
import { memoryStorage } from 'multer'

import { SHARED_I18N } from 'src/shared/i18n'
import { AppError, toAppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'
import { runRequestValidation } from 'src/shared/lib/run-request-validation'

import { AccessTokenGuard } from '../session/session.guard'
import { SessionService } from '../session/session.service'

import type { UpdateUserDataPayload } from './types'
import { CHANGE_PASSWORD_I18N, RESET_PASSWORD_I18N, UPDATE_USER_DATA_I18N } from './user.i18n'
import { UserService } from './user.service'
import { CHANGE_PASSWORD_VALIDATION, RESET_PASSWORD_VALIDATION, UPDATE_USER_DATA_VALIDATION } from './user.validation'

@Controller()
export class UserController {
  constructor(private readonly sessionService: SessionService, private readonly userService: UserService) {}

  @Get(USER_ENDPOINTS.getUserData)
  @UseGuards(AccessTokenGuard)
  async getUserData(@Req() request: Request, @Res() response: Response<BackendResponse<GetUserDataResponse>>) {
    const { language, authUserId: userId } = request

    if (!userId) {
      throw new AppError(401, this.sessionService.getUnauthorizedMessage())
    }

    const user = await this.userService.requireUser(userId)
    await this.sessionService.updateTokens(userId, request, response)

    return response.json({
      payload: this.userService.mapUserToDto(user),
      message: {
        text: localizedText(SHARED_I18N.success, language),
        silent: true
      }
    })
  }

  @Post(USER_ENDPOINTS.resetPassword)
  async resetPassword(
    @Req() request: Request,
    @Res() response: Response<BackendResponse<null>>,
    @Body() payload: CreateNewPasswordPayload
  ) {
    const { language } = request

    try {
      runRequestValidation(request, RESET_PASSWORD_VALIDATION)
      await this.userService.resetPassword(payload)

      return response.json({
        payload: null,
        message: {
          text: localizedText(RESET_PASSWORD_I18N.success, language),
          silent: true
        }
      })
    } catch (error) {
      throw toAppError(error, RESET_PASSWORD_I18N.failed)
    }
  }

  @Patch(USER_ENDPOINTS.editUserData)
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 1024 * 1024 * 1024
      }
    })
  )
  async updateUserData(
    @Req() request: Request,
    @Res() response: Response<BackendResponse<null>>,
    @UploadedFile() file?: Express.Multer.File,
    @Body() payload?: UpdateUserDataPayload
  ) {
    const { language, authUserId: userId } = request

    try {
      if (!userId) {
        throw new AppError(401, this.sessionService.getUnauthorizedMessage())
      }

      runRequestValidation(request, UPDATE_USER_DATA_VALIDATION)
      await this.userService.updateUserData({
        userId,
        nickname: payload?.nickname,
        avatarFileBuffer: file?.buffer,
        resetAvatar: payload?.['reset-avatar']
      })

      return response.json({
        payload: null,
        message: {
          text: localizedText(SHARED_I18N.success, language),
          silent: true
        }
      })
    } catch (error) {
      throw toAppError(error, UPDATE_USER_DATA_I18N.failedUpdate)
    }
  }

  @Patch(USER_ENDPOINTS.changePassword)
  @UseGuards(AccessTokenGuard)
  async changePassword(
    @Req() request: Request,
    @Res() response: Response<BackendResponse<null>>,
    @Body() payload: ChangePasswordPayload
  ) {
    const { language, authUserId: userId } = request

    try {
      if (!userId) {
        throw new AppError(401, this.sessionService.getUnauthorizedMessage())
      }

      runRequestValidation(request, CHANGE_PASSWORD_VALIDATION)
      await this.userService.changePassword({
        userId,
        currentPassword: payload.currentPassword,
        password: payload.password
      })

      return response.json({
        payload: null,
        message: {
          text: localizedText(CHANGE_PASSWORD_I18N.success, language),
          silent: false
        }
      })
    } catch (error) {
      throw toAppError(error, CHANGE_PASSWORD_I18N.failed)
    }
  }
}
