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

import { getLocalizedText, log } from 'src/shared/lib'

export const sendEmailConfirmationEmail = async ({
  email,
  token,
  username
}: {
  email: string
  token: string
  username?: string
}) => {
  if (!email) {
    throw new Error(getLocalizedText(EMAIL_I18N.emailRecipientMissing))
  }

  if (!token) {
    throw new Error(getLocalizedText(EMAIL_I18N.emailConfirmationTokenMissing))
  }

  const resend = createResendClient()
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
    throw new Error(error.message)
  }

  log.success(`-Confirmation email scheduled for ${email}. Resend id: ${data?.id ?? 'unknown'}`)

  return data
}
