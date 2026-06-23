import { Injectable } from '@nestjs/common'
import { ROUTE_NAMES, REQ_STATUS } from 'global-shared'
import { Resend } from 'resend'

import { SERVER_ENV } from 'src/app/env'
import { AppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'
import { log } from 'src/shared/lib/log'

import { EMAIL_I18N } from './email.i18n'
import type { SendEmailCodeEmailPayload, SendEmailConfirmationEmailPayload } from './email.types'
import { buildEmailGreeting } from './lib/build-email-greeting'
import { renderEmailCodeHtml } from './lib/render-email-code-html'
import { renderEmailConfirmationHtml } from './lib/render-email-confirmation-html'

let resendClient: Resend | null = null

@Injectable()
export class EmailService {
  private createResendClient() {
    if (SERVER_ENV.stage === 'test' || SERVER_ENV.isE2E) {
      return null
    }

    if (resendClient) {
      return resendClient
    }

    if (!SERVER_ENV.secret.resendApiKey) {
      if (SERVER_ENV.isDev) {
        return null
      }

      throw new AppError(REQ_STATUS.server, EMAIL_I18N.resendApiKeyMissing)
    }

    resendClient = new Resend(SERVER_ENV.secret.resendApiKey)

    return resendClient
  }

  private buildEmailConfirmationLink(token: string) {
    const confirmUrl = new URL(ROUTE_NAMES.emailConfirmation, SERVER_ENV.clientUrl)
    confirmUrl.searchParams.set('token', token)

    return confirmUrl.toString()
  }

  async sendEmailConfirmationEmail({ email, language, token, nickname }: SendEmailConfirmationEmailPayload) {
    if (!email) {
      throw new AppError(REQ_STATUS.server, EMAIL_I18N.emailRecipientMissing)
    }

    if (!token) {
      throw new AppError(REQ_STATUS.server, EMAIL_I18N.emailConfirmationTokenMissing)
    }

    const resend = this.createResendClient()
    const confirmUrl = this.buildEmailConfirmationLink(token)
    const { appName } = SERVER_ENV.info

    if (!resend) {
      log.warn(`-Mock confirmation email for ${email}: ${confirmUrl}`)
      return { id: 'mock-resend-id' }
    }

    const { data, error } = await resend.emails.send({
      from: `${appName} <no-reply@k-room.space>`,
      to: email,
      subject: `${appName}: ${localizedText(EMAIL_I18N.emailConfirmationSubject, language)}`,
      html: renderEmailConfirmationHtml({
        appName,
        confirmEmailButtonText: localizedText(EMAIL_I18N.emailConfirmationButton, language),
        confirmationText: localizedText(EMAIL_I18N.emailConfirmationText, language),
        confirmUrl,
        fallbackLinkText: localizedText(EMAIL_I18N.emailConfirmationFallbackLink, language),
        greeting: buildEmailGreeting({
          greeting: localizedText(EMAIL_I18N.emailConfirmationGreeting, language),
          nickname,
          punctuation: '!'
        })
      })
    })

    if (error) {
      throw new AppError(REQ_STATUS.server, error.message, false, error)
    }

    log.success(`-Confirmation email scheduled for ${email}. Resend id: ${data?.id ?? 'unknown'}`)

    return data
  }

  async sendPasswordRecoveryEmail({ email, language, code, nickname }: SendEmailCodeEmailPayload) {
    if (!email) {
      throw new AppError(REQ_STATUS.server, EMAIL_I18N.emailRecipientMissing)
    }

    const resend = this.createResendClient()
    const { appName } = SERVER_ENV.info
    const html = renderEmailCodeHtml({
      code,
      greeting: buildEmailGreeting({
        greeting: localizedText(EMAIL_I18N.emailGreeting, language),
        nickname,
        punctuation: '.'
      }),
      ignoreText: localizedText(EMAIL_I18N.passwordRecoveryIgnoreText, language),
      text: localizedText(EMAIL_I18N.passwordRecoveryCodeText, language),
      title: localizedText(EMAIL_I18N.passwordRecoveryTitle, language)
    })

    if (!resend) {
      log.warn(`-Mock password recovery email for ${email}: ${code}`)
      return { id: 'mock-recovery-email-id' }
    }

    const { data, error } = await resend.emails.send({
      from: `${appName} <no-reply@k-room.space>`,
      to: email,
      subject: `${appName}: ${localizedText(EMAIL_I18N.passwordRecoveryCodeSubject, language)}`,
      html
    })

    if (error) {
      throw new AppError(REQ_STATUS.server, error.message, false, error)
    }

    log.success(`-Password recovery email scheduled for ${email}. Resend id: ${data?.id ?? 'unknown'}`)

    return data
  }

  async sendChangeEmailCodeEmail({ email, language, code, nickname }: SendEmailCodeEmailPayload) {
    if (!email) {
      throw new AppError(REQ_STATUS.server, EMAIL_I18N.emailRecipientMissing)
    }

    const resend = this.createResendClient()
    const { appName } = SERVER_ENV.info
    const html = renderEmailCodeHtml({
      code,
      greeting: buildEmailGreeting({
        greeting: localizedText(EMAIL_I18N.emailGreeting, language),
        nickname,
        punctuation: '.'
      }),
      ignoreText: localizedText(EMAIL_I18N.emailChangeIgnoreText, language),
      text: localizedText(EMAIL_I18N.emailChangeCodeText, language),
      title: localizedText(EMAIL_I18N.emailChangeTitle, language)
    })

    if (!resend) {
      log.warn(`-Mock email change code for ${email}: ${code}`)
      return { id: 'mock-change-email-id' }
    }

    const { data, error } = await resend.emails.send({
      from: `${appName} <no-reply@k-room.space>`,
      to: email,
      subject: `${appName}: ${localizedText(EMAIL_I18N.emailChangeCodeSubject, language)}`,
      html
    })

    if (error) {
      throw new AppError(REQ_STATUS.server, error.message, false, error)
    }

    log.success(`-Email change code scheduled for ${email}. Resend id: ${data?.id ?? 'unknown'}`)

    return data
  }
}
