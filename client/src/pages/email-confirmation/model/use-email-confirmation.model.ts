import { AUTH_ENDPOINTS, isString, type ConfirmEmailResponse } from 'global-shared'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { getHandledErrorMessage, socket, useHttp } from 'src/shared/api'
import { clearCookie } from 'src/shared/lib'

export const useEmailConfirmation = () => {
  const route = useRoute()
  const { doHttpRequest } = useHttp()
  const email = ref('')
  const failureMessage = ref('')
  const isConfirmed = ref(false)
  const isLoading = ref(true)

  const confirmEmail = async () => {
    const { token } = route.query
    const emailToken = isString(token) ? token : ''

    try {
      const response = await doHttpRequest<ConfirmEmailResponse>('post', AUTH_ENDPOINTS.confirmEmail, {
        token: emailToken
      })

      email.value = response.data.payload.email
      isConfirmed.value = true
      clearCookie()
      socket.disconnect()
    } catch (error) {
      failureMessage.value = getHandledErrorMessage(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    confirmEmail,
    email,
    failureMessage,
    isConfirmed,
    isLoading
  }
}
