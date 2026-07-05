import { AxiosError } from 'axios'
import { AUTH_ENDPOINTS, REQ_STATUS } from 'global-shared'

import { buildNativeAuthRefreshHeaders, clearNativeAuthSession } from '../native-auth-session'

import { httpClient } from './http-client'

let authRefreshPromise: Promise<unknown> | null = null
let authRefreshBlocked = false

export const blockAuthRefresh = () => {
  authRefreshBlocked = true
}

export const allowAuthRefresh = () => {
  authRefreshBlocked = false
}

export const shouldSkipAuthRefresh = () => authRefreshBlocked

export const refreshAuthTokens = () => {
  if (!authRefreshPromise) {
    authRefreshPromise = httpClient
      .request({
        method: 'post',
        url: `${__CLIENT_ENV_DATA__.apiBaseUrl}${AUTH_ENDPOINTS.updateTokensPair}`,
        headers: {
          'Content-Type': 'application/json',
          ...buildNativeAuthRefreshHeaders()
        },
        responseType: 'json'
      })
      .catch((error) => {
        if (error instanceof AxiosError && error.response?.status === REQ_STATUS.notAuth) {
          clearNativeAuthSession()
        }

        throw error
      })
      .finally(() => {
        authRefreshPromise = null
      })
  }

  return authRefreshPromise
}
