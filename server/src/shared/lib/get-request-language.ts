import { type IncomingHttpHeaders } from 'http'

import { APP_LANGUAGE_HEADER, APP_LANGUAGE_VALUES, DEFAULT_APP_LANGUAGE, type AppLanguageType } from 'global-shared'

import type { SocketInstanceType } from '../types/socket'

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

export const getSocketLanguage = (socket: SocketInstanceType): AppLanguageType => {
  const language =
    typeof socket.handshake.auth === 'object' && socket.handshake.auth
      ? Reflect.get(socket.handshake.auth, 'language')
      : undefined

  return typeof language === 'string' && isRequestLanguage(language) ? language : DEFAULT_APP_LANGUAGE
}
