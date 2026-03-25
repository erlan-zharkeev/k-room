import {
  buildEmailConfirmationLink,
  createResendClient,
  EMAIL_CONFIRMATION_SUBJECT,
  EMAIL_MESSAGE,
  renderEmailConfirmationHtml
} from 'features/email'

import { ENV } from 'shared-config'
import { getLocalizedText, log } from 'shared-lib'

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
    throw new Error(getLocalizedText(EMAIL_MESSAGE.emailRecipientMissing))
  }

  if (!token) {
    throw new Error(getLocalizedText(EMAIL_MESSAGE.emailConfirmationTokenMissing))
  }

  if (!ENV.RESEND_FROM_EMAIL) {
    throw new Error(getLocalizedText(EMAIL_MESSAGE.resendFromEmailMissing))
  }

  const resend = createResendClient()
  const confirmUrl = buildEmailConfirmationLink(token)
  const from = ENV.RESEND_FROM_NAME ? `${ENV.RESEND_FROM_NAME} <${ENV.RESEND_FROM_EMAIL}>` : ENV.RESEND_FROM_EMAIL

  if (!resend) {
    log.warn(`-Mock confirmation email for ${email}: ${confirmUrl}`)
    return { id: 'mock-resend-id' }
  }

  const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject: `${ENV.APP_NAME}: ${EMAIL_CONFIRMATION_SUBJECT}`,
    html: renderEmailConfirmationHtml({ confirmUrl, username })
  })

  if (error) {
    throw new Error(error.message)
  }

  log.success(`-Confirmation email scheduled for ${email}. Resend id: ${data?.id ?? 'unknown'}`)

  return data
}
