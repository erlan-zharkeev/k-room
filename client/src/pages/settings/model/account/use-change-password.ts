import { createPasswordSchema, createValidationMessages, USER_ENDPOINTS } from 'global-shared'
import * as v from 'valibot'
import { computed, reactive, ref } from 'vue'

import { useApi } from 'src/shared/api'
import { useI18n } from 'src/shared/lib'

export const useChangePassword = () => {
  const { doRequest } = useApi()
  const { t } = useI18n()
  const isPasswordChanging = ref(false)
  const passwordSchema = createPasswordSchema(createValidationMessages(t))

  const formData = reactive({
    currentPassword: { value: '', rules: [] },
    nextPassword: { value: '', rules: [] },
    repeatPassword: { value: '', rules: [] }
  })

  const nextPasswordValidationResult = computed(() => v.safeParse(passwordSchema, formData.nextPassword.value))
  const nextPasswordError = computed(() =>
    formData.nextPassword.value && !nextPasswordValidationResult.value.success
      ? nextPasswordValidationResult.value.issues[0]?.message || ''
      : ''
  )
  const passwordMismatch = computed(() =>
    Boolean(formData.repeatPassword.value && formData.nextPassword.value !== formData.repeatPassword.value)
  )
  const isPasswordSubmitDisabled = computed(
    () =>
      !formData.currentPassword.value ||
      !formData.nextPassword.value ||
      !formData.repeatPassword.value ||
      Boolean(nextPasswordError.value) ||
      passwordMismatch.value
  )

  const changePassword = async () => {
    if (isPasswordSubmitDisabled.value) return

    try {
      isPasswordChanging.value = true
      await doRequest<null>('patch', USER_ENDPOINTS.changePassword, {
        currentPassword: formData.currentPassword.value,
        password: formData.nextPassword.value
      })
      formData.currentPassword.value = ''
      formData.nextPassword.value = ''
      formData.repeatPassword.value = ''
    } finally {
      isPasswordChanging.value = false
    }
  }

  return {
    changePassword,
    formData,
    isPasswordChanging,
    isPasswordSubmitDisabled,
    nextPasswordError,
    passwordMismatch
  }
}
