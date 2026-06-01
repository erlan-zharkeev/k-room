import { type IncomingHttpHeaders } from 'http'

import {
  APP_LANGUAGE_HEADER,
  APP_LANGUAGE_VALUES,
  DEFAULT_APP_LANGUAGE,
  isString,
  isUnknownObject,
  type AppLanguage
} from 'global-shared'

import type { SocketInstance } from '../types'

const isRequestLanguage = (value?: string): value is AppLanguage => {
  return APP_LANGUAGE_VALUES.includes(value as AppLanguage)
}

export const getRequestLanguage = (headers: IncomingHttpHeaders): AppLanguage => {
  const language = headers[APP_LANGUAGE_HEADER]

  if (isString(language) && isRequestLanguage(language)) {
    return language
  }

  if (Array.isArray(language) && isString(language[0]) && isRequestLanguage(language[0])) {
    return language[0]
  }

  return DEFAULT_APP_LANGUAGE
}

export const getSocketLanguage = (socket: SocketInstance): AppLanguage => {
  const language = isUnknownObject(socket.handshake.auth) ? Reflect.get(socket.handshake.auth, 'language') : undefined

  return isString(language) && isRequestLanguage(language) ? language : DEFAULT_APP_LANGUAGE
}
