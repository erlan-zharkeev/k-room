import { AUTH_ENDPOINTS, type IConfirmEmailResponse } from 'global-shared'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { socket, useHttp } from 'src/shared/api'
import { clearCookie } from 'src/shared/lib'

export const useEmailConfirmation = () => {
  const route = useRoute()
  const { doHttpRequest } = useHttp()
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
      const response = await doHttpRequest<IConfirmEmailResponse>('post', AUTH_ENDPOINTS.confirmEmail, { token })

      email.value = response.data.payload.email
      isConfirmed.value = true
      clearCookie()
      socket.disconnect()
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
