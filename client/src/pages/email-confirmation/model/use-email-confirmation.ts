import { AUTH_ENDPOINTS, type IConfirmEmailResponse } from 'global-shared'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { socket, useApi } from 'src/shared/api'
import { clearCookie, log } from 'src/shared/lib'

export const useEmailConfirmation = () => {
  const route = useRoute()
  const { doRequest } = useApi()
  const email = ref('')
  const isConfirmed = ref(false)
  const isLoading = ref(true)

  const confirmEmail = async () => {
    const { token } = route.query

    if (typeof token !== 'string') {
      isLoading.value = false
      return
    }

    try {
      const response = await doRequest<IConfirmEmailResponse>('post', AUTH_ENDPOINTS.confirmEmail, { token })

      email.value = response.data.payload.email
      isConfirmed.value = true
      clearCookie()
      socket.disconnect()
    } catch (error) {
      log('error', 'Email confirmation failed', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    confirmEmail,
    email,
    isConfirmed,
    isLoading
  }
}
