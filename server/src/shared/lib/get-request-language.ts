import { type IncomingHttpHeaders } from 'http'

import {
  APP_LANGUAGE_HEADER,
  APP_LANGUAGE_VALUES,
  DEFAULT_APP_LANGUAGE,
  isUnknownObject,
  type AppLanguageType
} from 'global-shared'
import { isString } from 'lodash'

import type { SocketInstanceType } from '../types/socket'

const isRequestLanguage = (value?: string): value is AppLanguageType => {
  return APP_LANGUAGE_VALUES.includes(value as AppLanguageType)
}

export const getRequestLanguage = (headers: IncomingHttpHeaders): AppLanguageType => {
  const language = headers[APP_LANGUAGE_HEADER]

  if (isString(language) && isRequestLanguage(language)) {
    return language
  }

  if (Array.isArray(language) && isString(language[0]) && isRequestLanguage(language[0])) {
    return language[0]
  }

  return DEFAULT_APP_LANGUAGE
}

export const getSocketLanguage = (socket: SocketInstanceType): AppLanguageType => {
  const language = isUnknownObject(socket.handshake.auth) ? Reflect.get(socket.handshake.auth, 'language') : undefined

  return isString(language) && isRequestLanguage(language) ? language : DEFAULT_APP_LANGUAGE
}
