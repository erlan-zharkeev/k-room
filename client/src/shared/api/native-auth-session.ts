import {
  NATIVE_AUTH_ACCESS_TOKEN_HEADER,
  NATIVE_AUTH_CLIENT_HEADER,
  NATIVE_AUTH_DEVICE_ID_HEADER,
  NATIVE_AUTH_REFRESH_TOKEN_HEADER,
  isString,
  isUnknownObject,
  type NativeAuthSession
} from 'global-shared'

import { getClientPlatform } from 'src/shared/lib'

import { getHeaderValue } from './http/get-header-value'
import { NATIVE_AUTH_CLIENT_HEADER_VALUE, NATIVE_AUTH_SESSION_STORAGE_KEY } from './native-auth-session.constants'

const isNativeAuthSessionEnabled = () => getClientPlatform() === 'native'

const isNativeAuthSession = (value: unknown): value is NativeAuthSession => {
  if (!isUnknownObject(value)) return false

  return (
    isString(value.accessToken) &&
    isString(value.deviceId) &&
    isString(value.refreshToken) &&
    Boolean(value.accessToken) &&
    Boolean(value.deviceId) &&
    Boolean(value.refreshToken)
  )
}

export const readNativeAuthSession = (): NativeAuthSession | null => {
  if (!isNativeAuthSessionEnabled()) return null

  try {
    const storedSession = window.localStorage.getItem(NATIVE_AUTH_SESSION_STORAGE_KEY)

    if (!storedSession) return null

    const session = JSON.parse(storedSession) as unknown

    return isNativeAuthSession(session) ? session : null
  } catch {
    return null
  }
}

export const saveNativeAuthSession = (session: NativeAuthSession) => {
  if (!isNativeAuthSessionEnabled()) return

  try {
    window.localStorage.setItem(NATIVE_AUTH_SESSION_STORAGE_KEY, JSON.stringify(session))
  } catch {
    return
  }
}

export const clearNativeAuthSession = () => {
  if (!isNativeAuthSessionEnabled()) return

  try {
    window.localStorage.removeItem(NATIVE_AUTH_SESSION_STORAGE_KEY)
  } catch {
    return
  }
}

export const syncNativeAuthSessionFromHeaders = (headers: Record<string, unknown>) => {
  if (!isNativeAuthSessionEnabled()) return

  const accessToken = getHeaderValue(headers[NATIVE_AUTH_ACCESS_TOKEN_HEADER])
  const refreshToken = getHeaderValue(headers[NATIVE_AUTH_REFRESH_TOKEN_HEADER])
  const deviceId = getHeaderValue(headers[NATIVE_AUTH_DEVICE_ID_HEADER])

  if (!accessToken || !refreshToken || !deviceId) return

  saveNativeAuthSession({
    accessToken,
    deviceId,
    refreshToken
  })
}

export const buildNativeAuthRequestHeaders = () => {
  if (!isNativeAuthSessionEnabled()) return {}

  const session = readNativeAuthSession()

  return {
    [NATIVE_AUTH_CLIENT_HEADER]: NATIVE_AUTH_CLIENT_HEADER_VALUE,
    ...(session
      ? {
          [NATIVE_AUTH_ACCESS_TOKEN_HEADER]: session.accessToken,
          [NATIVE_AUTH_DEVICE_ID_HEADER]: session.deviceId
        }
      : {})
  }
}

export const buildNativeAuthRefreshHeaders = () => {
  const session = readNativeAuthSession()

  return {
    ...buildNativeAuthRequestHeaders(),
    ...(session ? { [NATIVE_AUTH_REFRESH_TOKEN_HEADER]: session.refreshToken } : {})
  }
}
