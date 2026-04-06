import { AppLanguageType, StatusEnum } from 'common'

import {
  APP_NAME,
  createResendClient,
  PASSWORD_RECOVERY_SUBJECT,
  RESEND_FROM_EMAIL,
  RESEND_FROM_NAME
} from 'src/features/email'

import { SERVER_ENV } from 'src/shared/config'
import { AppError } from 'src/shared/lib'

export const sendPasswordRecoveryEmail = async ({
  email,
  code,
  language,
  username
}: {
  email: string
  code: string
  language: AppLanguageType
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
    throw new AppError(StatusEnum.Server, 'Resend client is not configured')
  }

  const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject,
    html
  })

  if (error) {
    throw new AppError(StatusEnum.Server, error.message, false, error)
  }

  return data
}
