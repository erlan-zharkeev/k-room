import { Resend } from 'resend'

import { EMAIL_I18N } from 'src/features/email'

import { ENV } from 'src/shared/config'
import { getLocalizedText } from 'src/shared/lib'

let resendClient: Resend | null = null

export const createResendClient = () => {
  if (resendClient) return resendClient

  if (!ENV.RESEND_API_KEY) {
    if (ENV.IS_DEV) {
      return null
    }

    throw new Error(getLocalizedText(EMAIL_I18N.resendApiKeyMissing))
  }

  resendClient = new Resend(ENV.RESEND_API_KEY)

  return resendClient
}
