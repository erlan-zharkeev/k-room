import { USER_ENDPOINTS } from 'global-shared'
import { computed, ref } from 'vue'

import { useApi } from 'src/shared/api'

export const useSettingsChangePasswordCard = () => {
  const { doRequest } = useApi()
  const currentPassword = ref('')
  const nextPassword = ref('')
  const repeatPassword = ref('')
  const isPasswordChanging = ref(false)
  const passwordMismatch = computed(() => Boolean(repeatPassword.value && nextPassword.value !== repeatPassword.value))
  const isPasswordSubmitDisabled = computed(
    () => !currentPassword.value || !nextPassword.value || !repeatPassword.value || passwordMismatch.value
  )

  const changePassword = async () => {
    if (isPasswordSubmitDisabled.value) return

    try {
      isPasswordChanging.value = true
      await doRequest<null>('patch', USER_ENDPOINTS.changePassword, {
        currentPassword: currentPassword.value,
        password: nextPassword.value
      })
      currentPassword.value = ''
      nextPassword.value = ''
      repeatPassword.value = ''
    } finally {
      isPasswordChanging.value = false
    }
  }

  return {
    changePassword,
    currentPassword,
    isPasswordChanging,
    isPasswordSubmitDisabled,
    nextPassword,
    passwordMismatch,
    repeatPassword
  }
}
