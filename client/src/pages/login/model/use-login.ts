import { AUTH_ENDPOINTS, type IAuthLoginPayload, type ILoginResponse } from 'global-shared'
import { ref } from 'vue'

import { useUserSession } from 'src/entities/user'
import { useApi } from 'src/shared/api'
import { log } from 'src/shared/lib'

export const useLogin = () => {
  const { doRequest } = useApi()
  const { activateUserSession } = useUserSession()
  const isLoading = ref(false)

  const login = async (payload: IAuthLoginPayload) => {
    isLoading.value = true

    try {
      const response = await doRequest<ILoginResponse>('post', AUTH_ENDPOINTS.login, payload)
      const { payload: user } = response.data

      await activateUserSession(user)
    } catch (error) {
      log('error', 'Login failed', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    login,
    isLoading,
    onLogin: login
  }
}
