import { IncomingHttpHeaders } from 'http'

import { APP_LANGUAGE_HEADER, APP_LANGUAGE_VALUES, AppLanguage, DEFAULT_APP_LANGUAGE } from 'common'

import { SocketInstance } from 'src/shared/config'

const isRequestLanguageValid = (language?: string): language is AppLanguage =>
  APP_LANGUAGE_VALUES.includes(language as AppLanguage)

export const getRequestLanguage = (headers: IncomingHttpHeaders): AppLanguage => {
  const languageHeader = headers[APP_LANGUAGE_HEADER]
  let preResult
  if (typeof languageHeader === 'string') preResult = languageHeader
  if (Array.isArray(languageHeader) && languageHeader[0]) preResult = languageHeader[0]
  return isRequestLanguageValid(preResult) ? preResult : DEFAULT_APP_LANGUAGE
}

export const getSocketLanguage = (socket: SocketInstance): AppLanguage => {
  const authLanguage =
    typeof socket.handshake.auth === 'object' && socket.handshake.auth
      ? Reflect.get(socket.handshake.auth, 'language')
      : undefined
  return isRequestLanguageValid(authLanguage) ? authLanguage : DEFAULT_APP_LANGUAGE
}
