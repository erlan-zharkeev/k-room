import { createResendClient } from 'src/features/email'

import { ENV } from 'src/shared/config'

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
      <p>Use this code to continue resetting your password:</p>
      <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
      <p>If you did not request password recovery, you can ignore this message.</p>
    </div>
  `

  if (ENV.IS_DEV && !ENV.RESEND_API_KEY) {
    return { id: 'mock-recovery-email-id' }
  }

  if (!resend) {
    throw new Error('Resend client is not configured')
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
