import { Resend } from 'resend'

import { EMAIL_MESSAGE } from 'features/email'

import { ENV } from 'shared-config'

let resendClient: Resend | null = null

export const createResendClient = () => {
  if (resendClient) return resendClient

  if (!ENV.RESEND_API_KEY) {
    throw new Error(EMAIL_MESSAGE.resendApiKeyMissing)
  }

  resendClient = new Resend(ENV.RESEND_API_KEY)

  return resendClient
}
