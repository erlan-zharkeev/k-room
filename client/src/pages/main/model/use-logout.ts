import { AUTH_ENDPOINTS } from 'global-shared'
import { ref } from 'vue'

import { useUserSession } from 'src/entities/user'
import { useApi } from 'src/shared/api'
import { LOCAL_STORAGE_KEY } from 'src/shared/config'

export const useLogout = () => {
  const { doRequest } = useApi()
  const isLogoutLoading = ref(false)
  const { resetClientSession } = useUserSession()

  const logout = async () => {
    isLogoutLoading.value = true

    try {
      await doRequest('post', AUTH_ENDPOINTS.logout)
      localStorage.removeItem(LOCAL_STORAGE_KEY.LogoutStatus)
    } catch {
      localStorage.setItem(LOCAL_STORAGE_KEY.LogoutStatus, 'failed')
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
