import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common'
import { type Request, type Response } from 'express'
import {
  AUTH_ENDPOINTS,
  type AuthLoginPayload,
  type AuthRegistrationPayload,
  type BackendResponse,
  type ConfirmEmailResponse,
  type SendConfirmationLinkPayload,
  type SendConfirmationLinkResponse,
  type SignInWithProviderPayload,
  type UserData
} from 'global-shared'

import { SHARED_I18N } from 'src/shared/i18n'
import { toAppError } from 'src/shared/lib/app-error'
import { runRequestValidation } from 'src/shared/lib/run-request-validation'
import { sendResponse } from 'src/shared/lib/send-response'

import { requireAuthUserId } from '../session/lib/require-auth-user-id'
import { AccessTokenGuard, RefreshTokenGuard } from '../session/session.guard'
import { SessionService } from '../session/session.service'

import { AUTH_I18N } from './auth.i18n'
import { AuthService } from './auth.service'
import {
  CONFIRM_EMAIL_VALIDATION,
  LOGIN_VALIDATION,
  PROVIDER_LOGIN_VALIDATION,
  REGISTRATION_VALIDATION,
  SEND_CONFIRMATION_LINK_VALIDATION
} from './auth.validation'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly sessionService: SessionService) {}

  @Post(AUTH_ENDPOINTS.login)
  async login(
    @Req() request: Request,
    @Res() response: Response<BackendResponse<UserData>>,
    @Body() payload: AuthLoginPayload
  ) {
    const { language } = request

    try {
      runRequestValidation(request, LOGIN_VALIDATION)
      const result = await this.authService.login(payload, request, response)

      return sendResponse(response, language, result, SHARED_I18N.success, true)
    } catch (error) {
      throw toAppError(error, AUTH_I18N.loginFailed)
    }
  }

  @Post(AUTH_ENDPOINTS.registration)
  async registration(
    @Req() request: Request,
    @Res() response: Response<BackendResponse<SendConfirmationLinkResponse>>,
    @Body() payload: AuthRegistrationPayload
  ) {
    const { language } = request

    try {
      runRequestValidation(request, REGISTRATION_VALIDATION)
      const result = await this.authService.registration(payload, request)

      return sendResponse(response, language, result, AUTH_I18N.registrationSuccess, false)
    } catch (error) {
      throw toAppError(error, AUTH_I18N.registrationFailed)
    }
  }

  @Post(AUTH_ENDPOINTS.confirmEmail)
  async confirmEmail(
    @Req() request: Request,
    @Res() response: Response<BackendResponse<ConfirmEmailResponse>>,
    @Body('token') token: string
  ) {
    const { language } = request

    try {
      runRequestValidation(request, CONFIRM_EMAIL_VALIDATION)
      const result = await this.authService.confirmEmail(token)

      return sendResponse(
        response,
        language,
        {
          email: result.email
        },
        result.alreadyConfirmed ? AUTH_I18N.emailAlreadyConfirmed : AUTH_I18N.emailConfirmed,
        false
      )
    } catch (error) {
      throw toAppError(error, AUTH_I18N.emailConfirmationFailed)
    }
  }

  @Post(AUTH_ENDPOINTS.sendEmailConfirmationLink)
  async sendConfirmationLink(
    @Req() request: Request,
    @Res() response: Response<BackendResponse<SendConfirmationLinkResponse>>,
    @Body() payload: SendConfirmationLinkPayload
  ) {
    const { language } = request

    try {
      runRequestValidation(request, SEND_CONFIRMATION_LINK_VALIDATION)
      const result = await this.authService.sendConfirmationLink(payload, request)

      return sendResponse(
        response,
        language,
        {
          email: result.email,
          attempts: result.attempts,
          nextRequestTime: result.nextRequestTime
        },
        result.rateLimited ? AUTH_I18N.confirmationLinkCooldown : AUTH_I18N.confirmationLinkSent,
        false
      )
    } catch (error) {
      throw toAppError(error, AUTH_I18N.sendConfirmationLinkFailed)
    }
  }

  @Post(AUTH_ENDPOINTS.providerLogin)
  async signInWithProvider(
    @Req() request: Request,
    @Res() response: Response<BackendResponse<UserData>>,
    @Body() payload: SignInWithProviderPayload
  ) {
    const { language } = request

    try {
      runRequestValidation(request, PROVIDER_LOGIN_VALIDATION)
      const result = await this.authService.signInWithProvider(payload, request, response)

      return sendResponse(response, language, result, SHARED_I18N.success, true)
    } catch (error) {
      throw toAppError(error, AUTH_I18N.signInWithProviderFailed)
    }
  }

  @Post(AUTH_ENDPOINTS.updateTokensPair)
  @UseGuards(RefreshTokenGuard)
  async updateTokensPair(@Req() request: Request, @Res() response: Response<BackendResponse<null>>) {
    const { language } = request

    const userId = requireAuthUserId(request, this.sessionService.getUnauthorizedMessage())

    await this.sessionService.updateTokens(userId, request, response)

    return sendResponse(response, language, null, AUTH_I18N.tokensPairUpdated, true)
  }

  @Post(AUTH_ENDPOINTS.logout)
  @UseGuards(AccessTokenGuard)
  async logout(@Req() request: Request, @Res() response: Response<BackendResponse<null>>) {
    const { language } = request

    try {
      const userId = requireAuthUserId(request, this.sessionService.getUnauthorizedMessage())

      await this.sessionService.clearSession(userId, request, response)

      return sendResponse(response, language, null, SHARED_I18N.success, true)
    } catch (error) {
      throw toAppError(error, AUTH_I18N.logoutFailed)
    }
  }
}
