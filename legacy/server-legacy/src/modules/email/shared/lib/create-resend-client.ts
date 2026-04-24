import { AppLanguageType, REQ_STATUS } from 'common'
import { Resend } from 'resend'

import { SERVER_ENV } from 'src/shared/config'
import { AppError } from 'src/shared/lib/app-error'
import { localizedText } from 'src/shared/lib/localized-text'

import { EMAIL_I18N } from '../config/i18n'

let resendClient: Resend | null = null

export const createResendClient = (language: AppLanguageType) => {
  if (resendClient) return resendClient

  if (!SERVER_ENV.resendApiKey) {
    if (SERVER_ENV.isDev) {
      return null
    }

    throw new AppError(REQ_STATUS.server, localizedText(EMAIL_I18N.resendApiKeyMissing, language))
  }

  resendClient = new Resend(SERVER_ENV.resendApiKey)

  return resendClient
}
