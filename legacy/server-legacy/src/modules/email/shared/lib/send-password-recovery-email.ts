import { AppLanguage, REQ_STATUS } from 'common'

import { SERVER_ENV } from 'src/shared/config'
import { AppError } from 'src/shared/lib/app-error'

import { APP_NAME, PASSWORD_RECOVERY_SUBJECT, RESEND_FROM_EMAIL, RESEND_FROM_NAME } from '../config/constants'

import { createResendClient } from './create-resend-client'

export const sendPasswordRecoveryEmail = async ({
  email,
  code,
  language,
  username
}: {
  email: string
  code: string
  language: AppLanguage
  username?: string
}) => {
  const resend = createResendClient(language)
  const from = RESEND_FROM_NAME ? `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>` : RESEND_FROM_EMAIL
  const subject = `${APP_NAME}: ${PASSWORD_RECOVERY_SUBJECT}`
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Password recovery</h2>
      <p>Hello${username ? `, ${username}` : ''}.</p>
      <p>Use this code to continue resetting your password:</p>
      <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
      <p>If you did not request password recovery, you can ignore this message.</p>
    </div>
  `

  if (SERVER_ENV.isDev && !SERVER_ENV.resendApiKey) {
    return { id: 'mock-recovery-email-id' }
  }

  if (!resend) {
    throw new AppError(REQ_STATUS.server, 'Resend client is not configured')
  }

  const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject,
    html
  })

  if (error) {
    throw new AppError(REQ_STATUS.server, error.message, false, error)
  }

  return data
}
