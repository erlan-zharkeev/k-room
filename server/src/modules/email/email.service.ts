import { Injectable } from '@nestjs/common'
import { ROUTE_NAMES, type AppLanguageType, REQ_STATUS } from 'global-shared'
import { Resend } from 'resend'

import { SERVER_ENV } from 'src/app/env'
import { AppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'
import { log } from 'src/shared/lib/log'

import { EMAIL_I18N } from './email.i18n'
import { renderEmailConfirmationHtml } from './render-email-confirmation-html'

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
      log.warn(`-Mock confirmation email for ${email}: ${confirmUrl}`)
      return { id: 'mock-resend-id' }
    }

    const { data, error } = await resend.emails.send({
      from: `${this.appName} <no-reply@k-room.space>`,
      to: email,
      subject: `${this.appName}: Confirm your email`,
      html: renderEmailConfirmationHtml({
        appName: this.appName,
        confirmUrl,
        username
      })
    })

    if (error) {
      throw new AppError(REQ_STATUS.server, error.message, false, error)
    }

    log.success(`-Confirmation email scheduled for ${email}. Resend id: ${data?.id ?? 'unknown'}`)

    return data
  }

  async sendPasswordRecoveryEmail({
    email,
    code,
    language,
    username
  }: {
    email: string
    code: string
    language: AppLanguageType
    username?: string
  }) {
    if (!email) {
      throw new AppError(REQ_STATUS.server, localizedText(EMAIL_I18N.emailRecipientMissing, language))
    }

    const resend = this.createResendClient(language)
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password recovery</h2>
        <p>Hello${username ? `, ${username}` : ''}.</p>
        <p>Use this code to continue resetting your password:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
        <p>If you did not request password recovery, you can ignore this message.</p>
      </div>
    `

    if (!resend) {
      log.warn(`-Mock password recovery email for ${email}: ${code}`)
      return { id: 'mock-recovery-email-id' }
    }

    const { data, error } = await resend.emails.send({
      from: `${this.appName} <no-reply@k-room.space>`,
      to: email,
      subject: `${this.appName}: Password recovery code`,
      html
    })

    if (error) {
      throw new AppError(REQ_STATUS.server, error.message, false, error)
    }

    log.success(`-Password recovery email scheduled for ${email}. Resend id: ${data?.id ?? 'unknown'}`)

    return data
  }
}
