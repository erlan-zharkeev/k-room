import { AppLanguageType, StatusEnum } from 'common'

import {
  APP_NAME,
  buildEmailConfirmationLink,
  createResendClient,
  EMAIL_CONFIRMATION_SUBJECT,
  EMAIL_I18N,
  renderEmailConfirmationHtml,
  RESEND_FROM_EMAIL,
  RESEND_FROM_NAME,
} from 'src/features/email'

import { AppError, localizedText, log } from 'src/shared/lib'

export const sendEmailConfirmationEmail = async ({
  email,
  language,
  token,
  username
}: {
  email: string
  language: AppLanguageType
  token: string
  username?: string
}) => {
  if (!email) {
    throw new AppError(StatusEnum.Server, localizedText(EMAIL_I18N.emailRecipientMissing, language))
  }

  if (!token) {
    throw new AppError(StatusEnum.Server, localizedText(EMAIL_I18N.emailConfirmationTokenMissing, language))
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
    throw new AppError(StatusEnum.Server, error.message, false, error)
  }

  log.success(`-Confirmation email scheduled for ${email}. Resend id: ${data?.id ?? 'unknown'}`)

  return data
}
