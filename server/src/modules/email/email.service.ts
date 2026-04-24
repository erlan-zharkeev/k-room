import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import { ROUTE_NAMES, type AppLanguageType, REQ_STATUS } from 'shared'

import { SERVER_ENV } from '../../app/config/env'
import { AppError } from '../../shared/lib/app-error'
import { localizedText } from '../../shared/lib/localized-text'

import { EMAIL_I18N } from './email.i18n'

let resendClient: Resend | null = null

@Injectable()
export class EmailService {
  private get appName() {
    return SERVER_ENV.info.appName
  }

  private createResendClient(language: AppLanguageType) {
    if (resendClient) {
      return resendClient
    }

    if (!SERVER_ENV.secret.resendApiKey) {
      if (SERVER_ENV.isDev) {
        return null
      }

      throw new AppError(REQ_STATUS.server, localizedText(EMAIL_I18N.resendApiKeyMissing, language))
    }

    resendClient = new Resend(SERVER_ENV.secret.resendApiKey)

    return resendClient
  }

  private buildEmailConfirmationLink(token: string) {
    const confirmUrl = new URL(ROUTE_NAMES.emailConfirmation, SERVER_ENV.clientUrl)
    confirmUrl.searchParams.set('token', token)

    return confirmUrl.toString()
  }

  async sendEmailConfirmationEmail({
    email,
    language,
    token,
    username
  }: {
    email: string
    language: AppLanguageType
    token: string
    username?: string
  }) {
    if (!email) {
      throw new AppError(REQ_STATUS.server, localizedText(EMAIL_I18N.emailRecipientMissing, language))
    }

    if (!token) {
      throw new AppError(REQ_STATUS.server, localizedText(EMAIL_I18N.emailConfirmationTokenMissing, language))
    }

    const resend = this.createResendClient(language)
    const confirmUrl = this.buildEmailConfirmationLink(token)

    if (!resend) {
      console.warn(`Mock confirmation email for ${email}: ${confirmUrl}`)
      return { id: 'mock-resend-id' }
    }

    const { data, error } = await resend.emails.send({
      from: `${this.appName} <no-reply@k-room.space>`,
      to: email,
      subject: `${this.appName}: Confirm your email`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #101828; line-height: 1.6;">
          <h2 style="margin-bottom: 16px;">${this.appName}</h2>
          <p>${username ? `Hi, ${username}!` : 'Hi!'}</p>
          <p>Please confirm your email address to finish registration.</p>
          <p>
            <a href="${confirmUrl}" style="display: inline-block; padding: 12px 18px; border-radius: 8px; background: #101828; color: #ffffff; text-decoration: none;">
              Confirm email
            </a>
          </p>
          <p>If the button does not work, open this link manually:</p>
          <p><a href="${confirmUrl}">${confirmUrl}</a></p>
        </div>
      `
    })

    if (error) {
      throw new AppError(REQ_STATUS.server, error.message, false, error)
    }

    return data
  }
}
