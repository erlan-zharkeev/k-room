import { Injectable } from '@nestjs/common'
import bcrypt from 'bcryptjs'
import { type Request, type Response, type CookieOptions } from 'express'
import {
  type AppLanguageType,
  formatNickname,
  REQ_STATUS,
  type IAuthLoginPayload,
  type IAuthRegistrationPayload,
  type IConfirmEmailResponse,
  type ILoginResponse,
  type ISendConfirmationLinkResponse,
  type ISignInWithProviderPayload,
  type ISignInWithProviderResponse,
  type ProviderType
} from 'global-shared'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import { SERVER_ENV } from 'src/app/env'
import { AppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'

import { EmailService } from '../email/email.service'
import { USER_I18N } from '../user/user.i18n'
import { UserModel } from '../user/user.model'
import { loadGoogleAvatar, updateUserAvatar, UserService } from '../user/user.service'

import {
  DEVICE_COOKIE_MAX_AGE_MS,
  EMAIL_CONFIRMATION_LINK_LIFE_SECONDS,
  JWT_ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  REGISTRATION_RESEND_INTERVAL_MS,
  SEND_CONFIRMATION_LINK_INTERVAL_MS
} from './auth.constants'
import { AUTH_I18N } from './auth.i18n'
import type { ITokenPayload } from './auth.types'
import { parseTokenExpires } from './lib/parse-token-expires'

@Injectable()
export class AuthService {
  constructor(private readonly emailService: EmailService, private readonly userService: UserService) {}

  private getCookieOptions(maxAgeMs: number): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      ...(SERVER_ENV.domain ? { domain: SERVER_ENV.domain } : {}),
      maxAge: maxAgeMs
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
    response.cookie(tokenName, token, this.getCookieOptions(parseTokenExpires(expiresIn)))

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
    this.setToken(response, 'jwt', userId, SERVER_ENV.secret.accessTokenSecret, JWT_ACCESS_TOKEN_EXPIRES_IN)
    const refreshToken = this.setToken(
      response,
      'refresh-jwt',
      userId,
      SERVER_ENV.secret.refreshTokenSecret,
      REFRESH_TOKEN_EXPIRES_IN
    )
    const deviceId = request.cookies['device-id'] ?? uuidv4()

    response.cookie('device-id', deviceId, this.getCookieOptions(DEVICE_COOKIE_MAX_AGE_MS))

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
    const user = await this.userService.findByLogin(payload.login)

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
      nickname: payload.nickname,
      email: payload.email
    })

    if (userExistState.exists) {
      throw new AppError(REQ_STATUS.badRequest, this.userService.getUserExistMessage(userExistState.reason, language))
    }

    const hashedPassword = await bcrypt.hash(payload.password, 6)
    const user = await this.userService.createUser({
      email: payload.email,
      nickname: payload.nickname,
      hashedPassword
    })

    if (!user) {
      throw new AppError(REQ_STATUS.server, localizedText(AUTH_I18N.registrationFailed, language))
    }

    const confirmToken = this.signToken(
      String(user._id),
      SERVER_ENV.secret.emailConfirmSecret,
      EMAIL_CONFIRMATION_LINK_LIFE_SECONDS
    )

    await this.emailService.sendEmailConfirmationEmail({
      email: payload.email,
      language,
      token: confirmToken,
      nickname: formatNickname(payload.nickname)
    })

    return {
      email: payload.email,
      attempts: user.system.confirmAttempts,
      nextRequestTime: Date.now() + REGISTRATION_RESEND_INTERVAL_MS
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
      EMAIL_CONFIRMATION_LINK_LIFE_SECONDS
    )

    await this.emailService.sendEmailConfirmationEmail({
      email: user.personal.email,
      language,
      token: confirmToken,
      nickname: formatNickname(user.public.nickname)
    })

    user.system.confirmAttempts = Math.max(user.system.confirmAttempts - 1, 0)
    await user.save()

    return {
      email: user.personal.email,
      attempts: user.system.confirmAttempts,
      nextRequestTime: Date.now() + SEND_CONFIRMATION_LINK_INTERVAL_MS,
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
      nickname: payload.nickname,
      email: payload.email,
      provider: payload.provider as ProviderType,
      hashedPassword
    })
    const user = newUser ?? (await this.userService.findByEmail(payload.email))

    if (newUser && payload.avatar) {
      const buffer = await loadGoogleAvatar(payload.avatar)

      if (buffer) {
        await updateUserAvatar(buffer, String(newUser._id), language)
      }
    }

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
