import { type IncomingHttpHeaders } from 'http'

import { APP_LANGUAGE_HEADER, APP_LANGUAGE_VALUES, DEFAULT_APP_LANGUAGE, type AppLanguageType } from 'shared'

const isRequestLanguage = (value?: string): value is AppLanguageType => {
  return APP_LANGUAGE_VALUES.includes(value as AppLanguageType)
}

export const getRequestLanguage = (headers: IncomingHttpHeaders): AppLanguageType => {
  const language = headers[APP_LANGUAGE_HEADER]

  if (typeof language === 'string' && isRequestLanguage(language)) {
    return language
  }

  if (Array.isArray(language) && typeof language[0] === 'string' && isRequestLanguage(language[0])) {
    return language[0]
  }

  return DEFAULT_APP_LANGUAGE
}
