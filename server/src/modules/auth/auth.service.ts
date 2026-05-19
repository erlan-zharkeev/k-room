import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'
import { type Request, type Response } from 'express'
import {
  formatNickname,
  REQ_STATUS,
  type IAuthLoginPayload,
  type IAuthRegistrationPayload,
  type LoginResponseType,
  type ISendConfirmationLinkPayload,
  type ISendConfirmationLinkResponse,
  type ISignInWithProviderPayload,
  type SignInWithProviderResponseType,
  type ProviderType
} from 'global-shared'
import { v4 as uuidv4 } from 'uuid'

import { SERVER_ENV } from 'src/app/env'
import { AppError } from 'src/shared/lib/app-error'
import { getRequestIp } from 'src/shared/lib/get-request-ip'

import { EmailService } from '../email/email.service'
import { SecurityService } from '../security/security.service'
import { SessionService } from '../session/session.service'
import { USER_I18N } from '../user/user.i18n'
import { UserModel } from '../user/user.model'
import { loadGoogleAvatar, updateUserAvatar, UserService } from '../user/user.service'

import {
  EMAIL_CONFIRMATION_LINK_LIFE_SECONDS,
  REGISTRATION_RESEND_INTERVAL_MS,
  SEND_CONFIRMATION_LINK_INTERVAL_MS
} from './auth.constants'
import { AUTH_I18N } from './auth.i18n'
import type { IConfirmEmailResult, ISendConfirmationLinkResult } from './auth.types'

