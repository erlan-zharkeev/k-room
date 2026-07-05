import axios from 'axios'
import { APP_LANGUAGE_HEADER, DEFAULT_APP_LANGUAGE, type AppLanguage } from 'global-shared'

import { syncNativeAuthSessionFromHeaders } from '../native-auth-session'

axios.defaults.withCredentials = true

export const httpClient = axios

httpClient.interceptors.response.use((response) => {
  syncNativeAuthSessionFromHeaders(response.headers)

  return response
})

export const setHttpClientLanguage = (language: AppLanguage = DEFAULT_APP_LANGUAGE) => {
  httpClient.defaults.headers.common[APP_LANGUAGE_HEADER] = language
}
