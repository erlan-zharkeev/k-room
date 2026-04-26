import { AUTH_ENDPOINTS, ROUTE_NAMES } from 'global-shared'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useResetClientData } from 'src/features/client-session'
import { socket, useApi } from 'src/shared/api'
import { LOCAL_STORAGE_KEY } from 'src/shared/config'
import { clearCookie, log } from 'src/shared/lib'

export const useLogout = () => {
  const router = useRouter()
  const { doRequest } = useApi()
  const { resetClientData } = useResetClientData()
  const isLogoutLoading = ref(false)

  const resetClientSession = async () => {
    await resetClientData()
    clearCookie()
    socket.disconnect()
    await router.push(ROUTE_NAMES.login)
  }

  const logout = async () => {
    isLogoutLoading.value = true

    try {
      await doRequest('post', AUTH_ENDPOINTS.logout)
      localStorage.removeItem(LOCAL_STORAGE_KEY.LogoutStatus)
    } catch (error) {
      localStorage.setItem(LOCAL_STORAGE_KEY.LogoutStatus, 'failed')
      log('error', 'Logout failed', error)
    } finally {
      await resetClientSession()
      isLogoutLoading.value = false
    }
  }

  return {
    isLogoutLoading,
    logout
  }
}
