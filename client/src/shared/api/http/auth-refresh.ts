import { AUTH_ENDPOINTS } from 'global-shared'

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
          'Content-Type': 'application/json'
        },
        responseType: 'json'
      })
      .finally(() => {
        authRefreshPromise = null
      })
  }

  return authRefreshPromise
}
