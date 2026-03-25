import { Resend } from 'resend'

import { EMAIL_MESSAGE } from 'features/email'

import { ENV } from 'shared-config'
import { getLocalizedText } from 'shared-lib'

let resendClient: Resend | null = null

export const createResendClient = () => {
  if (resendClient) return resendClient

  if (!ENV.RESEND_API_KEY) {
    throw new Error(getLocalizedText(EMAIL_MESSAGE.resendApiKeyMissing))
  }

  resendClient = new Resend(ENV.RESEND_API_KEY)

  return resendClient
}
