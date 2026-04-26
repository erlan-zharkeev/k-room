import { AUTH_ENDPOINTS, ROUTE_NAMES, type IConfirmEmailResponse } from 'global-shared'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { socket, useApi } from 'src/shared/api'
import { clearCookie, log } from 'src/shared/lib'

export const useEmailConfirmation = () => {
  const route = useRoute()
  const router = useRouter()
  const { doRequest } = useApi()
  const email = ref('')
  const isLoading = ref(true)

  const confirmEmail = async () => {
    const { token } = route.query

    if (typeof token !== 'string') {
      await router.push(ROUTE_NAMES.login)
      return
    }

    try {
      const response = await doRequest<IConfirmEmailResponse>('post', AUTH_ENDPOINTS.confirmEmail, { token })

      email.value = response.data.payload.email
      clearCookie()
      socket.disconnect()
    } catch (error) {
      log('error', 'Email confirmation failed', error)
      await router.push(ROUTE_NAMES.login)
    } finally {
      isLoading.value = false
    }
  }

  return {
    confirmEmail,
    email,
    isLoading
  }
}
