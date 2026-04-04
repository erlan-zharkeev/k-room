import { IncomingHttpHeaders } from 'http'

import { APP_LANGUAGE_HEADER, APP_LANGUAGE_VALUES, AppLanguageType, DEFAULT_APP_LANGUAGE } from 'common'

import { SocketInstanceType } from 'src/shared/config'

const isRequestLanguageValid = (language?: string): language is AppLanguageType =>
  APP_LANGUAGE_VALUES.includes(language as AppLanguageType)

export const getRequestLanguage = (headers: IncomingHttpHeaders): AppLanguageType => {
  const languageHeader = headers[APP_LANGUAGE_HEADER]
  let preResult
  if (typeof languageHeader === 'string') preResult = languageHeader
  if (Array.isArray(languageHeader) && languageHeader[0]) preResult = languageHeader[0]
  return isRequestLanguageValid(preResult) ? preResult : DEFAULT_APP_LANGUAGE
}

export const getSocketLanguage = (socket: SocketInstanceType): AppLanguageType => {
  const authLanguage =
    typeof socket.handshake.auth === 'object' && socket.handshake.auth
      ? Reflect.get(socket.handshake.auth, 'language')
      : undefined
  return isRequestLanguageValid(authLanguage) ? authLanguage : DEFAULT_APP_LANGUAGE
}
