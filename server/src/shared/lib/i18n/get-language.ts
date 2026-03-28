import type { IncomingHttpHeaders } from 'http'

import { APP_LANGUAGE, APP_LANGUAGE_HEADER, type AppLanguageType, DEFAULT_APP_LANGUAGE } from 'common'

import type { SocketInstanceType } from 'src/shared/config'

const normalizeLanguage = (value: string | null | undefined): AppLanguageType | null => {
  if (!value) return null

  const normalizedValue = value.toLowerCase()

  if (normalizedValue.startsWith(APP_LANGUAGE.Ru)) return APP_LANGUAGE.Ru
  if (normalizedValue.startsWith(APP_LANGUAGE.En)) return APP_LANGUAGE.En

  return null
}

const getHeaderLanguageValue = (headers: IncomingHttpHeaders): string | null => {
  const languageHeader = headers[APP_LANGUAGE_HEADER]

  if (Array.isArray(languageHeader)) return languageHeader[0] ?? null
  if (typeof languageHeader === 'string') return languageHeader

  const acceptLanguageHeader = headers['accept-language']

  if (Array.isArray(acceptLanguageHeader)) return acceptLanguageHeader[0] ?? null
  if (typeof acceptLanguageHeader === 'string') return acceptLanguageHeader

  return null
}

export const resolveAppLanguage = (value: string | null | undefined): AppLanguageType => {
  return normalizeLanguage(value) ?? DEFAULT_APP_LANGUAGE
}

export const getRequestLanguage = (headers: IncomingHttpHeaders): AppLanguageType => {
  return resolveAppLanguage(getHeaderLanguageValue(headers))
}

export const getSocketLanguage = (socket: SocketInstanceType): AppLanguageType => {
  const authLanguage =
    typeof socket.handshake.auth === 'object' && socket.handshake.auth
      ? Reflect.get(socket.handshake.auth, 'language')
      : null

  return resolveAppLanguage(typeof authLanguage === 'string' ? authLanguage : null)
}
