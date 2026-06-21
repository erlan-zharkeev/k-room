import { useLocalStorage } from '@vueuse/core'

import { CLIENT_SESSION_LOCAL_STORAGE_KEY } from '../config/constants'

const logoutStatus = useLocalStorage<'failed' | null>(CLIENT_SESSION_LOCAL_STORAGE_KEY.LogoutStatus, null)

export const useClientLogoutStatus = () => {
  const clearLogoutStatus = () => {
    logoutStatus.value = null
  }

  const isLogoutFailed = () => logoutStatus.value === 'failed'

  const markLogoutFailed = () => {
    logoutStatus.value = 'failed'
  }

  return {
    clearLogoutStatus,
    isLogoutFailed,
    markLogoutFailed
  }
}
