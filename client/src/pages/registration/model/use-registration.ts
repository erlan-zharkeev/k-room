import {
  AUTH_ENDPOINTS,
  ROUTE_NAMES,
  type IAuthRegistrationPayload,
  type ISendConfirmationLinkResponse
} from 'global-shared'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from 'src/shared/api'
import { buildPathWithParams, log } from 'src/shared/lib'

import type { RegistrationFormDataType } from './types'

export const useRegistration = () => {
  const router = useRouter()
  const { doRequest } = useApi()
  const isLoading = ref(false)

  const register = async (payload: IAuthRegistrationPayload) => {
    isLoading.value = true

    try {
      const response = await doRequest<ISendConfirmationLinkResponse>('post', AUTH_ENDPOINTS.registration, payload)
      const pathname = buildPathWithParams(ROUTE_NAMES.waitEmailConfirm, response.data.payload)

      await router.push(pathname)
    } catch (error) {
      log('error', 'Registration failed', error)
    } finally {
      isLoading.value = false
    }
  }

  const onRegister = ({ email, password, username }: RegistrationFormDataType) => {
    register({ email, password, username })
  }

  return {
    register,
    isLoading,
    onRegister
  }
}
