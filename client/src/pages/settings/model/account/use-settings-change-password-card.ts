import { createPasswordSchema, createValidationMessages, USER_ENDPOINTS } from 'global-shared'
import * as v from 'valibot'
import { computed, ref } from 'vue'

import { useApi } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'

export const useSettingsChangePasswordCard = () => {
  const { doRequest } = useApi()
  const { t } = useI18n()
  const currentPassword = ref('')
  const nextPassword = ref('')
  const repeatPassword = ref('')
  const isPasswordChanging = ref(false)
  const passwordSchema = createPasswordSchema(createValidationMessages(t))
  const nextPasswordValidationResult = computed(() => v.safeParse(passwordSchema, nextPassword.value))
  const nextPasswordError = computed(() =>
    nextPassword.value && !nextPasswordValidationResult.value.success
      ? nextPasswordValidationResult.value.issues[0]?.message || ''
      : ''
  )
  const passwordMismatch = computed(() => Boolean(repeatPassword.value && nextPassword.value !== repeatPassword.value))
  const isPasswordSubmitDisabled = computed(
    () =>
      !currentPassword.value ||
      !nextPassword.value ||
      !repeatPassword.value ||
      Boolean(nextPasswordError.value) ||
      passwordMismatch.value
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
    nextPasswordError,
    passwordMismatch,
    repeatPassword
  }
}
