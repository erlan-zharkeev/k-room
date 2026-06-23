import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'
import { type Request, type Response } from 'express'
import {
  REQ_STATUS,
  type AuthLoginPayload,
  type AuthRegistrationPayload,
  type SendConfirmationLinkPayload,
  type SendConfirmationLinkResponse,
  type SignInWithProviderPayload,
  type UserData,
  type Provider
} from 'global-shared'
import { v4 as uuidv4 } from 'uuid'

import { SERVER_ENV } from 'src/app/env'
import { AppError } from 'src/shared/lib/app-error'
import { getRequestIp } from 'src/shared/lib/get-request-ip'

import { EmailService } from '../email/email.service'
import { SecurityService } from '../security/security.service'
import { SessionService } from '../session/session.service'
import { loadGoogleAvatar } from '../user/lib/load-google-avatar'
import { updateUserAvatar } from '../user/lib/update-user-avatar'
import { confirmUserEmailIfNeeded } from '../user/lib/user-persistence'
import { USER_I18N } from '../user/user.i18n'
import { UserService } from '../user/user.service'

import {
  EMAIL_CONFIRMATION_LINK_LIFE_SEC,
  REGISTRATION_RESEND_INTERVAL_MS,
  SEND_CONFIRMATION_LINK_INTERVAL_MS
} from './auth.constants'
import { AUTH_I18N } from './auth.i18n'
import type { ConfirmEmailResult, SendConfirmationLinkResult } from './auth.types'

@Injectable()
export class AuthService {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly securityService: SecurityService,
    private readonly sessionService: SessionService
  ) {}

  async login(payload: AuthLoginPayload, request: Request, response: Response): Promise<UserData> {
    const ip = getRequestIp(request)

    await this.securityService.assertLoginAllowed(ip, payload.login, payload.captchaToken)

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
    await this.userService.updateUserLanguage(String(user._id), request.language)

    return this.userService.mapUserToDto(user)
  }

  async registration(payload: AuthRegistrationPayload, request: Request): Promise<SendConfirmationLinkResponse> {
    const ip = getRequestIp(request)
    const { language } = request

    await this.securityService.assertRegistrationAllowed(ip, payload.captchaToken)
    await this.securityService.trackRegistrationAttempt(ip)

    const existingUserByEmail = await this.userService.findByEmail(payload.email)
    const canResendExistingRegistration =
      existingUserByEmail && !existingUserByEmail.system.confirmed && existingUserByEmail.system.provider === 'app'

    if (canResendExistingRegistration) {
      if (existingUserByEmail.system.confirmAttempts <= 0) {
        throw new AppError(REQ_STATUS.badRequest, AUTH_I18N.noConfirmationAttemptsLeft)
      }

      const confirmToken = this.sessionService.signToken(
        String(existingUserByEmail._id),
        SERVER_ENV.secret.emailConfirmSecret,
        EMAIL_CONFIRMATION_LINK_LIFE_SEC
      )

      await this.emailService.sendEmailConfirmationEmail({
        email: existingUserByEmail.personal.email,
        language: this.userService.resolveUserLanguage(existingUserByEmail, language),
        token: confirmToken,
        nickname: existingUserByEmail.public.nickname
      })

      existingUserByEmail.system.confirmAttempts = Math.max(existingUserByEmail.system.confirmAttempts - 1, 0)
      await existingUserByEmail.save()

      return {
        email: existingUserByEmail.personal.email,
        attempts: existingUserByEmail.system.confirmAttempts,
        nextRequestTime: Date.now() + REGISTRATION_RESEND_INTERVAL_MS
      }
    }

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
      language,
      nickname: payload.nickname,
      hashedPassword
    })

    if (!user) {
      throw new AppError(REQ_STATUS.server, AUTH_I18N.registrationFailed)
    }

    const confirmToken = this.sessionService.signToken(
      String(user._id),
      SERVER_ENV.secret.emailConfirmSecret,
      EMAIL_CONFIRMATION_LINK_LIFE_SEC
    )

    try {
      await this.emailService.sendEmailConfirmationEmail({
        email: payload.email,
        language,
        token: confirmToken,
        nickname: payload.nickname
      })
    } catch (error) {
      await user.deleteOne()
      throw error
    }

    return {
      email: payload.email,
      attempts: user.system.confirmAttempts,
      nextRequestTime: Date.now() + REGISTRATION_RESEND_INTERVAL_MS
    }
  }

  async confirmEmail(token: string): Promise<ConfirmEmailResult> {
    const decoded = await this.sessionService.verifyToken(token, SERVER_ENV.secret.emailConfirmSecret)

    const emailWasConfirmed = await confirmUserEmailIfNeeded(decoded.id)

    const user = await this.userService.findById(decoded.id)
    if (!user) {
      throw new AppError(REQ_STATUS.badRequest, USER_I18N.userNotFound)
    }

    return {
      email: user.personal.email,
      alreadyConfirmed: !emailWasConfirmed
    }
  }

  async sendConfirmationLink(
    payload: SendConfirmationLinkPayload,
    request: Request
  ): Promise<SendConfirmationLinkResult> {
    const ip = getRequestIp(request)
    const { language } = request
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

    await this.securityService.assertSendConfirmationLinkAllowed(email, ip, payload.captchaToken)
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
      EMAIL_CONFIRMATION_LINK_LIFE_SEC
    )

    await this.emailService.sendEmailConfirmationEmail({
      email: user.personal.email,
      language: this.userService.resolveUserLanguage(user, language),
      token: confirmToken,
      nickname: user.public.nickname
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
    payload: SignInWithProviderPayload,
    request: Request,
    response: Response
  ): Promise<UserData> {
    const hashedPassword = await bcrypt.hash(uuidv4(), 6)
    const newUser = await this.userService.createUser({
      nickname: payload.nickname,
      email: payload.email,
      language: request.language,
      provider: payload.provider as Provider,
      hashedPassword
    })
    const user = newUser ?? (await this.userService.findByEmail(payload.email))

    if (newUser && payload.avatar) {
      const buffer = await loadGoogleAvatar(payload.avatar)

      if (buffer) {
        newUser.public.avatarId = await updateUserAvatar(buffer, newUser.public.avatarId)
        await newUser.save()
      }
    }

    if (!user) {
      throw new AppError(REQ_STATUS.badRequest, AUTH_I18N.signInWithProviderFailed)
    }

    await this.sessionService.updateTokens(String(user._id), request, response)
    await this.userService.updateUserLanguage(String(user._id), request.language)

    return this.userService.mapUserToDto(user)
  }
}
