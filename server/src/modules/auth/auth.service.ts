import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'
import { type Request, type Response, type CookieOptions } from 'express'
import jwt, { type SignOptions } from 'jsonwebtoken'
import {
  type AppLanguageType,
  REQ_STATUS,
  type IAuthLoginPayload,
  type IAuthRegistrationPayload,
  type IConfirmEmailResponse,
  type ILoginResponse,
  type ISendConfirmationLinkResponse,
  type ISignInWithProviderPayload,
  type ISignInWithProviderResponse,
  type ProviderType
} from 'shared'
import { v4 as uuidv4 } from 'uuid'

import { SERVER_ENV } from 'src/app/config/env'
import { AppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'

import { EmailService } from '../email/email.service'
import { USER_I18N } from '../user/user.i18n'
import { UserModel } from '../user/user.model'
import { UserService } from '../user/user.service'

import {
  EMAIL_CONFIRMATION_LINK_LIFE,
  JWT_ACCESS_EXPIRES_INTERVAL,
  REFRESH_TOKEN_EXPIRES_INTERVAL,
  REGISTRATION_RESEND_INTERVAL,
  SEND_CONFIRMATION_LINK_INTERVAL
} from './auth.constants'
import { AUTH_I18N } from './auth.i18n'
import type { ITokenPayload } from './auth.types'

@Injectable()
export class AuthService {
  constructor(private readonly emailService: EmailService, private readonly userService: UserService) {}

  private parseExpires(expires: string | number) {
    if (typeof expires === 'number') {
      return expires * 1000
    }

    const match = expires.match(/^(\d+)([smhd])$/)
    if (!match) {
      return 30 * 24 * 60 * 60 * 1000
    }

    const [, value, unit] = match
    const multipliers = {
      s: 1000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000
    }

    return Number(value) * multipliers[unit as keyof typeof multipliers]
  }

  private getCookieOptions(maxAge: number): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      ...(SERVER_ENV.domain ? { domain: SERVER_ENV.domain } : {}),
      maxAge
    }
  }

  private signToken(id: string, secret: string, expiresIn: string | number) {
    return jwt.sign({ id }, secret, { expiresIn } as SignOptions)
  }

  private setToken(
    response: Response,
    tokenName: 'jwt' | 'refresh-jwt',
    userId: string,
    secret: string,
    expiresIn: string | number
  ) {
    const token = this.signToken(userId, secret, expiresIn)
    response.cookie(tokenName, token, this.getCookieOptions(this.parseExpires(expiresIn)))

    return token
  }

  private getUnauthorizedMessage(language: AppLanguageType) {
    return localizedText(AUTH_I18N.nonAuthorized, language)
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

  async validateRefreshRequest(request: Request) {
    const { language, cookies } = request
    const refreshToken = cookies['refresh-jwt']

    if (!refreshToken) {
      throw new AppError(REQ_STATUS.notAuth, this.getUnauthorizedMessage(language))
    }

    try {
      const decoded = await this.verifyToken(refreshToken, SERVER_ENV.secret.refreshTokenSecret)
      const user = await this.userService.findById(decoded.id)
      const deviceId = cookies['device-id']
      const device = deviceId ? user?.system.device[deviceId] : undefined

      if (!user || !deviceId || !device || device.refreshToken !== refreshToken) {
        throw new AppError(REQ_STATUS.notAuth, this.getUnauthorizedMessage(language))
      }

      return decoded.id
    } catch {
      throw new AppError(REQ_STATUS.notAuth, this.getUnauthorizedMessage(language))
    }
  }

  async updateTokens(userId: string, request: Request, response: Response) {
    this.setToken(response, 'jwt', userId, SERVER_ENV.secret.accessTokenSecret, JWT_ACCESS_EXPIRES_INTERVAL)
    const refreshToken = this.setToken(
      response,
      'refresh-jwt',
      userId,
      SERVER_ENV.secret.refreshTokenSecret,
      REFRESH_TOKEN_EXPIRES_INTERVAL
    )
    const deviceId = request.cookies['device-id'] ?? uuidv4()

    response.cookie('device-id', deviceId, this.getCookieOptions(3_153_600_000_000))

    const user = await this.userService.findById(userId)
    if (!user) {
      return
    }

    const currentDevice = user.system.device[deviceId]
    user.system.device = {
      ...user.system.device,
      [deviceId]: {
        refreshToken,
        socketId: currentDevice?.socketId ?? ''
      }
    }
    user.markModified('system.device')
    await user.save()
  }

  async login(payload: IAuthLoginPayload, request: Request, response: Response): Promise<ILoginResponse> {
    const { language } = request
    const user = await this.userService.findByEmail(payload.email)

    if (!user) {
      throw new AppError(REQ_STATUS.badRequest, localizedText(AUTH_I18N.invalidEmailOrPassword, language))
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.system.password)
    if (!isPasswordValid) {
      throw new AppError(REQ_STATUS.badRequest, localizedText(AUTH_I18N.invalidEmailOrPassword, language))
    }

    if (!user.system.confirmed) {
      throw new AppError(REQ_STATUS.badRequest, localizedText(AUTH_I18N.emailNotConfirmed, language))
    }

    await this.updateTokens(String(user._id), request, response)

    return this.userService.mapUserToDto(user)
  }

  async registration(
    payload: IAuthRegistrationPayload,
    language: AppLanguageType
  ): Promise<ISendConfirmationLinkResponse> {
    const userExistState = await this.userService.isUserExist({
      username: payload.username,
      email: payload.email
    })

    if (userExistState.exists) {
      throw new AppError(REQ_STATUS.badRequest, this.userService.getUserExistMessage(userExistState.reason, language))
    }

    const hashedPassword = await bcrypt.hash(payload.password, 6)
    const user = await this.userService.createUser({
      email: payload.email,
      username: payload.username,
      hashedPassword
    })

    if (!user) {
      throw new AppError(REQ_STATUS.server, localizedText(AUTH_I18N.registrationFailed, language))
    }

    const confirmToken = this.signToken(
      String(user._id),
      SERVER_ENV.secret.emailConfirmSecret,
      EMAIL_CONFIRMATION_LINK_LIFE
    )

    await this.emailService.sendEmailConfirmationEmail({
      email: payload.email,
      language,
      token: confirmToken,
      username: payload.username
    })

    return {
      email: payload.email,
      attempts: user.system.confirmAttempts,
      nextRequestTime: Date.now() + REGISTRATION_RESEND_INTERVAL
    }
  }

  async confirmEmail(
    token: string,
    language: AppLanguageType
  ): Promise<IConfirmEmailResponse & { alreadyConfirmed: boolean }> {
    const decoded = await this.verifyToken(token, SERVER_ENV.secret.emailConfirmSecret)

    const updateResult = await UserModel.updateOne(
      { _id: decoded.id, 'system.confirmed': { $ne: true } },
      { $set: { 'system.confirmed': true } }
    )

    const user = await this.userService.findById(decoded.id)
    if (!user) {
      throw new AppError(REQ_STATUS.badRequest, localizedText(USER_I18N.userNotFound, language))
    }

    return {
      email: user.personal.email,
      alreadyConfirmed: updateResult.modifiedCount !== 1
    }
  }

  async sendConfirmationLink(
    email: string,
    language: AppLanguageType
  ): Promise<ISendConfirmationLinkResponse & { alreadyConfirmed: boolean }> {
    const user = await this.userService.findByEmail(email)

    if (!user) {
      throw new AppError(REQ_STATUS.badRequest, localizedText(USER_I18N.userNotFound, language))
    }

    if (user.system.confirmed) {
      return {
        email: user.personal.email,
        attempts: user.system.confirmAttempts,
        nextRequestTime: Date.now(),
        alreadyConfirmed: true
      }
    }

    if (user.system.confirmAttempts <= 0) {
      throw new AppError(REQ_STATUS.badRequest, localizedText(AUTH_I18N.noConfirmationAttemptsLeft, language))
    }

    const confirmToken = this.signToken(
      String(user._id),
      SERVER_ENV.secret.emailConfirmSecret,
      EMAIL_CONFIRMATION_LINK_LIFE
    )

    await this.emailService.sendEmailConfirmationEmail({
      email: user.personal.email,
      language,
      token: confirmToken,
      username: user.public.username
    })

    user.system.confirmAttempts = Math.max(user.system.confirmAttempts - 1, 0)
    await user.save()

    return {
      email: user.personal.email,
      attempts: user.system.confirmAttempts,
      nextRequestTime: Date.now() + SEND_CONFIRMATION_LINK_INTERVAL,
      alreadyConfirmed: false
    }
  }

  async signInWithProvider(
    payload: ISignInWithProviderPayload,
    request: Request,
    response: Response
  ): Promise<ISignInWithProviderResponse> {
    const { language } = request
    const hashedPassword = await bcrypt.hash(uuidv4(), 6)
    const newUser = await this.userService.createUser({
      username: payload.username,
      email: payload.email,
      provider: payload.provider as ProviderType,
      hashedPassword
    })
    const user = newUser ?? (await this.userService.findByEmail(payload.email))

    if (!user) {
      throw new AppError(REQ_STATUS.badRequest, localizedText(AUTH_I18N.signInWithProviderFailed, language))
    }

    await this.updateTokens(String(user._id), request, response)

    return this.userService.mapUserToDto(user)
  }

  async logout(userId: string, request: Request, response: Response) {
    const deviceId = request.cookies['device-id']
    const user = await this.userService.findById(userId)

    if (user && deviceId && user.system.device[deviceId]) {
      const nextDevices = { ...user.system.device }
      delete nextDevices[deviceId]
      user.system.device = nextDevices
      user.markModified('system.device')
      await user.save()
    }

    for (const cookie of ['jwt', 'refresh-jwt', 'device-id'] as const) {
      response.clearCookie(cookie, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        ...(SERVER_ENV.domain ? { domain: SERVER_ENV.domain } : {})
      })
    }
  }
}
