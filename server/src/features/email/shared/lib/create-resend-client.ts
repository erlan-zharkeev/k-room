import { Resend } from 'resend'

import { AppLanguageType, StatusEnum } from 'common'

import { EMAIL_I18N } from 'src/features/email'

import { SERVER_ENV } from 'src/shared/config'
import { AppError, localizedText } from 'src/shared/lib'

let resendClient: Resend | null = null

export const createResendClient = (language: AppLanguageType) => {
  if (resendClient) return resendClient

  if (!SERVER_ENV.resendApiKey) {
    if (SERVER_ENV.isDev) {
      return null
    }

    throw new AppError(StatusEnum.Server, localizedText(EMAIL_I18N.resendApiKeyMissing, language))
  }

  resendClient = new Resend(SERVER_ENV.resendApiKey)

  return resendClient
}
