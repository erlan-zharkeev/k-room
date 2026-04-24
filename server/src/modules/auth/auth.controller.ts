import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common'
import { type Request, type Response } from 'express'
import {
  AUTH_ENDPOINTS,
  type IAuthLoginPayload,
  type IAuthRegistrationPayload,
  type IBackendResponse,
  type IConfirmEmailResponse,
  type ILoginResponse,
  type ISendConfirmationLinkResponse,
  type ISignInWithProviderPayload,
  type ISignInWithProviderResponse
} from 'shared'

import { SHARED_I18N } from '../../shared/config/i18n'
import { toAppError } from '../../shared/lib/app-error'
import { localizedText } from '../../shared/lib/localized-text'
import { runRequestValidation } from '../../shared/lib/run-request-validation'

import { RefreshTokenGuard, AccessTokenGuard } from './auth.guard'
import { AUTH_I18N } from './auth.i18n'
import { AuthService } from './auth.service'
import {
  CONFIRM_EMAIL_VALIDATION,
  LOGIN_VALIDATION,
  PROVIDER_LOGIN_VALIDATION,
  REGISTRATION_VALIDATION
} from './auth.validation'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(AUTH_ENDPOINTS.login)
  async login(
    @Req() request: Request,
    @Res() response: Response<IBackendResponse<ILoginResponse>>,
    @Body() payload: IAuthLoginPayload
  ) {
    const language = request.language ?? 'en'

    try {
      await runRequestValidation(request, LOGIN_VALIDATION)
      const result = await this.authService.login(payload, request, response)

      return response.json({
        payload: result,
        message: {
          text: localizedText(SHARED_I18N.success, language),
          silent: true
        }
      })
    } catch (error) {
      throw toAppError(error, localizedText(AUTH_I18N.loginFailed, language))
    }
  }

  @Post(AUTH_ENDPOINTS.registration)
  async registration(
    @Req() request: Request,
    @Res() response: Response<IBackendResponse<ISendConfirmationLinkResponse>>,
    @Body() payload: IAuthRegistrationPayload
  ) {
    const language = request.language ?? 'en'

    try {
      await runRequestValidation(request, REGISTRATION_VALIDATION)
      const result = await this.authService.registration(payload, language)

      return response.json({
        payload: result,
        message: {
          text: localizedText(AUTH_I18N.registrationSuccess, language),
          silent: false
        }
      })
    } catch (error) {
      throw toAppError(error, localizedText(AUTH_I18N.registrationFailed, language))
    }
  }

  @Post(AUTH_ENDPOINTS.confirmEmail)
  async confirmEmail(
    @Req() request: Request,
    @Res() response: Response<IBackendResponse<IConfirmEmailResponse>>,
    @Body('token') token: string
  ) {
    const language = request.language ?? 'en'

    try {
      await runRequestValidation(request, CONFIRM_EMAIL_VALIDATION)
      const result = await this.authService.confirmEmail(token, language)

      return response.json({
        payload: {
          email: result.email
        },
        message: {
          text: localizedText(
            result.alreadyConfirmed ? AUTH_I18N.emailAlreadyConfirmed : AUTH_I18N.emailConfirmed,
            language
          ),
          silent: false
        }
      })
    } catch (error) {
      throw toAppError(error, localizedText(AUTH_I18N.emailConfirmationFailed, language))
    }
  }

  @Post(AUTH_ENDPOINTS.sendEmailConfirmationLink)
  async sendConfirmationLink(
    @Req() request: Request,
    @Res() response: Response<IBackendResponse<ISendConfirmationLinkResponse>>,
    @Body('email') email: string
  ) {
    const language = request.language ?? 'en'

    try {
      const result = await this.authService.sendConfirmationLink(email, language)

      return response.json({
        payload: {
          email: result.email,
          attempts: result.attempts,
          nextRequestTime: result.nextRequestTime
        },
        message: {
          text: localizedText(
            result.alreadyConfirmed ? AUTH_I18N.emailAlreadyConfirmed : AUTH_I18N.confirmationLinkSent,
            language
          ),
          silent: false
        }
      })
    } catch (error) {
      throw toAppError(error, localizedText(AUTH_I18N.sendConfirmationLinkFailed, language))
    }
  }

  @Post(AUTH_ENDPOINTS.providerLogin)
  async signInWithProvider(
    @Req() request: Request,
    @Res() response: Response<IBackendResponse<ISignInWithProviderResponse>>,
    @Body() payload: ISignInWithProviderPayload
  ) {
    const language = request.language ?? 'en'

    try {
      await runRequestValidation(request, PROVIDER_LOGIN_VALIDATION)
      const result = await this.authService.signInWithProvider(payload, request, response)

      return response.json({
        payload: result,
        message: {
          text: localizedText(SHARED_I18N.success, language),
          silent: true
        }
      })
    } catch (error) {
      throw toAppError(error, localizedText(AUTH_I18N.signInWithProviderFailed, language))
    }
  }

  @Post(AUTH_ENDPOINTS.updateTokensPair)
  @UseGuards(RefreshTokenGuard)
  async updateTokensPair(@Req() request: Request, @Res() response: Response<IBackendResponse<null>>) {
    const language = request.language ?? 'en'
    const userId = request.authUserId

    if (!userId) {
      throw toAppError(null, localizedText(AUTH_I18N.nonAuthorized, language), 401)
    }

    await this.authService.updateTokens(userId, request, response)

    return response.json({
      payload: null,
      message: {
        text: localizedText(AUTH_I18N.tokensPairUpdated, language),
        silent: true
      }
    })
  }

  @Post(AUTH_ENDPOINTS.logout)
  @UseGuards(AccessTokenGuard)
  async logout(@Req() request: Request, @Res() response: Response<IBackendResponse<null>>) {
    const language = request.language ?? 'en'
    const userId = request.authUserId

    try {
      if (!userId) {
        throw toAppError(null, localizedText(AUTH_I18N.nonAuthorized, language), 401)
      }

      await this.authService.logout(userId, request, response)

      return response.json({
        payload: null,
        message: {
          text: localizedText(SHARED_I18N.success, language),
          silent: true
        }
      })
    } catch (error) {
      throw toAppError(error, localizedText(AUTH_I18N.logoutFailed, language))
    }
  }
}