@Injectable()
export class AuthService {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly securityService: SecurityService,
    private readonly sessionService: SessionService
  ) {}

  async login(payload: IAuthLoginPayload, request: Request, response: Response): Promise<LoginResponseType> {
    const ip = getRequestIp(request)

    await this.securityService.assertLoginAllowed(payload.captchaToken, ip, payload.login)

    const user = await this.userService.findByLogin(payload.login)

    if (!user) {
      await this.securityService.trackLoginFailure(ip, payload.login)
      throw new AppError(REQ_STATUS.badRequest, AUTH_I18N.invalidEmailOrPassword)
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.system.password)
    if (!isPasswordValid) {
      await this.securityService.trackLoginFailure(ip, payload.login)
      throw new AppError(REQ_STATUS.badRequest, AUTH_I18N.invalidEmailOrPassword)
    }

    if (!user.system.confirmed) {
      throw new AppError(REQ_STATUS.badRequest, AUTH_I18N.emailNotConfirmed)
    }

    await this.securityService.clearLoginFailures(payload.login)
    await this.sessionService.updateTokens(String(user._id), request, response)

    return this.userService.mapUserToDto(user)
  }

  async registration(payload: IAuthRegistrationPayload, request: Request): Promise<ISendConfirmationLinkResponse> {
    const ip = getRequestIp(request)

    await this.securityService.assertRegistrationAllowed(payload.captchaToken, ip)
    await this.securityService.trackRegistrationAttempt(ip)

    const userExistState = await this.userService.isUserExist({
      nickname: payload.nickname,
      email: payload.email
    })

    if (userExistState.exists) {
      throw new AppError(REQ_STATUS.badRequest, this.userService.getUserExistMessage(userExistState.reason))
    }

    const hashedPassword = await bcrypt.hash(payload.password, 6)
    const user = await this.userService.createUser({
      email: payload.email,
      nickname: payload.nickname,
      hashedPassword
    })

    if (!user) {
      throw new AppError(REQ_STATUS.server, AUTH_I18N.registrationFailed)
    }

    const confirmToken = this.sessionService.signToken(
      String(user._id),
      SERVER_ENV.secret.emailConfirmSecret,
      EMAIL_CONFIRMATION_LINK_LIFE_SECONDS
    )

    await this.emailService.sendEmailConfirmationEmail({
      email: payload.email,
      token: confirmToken,
      nickname: formatNickname(payload.nickname)
    })

    return {
      email: payload.email,
      attempts: user.system.confirmAttempts,
      nextRequestTime: Date.now() + REGISTRATION_RESEND_INTERVAL_MS
    }
  }

  async confirmEmail(token: string): Promise<IConfirmEmailResult> {
    const decoded = await this.sessionService.verifyToken(token, SERVER_ENV.secret.emailConfirmSecret)

    const updateResult = await UserModel.updateOne(
      { _id: decoded.id, 'system.confirmed': { $ne: true } },
      { $set: { 'system.confirmed': true } }
    )

    const user = await this.userService.findById(decoded.id)
    if (!user) {
      throw new AppError(REQ_STATUS.badRequest, USER_I18N.userNotFound)
    }

    return {
      email: user.personal.email,
      alreadyConfirmed: updateResult.modifiedCount !== 1
    }
  }

  async sendConfirmationLink(
    payload: ISendConfirmationLinkPayload,
    request: Request
  ): Promise<ISendConfirmationLinkResult> {
    const ip = getRequestIp(request)
    const email = payload.email.trim()
    const cooldownUntil = await this.securityService.getSendConfirmationLinkCooldown(email)

    if (cooldownUntil) {
      return {
        email,
        attempts: 0,
        nextRequestTime: cooldownUntil,
        alreadyConfirmed: false,
        rateLimited: true
      }
    }

    await this.securityService.assertSendConfirmationLinkAllowed(payload.captchaToken, email, ip)
    await this.securityService.trackSendConfirmationLinkAttempt(ip, email)

    const user = await this.userService.findByEmail(email)

    if (!user) {
      return {
        email,
        attempts: 0,
        nextRequestTime: Date.now() + SEND_CONFIRMATION_LINK_INTERVAL_MS,
        alreadyConfirmed: false,
        rateLimited: false
      }
    }

    if (user.system.confirmed) {
      return {
        email: user.personal.email,
        attempts: user.system.confirmAttempts,
        nextRequestTime: Date.now() + SEND_CONFIRMATION_LINK_INTERVAL_MS,
        alreadyConfirmed: true,
        rateLimited: false
      }
    }

    if (user.system.confirmAttempts <= 0) {
      throw new AppError(REQ_STATUS.badRequest, AUTH_I18N.noConfirmationAttemptsLeft)
    }

    const confirmToken = this.sessionService.signToken(
      String(user._id),
      SERVER_ENV.secret.emailConfirmSecret,
      EMAIL_CONFIRMATION_LINK_LIFE_SECONDS
    )

    await this.emailService.sendEmailConfirmationEmail({
      email: user.personal.email,
      token: confirmToken,
      nickname: formatNickname(user.public.nickname)
    })

    user.system.confirmAttempts = Math.max(user.system.confirmAttempts - 1, 0)
    await user.save()

    return {
      email: user.personal.email,
      attempts: user.system.confirmAttempts,
      nextRequestTime: Date.now() + SEND_CONFIRMATION_LINK_INTERVAL_MS,
      alreadyConfirmed: false,
      rateLimited: false
    }
  }

  async signInWithProvider(
    payload: ISignInWithProviderPayload,
    request: Request,
    response: Response
  ): Promise<SignInWithProviderResponseType> {
    const hashedPassword = await bcrypt.hash(uuidv4(), 6)
    const newUser = await this.userService.createUser({
      nickname: payload.nickname,
      email: payload.email,
      provider: payload.provider as ProviderType,
      hashedPassword
    })
    const user = newUser ?? (await this.userService.findByEmail(payload.email))

    if (newUser && payload.avatar) {
      const buffer = await loadGoogleAvatar(payload.avatar)

      if (buffer) {
        await updateUserAvatar(buffer, String(newUser._id))
      }
    }

    if (!user) {
      throw new AppError(REQ_STATUS.badRequest, AUTH_I18N.signInWithProviderFailed)
    }

    await this.sessionService.updateTokens(String(user._id), request, response)

    return this.userService.mapUserToDto(user)
  }
}
