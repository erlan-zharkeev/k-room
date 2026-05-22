import { AppLanguage, REQ_STATUS } from 'common'

import { AppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'
import { log } from 'src/shared/lib/log'

import { APP_NAME, EMAIL_CONFIRMATION_SUBJECT, RESEND_FROM_EMAIL, RESEND_FROM_NAME } from '../config/constants'
import { EMAIL_I18N } from '../config/i18n'

import { buildEmailConfirmationLink } from './build-email-confirmation-link'
import { createResendClient } from './create-resend-client'
import { renderEmailConfirmationHtml } from './render-email-confirmation-html'

export const sendEmailConfirmationEmail = async ({
  email,
  language,
  token,
  username
}: {
  email: string
  language: AppLanguage
  token: string
  username?: string
}) => {
  if (!email) {
    throw new AppError(REQ_STATUS.server, localizedText(EMAIL_I18N.emailRecipientMissing, language))
  }

  if (!token) {
    throw new AppError(REQ_STATUS.server, localizedText(EMAIL_I18N.emailConfirmationTokenMissing, language))
  }

  const resend = createResendClient(language)
  const confirmUrl = buildEmailConfirmationLink(token)
  const from = RESEND_FROM_NAME ? `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>` : RESEND_FROM_EMAIL

  if (!resend) {
    log.warn(`-Mock confirmation email for ${email}: ${confirmUrl}`)
    return { id: 'mock-resend-id' }
  }

  const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject: `${APP_NAME}: ${EMAIL_CONFIRMATION_SUBJECT}`,
    html: renderEmailConfirmationHtml({ confirmUrl, username })
  })

  if (error) {
    throw new AppError(REQ_STATUS.server, error.message, false, error)
  }

  log.success(`-Confirmation email scheduled for ${email}. Resend id: ${data?.id ?? 'unknown'}`)

  return data
}
