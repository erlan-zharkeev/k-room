import { Resend } from 'resend'

import { EMAIL_I18N } from 'src/features/email'

import { SERVER_ENV } from 'src/shared/config'
import { getLocalizedText } from 'src/shared/lib'

let resendClient: Resend | null = null

export const createResendClient = () => {
  if (resendClient) return resendClient

  if (!SERVER_ENV.resendApiKey) {
    if (SERVER_ENV.isDev) {
      return null
    }

    throw new Error(getLocalizedText(EMAIL_I18N.resendApiKeyMissing))
  }

  resendClient = new Resend(SERVER_ENV.resendApiKey)

  return resendClient
}
