import { createResendClient } from 'features/email'

import { ENV } from 'shared-config'
import { log } from 'shared-lib'

export const sendPasswordRecoveryEmail = async ({
  email,
  code,
  username
}: {
  email: string
  code: string
  username?: string
}) => {
  const resend = createResendClient()
  const from = ENV.RESEND_FROM_NAME ? `${ENV.RESEND_FROM_NAME} <${ENV.RESEND_FROM_EMAIL}>` : ENV.RESEND_FROM_EMAIL
  const subject = `${ENV.APP_NAME}: Password recovery code`
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Password recovery</h2>
      <p>Hello${username ? `, ${username}` : ''}.</p>
      <p>Your password recovery code is:</p>
      <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">${code}</p>
      <p>If you did not request this code, you can ignore this message.</p>
    </div>
  `

  if (!resend) {
    log.warn(`-Mock password recovery email for ${email}: ${code}`)
    return { id: 'mock-recovery-email-id' }
  }

  const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject,
    html
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
