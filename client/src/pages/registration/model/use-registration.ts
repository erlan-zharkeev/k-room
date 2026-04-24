import { ref } from 'vue'

import type { RegistrationFormDataType } from './types'

export const useRegistration = () => {
  const isLoading = ref(false)

  const onRegister = (_payload: RegistrationFormDataType) => {}

  return {
    isLoading,
    onRegister
  }
}
